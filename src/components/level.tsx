import { useEffect, useRef, useState } from "react";
import GameGrid from "./gameGrid";
import "./level.css";
import { levels, levelData } from "../data/levelData";

export default function Level(){
    const [level, setLevel] = useState(1);
    const [levelData, setLevelData] = useState<levelData | undefined>();
    const [currentPosition, setCurrentPosition] = useState(0);
    const [codeLines, setCodeLines] = useState<string[]>([]);
    const [levelPassed, setLevelPassed] = useState(false);
    const [relativeSteps, setRelativeSteps] = useState(0);
    const [facing, setFacing] = useState<"forward" | "left" | "right" | "backward">("forward");
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const codeInputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const currentLevel = levels.find(x => x.level === level);
        setLevelData(currentLevel);

        if(currentLevel){
            setCurrentPosition(currentLevel.startPosition);
            setRelativeSteps(currentLevel.numberOfColumns);
        }

        if(codeInputRef.current){
            codeInputRef.current.value = "";
            codeInputRef.current.focus();
        }
    }, [level]);

    useEffect(() => {
        if(!levelData || currentPosition === levelData.startPosition){
            return;
        }
        
        if(currentPosition < 0 || currentPosition >= levelData.numberOfCells){
            setHasError(true);
            setErrorMessage("You can't move outside the maze");
            setCurrentPosition(levelData.startPosition);
        }

        if(currentPosition === levelData.finishPosition){
            setTimeout(() => {
                setLevel(oldValue => oldValue + 1);
                setLevelPassed(true);
            }, 500);
        }
    }, [levelData, currentPosition]);

    useEffect(() => {
        if(!levelData){
            return;
        }

        const line = codeLines[0];

        if(line){
            setTimeout(() => {
                if(levelData.regexTests.some(x => x.test(line))){
                    executeCodeLine(line);
                }
                else {
                    setHasError(true);
                    setErrorMessage("Read the instructions again. Your code doesn't folow the instructions.");

                    return;
                }

                setCodeLines(codeLines => codeLines.slice(1));
            }, 500);        
        }
    }, [levelData, codeLines]);

    function executeCodeLine(line: string){
        if(!levelData){
            return;
        }

        if(/^moveForward\([0-9]{0,2}\);$/.test(line)){
            const matches = line.match(/\(([^)]+)\)/g);

            let params = undefined;
            if (matches && matches.length > 0) {
                params = matches[0];
                params = params.replace(/[()]/g, '');
            }

            let paramNumber = 1;
            if(params && params.length > 0){
                paramNumber = Number(params);
                if(isNaN(paramNumber)){
                    setHasError(true);
                    setErrorMessage("You need to provide a number as parameter");

                    return;
                }
            }

            if(levelData.numberOfColumns === 1  && facing !== "forward" && facing !== "backward"){
                setHasError(true);
                setErrorMessage("You can't move forward in this direction");
                return;
            }
                
            setCurrentPosition(oldValue => oldValue - (paramNumber * relativeSteps));
        }
        else if(line.includes("rotateLeft")){
            const matches = line.match(/\(([^)]+)\)/g);

            let params = undefined;
            if (matches && matches.length > 0) {
                params = matches[0];
            }

            if(params){
                console.log(params)
                console.error("Invalid rotateLeft call");
                return;
            }

            switch(facing){
                case "forward":
                    setFacing("left");
                    setRelativeSteps(-1);
                    break;
                case "left":
                    setFacing("backward");
                    setRelativeSteps(levelData.numberOfColumns * -1);
                    break;
                case "backward":
                    setFacing("right");
                    setRelativeSteps(1);
                    break;
                case "right":
                    setFacing("forward");
                    setRelativeSteps(levelData.numberOfColumns);
                    break;
            }
        }
        else if(line.includes("rotateRight")){
            const matches = line.match(/\(([^)]+)\)/g);

            let params = undefined;
            if (matches && matches.length > 0) {
                params = matches[0];
            }

            if(params){
                console.log(params)
                console.error("Invalid rotateLeft call");
                return;
            }
                
            switch(facing){
                case "forward":
                    setFacing("right");
                    setRelativeSteps(1);
                    break;
                case "left":
                    setFacing("forward");
                    setRelativeSteps(levelData.numberOfColumns);
                    break;
                case "backward":
                    setFacing("left");
                    setRelativeSteps(-1);
                    break;
                case "right":
                    setFacing("backward");
                    setRelativeSteps(levelData.numberOfColumns * -1);
                    break;
            }
        }
        else{
            setHasError(true);
            setErrorMessage("Invalid code line found: " + line + ";");
        }
    }

    function submitCodeLines(){
        const code = codeInputRef.current?.value;
        if(!code){
            return;
        }

        let codeLines = code.replace(/(\r\n|\n|\r)/gm, "").split(";");
        codeLines = codeLines.filter(n => n && n.length > 0);
        codeLines = codeLines.map(x => x.trim() + ";");
        setCodeLines(codeLines);

        if(!levelData){
            return;
        }

        if(levelData.lineTest > -1 && levelData.lineTest !== codeLines.length){
            setHasError(true);

            if(levelData.lineTest > codeLines.length - 1){
                setErrorMessage("Read the instructions again. Your code has to many lines.");
            }
            else{
                setErrorMessage("Read the instructions again. Your code is missing lines.");
            }
        }
    }

    function nextLevel(){
        setLevelPassed(false);
    }

    function retryLevel(){
        setHasError(false);
        setErrorMessage("");
    }

    if(hasError){
        return <div>
            <h1>{errorMessage}</h1>
            <button onClick={retryLevel}>Retry level {level}</button>
        </div>
    }

    if(levelPassed){
        return <div><h1>Level passed!</h1>{levelData ? <button onClick={nextLevel}>Go to level {level}</button> : null}</div>
    }

    if(!levelData){
        return <h1>No level found...</h1>
    }

    return (
        <>
            <h1>Level {level}</h1>
            <div className="flex-container">
                <div className="flex-item">
                    <h2>Maze</h2>
                    <GameGrid levelData={levelData} currentPosition={currentPosition} />
                </div>
                <div className="flex-item">	
                    <h2>Code</h2>
                    {levelData.instructions}
                    <textarea ref={codeInputRef} style={{display: "block", width: "100%", resize: "none"}} rows={20} defaultValue={codeLines.join(";\n")}></textarea>
                    <button onClick={submitCodeLines}>Submit</button>
                </div>
            </div>
        </>
    )
}