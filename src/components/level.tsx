import { useEffect, useRef, useState } from "react";
import GameGrid from "./gameGrid";
import "./level.css";
import { levels, levelData } from "../data/levelData";
import move from "../gameMoves/move";

export default function Level(){
    const [level, setLevel] = useState(1);
    const [levelData, setLevelData] = useState<levelData>(levels[0]);
    const [currentPosition, setCurrentPosition] = useState({x: -1, y: -1});
    const [rawCode, setRawCode] = useState("");
    const [codeLines, setCodeLines] = useState<string[]>([]);
    const [levelPassed, setLevelPassed] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [completed, setCompleted] = useState(false);

    const codeInputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const currentLevel = levels.find(x => x.level === level);
        if(!currentLevel){
            return;
        }

        setLevelData(currentLevel);

        if(currentLevel){
            setCurrentPosition(currentLevel.startPosition);
        }

        setRawCode("");
        if(codeInputRef.current){
            codeInputRef.current.focus();
        }
    }, [level, completed]);

    useEffect(() => {
        const line = codeLines[0];

        if(line){
            setTimeout(() => {
                if(/^move\([0-9]{0,2}\);$/.test(line)){
                    const params = getParams(line);
        
                    let steps = 1;
                    if(params.length > 0){
                        steps = Number(params[0]);
                        if(isNaN(steps)){
                            setHasError(true);
                            setErrorMessage("You need to provide a number as parameter");
        
                            return;
                        }
                    }
        
                    const moveResult = move(steps, levelData, currentPosition);
                    if(!moveResult.valid){
                        setHasError(true);
                        setErrorMessage("You can't move there.");
        
                        return;
                    }

                    setCurrentPosition(moveResult.result);
                }
                else{
                    setHasError(true);
                    setErrorMessage("Invalid code line found: " + line + ";");

                    return;
                }
                
                const newCodeLines = codeLines.slice(1);
                setCodeLines(newCodeLines);             
            }, 500);
        }
    }, [codeLines]);

    useEffect(() => {
        if(currentPosition.x === levelData.startPosition.x && currentPosition.y === levelData.startPosition.y){
            return;
        }

        if(currentPosition.x === levelData.finishPosition.x && currentPosition.y === levelData.finishPosition.y){
            setTimeout(() => {
                if(level < levels.length){
                    setLevel(oldValue => oldValue + 1);
                    setLevelPassed(true);
                }
                else{
                    setCompleted(true);
                }
            }, 500);
        }
    }, [currentPosition]);

    function getParams(line: string): string[] {
        const matches = line.match(/\(([^)]+)\)/g);

        let paramString = undefined;
        let params: string[] = [];
        if (matches && matches.length > 0) {
            paramString = matches[0];
            paramString = paramString.replace(/[()]/g, '');

            paramString = paramString.trim();
            if(paramString.length > 0){
                params = paramString.split(",");
            }
        }

        return params;
    }
    
    if(completed){
        const buttons = levels.map((x: levelData) => (<button key={x.level} onClick={() => goToLevel(x.level)}>Start level {x.level}</button>));
        return <div><h1>You've completed all the levels!!!</h1>
            {buttons}
        </div>
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
                    <textarea ref={codeInputRef} style={{display: "block", width: "100%", resize: "none"}} rows={20} defaultValue={rawCode}></textarea>
                    <button onClick={submitCodeLines} disabled={submitDisabled}>Submit</button>
                </div>
            </div>
        </>
    )

    function nextLevel(){
        setLevelPassed(false);
        setSubmitDisabled(false);
    }

    function retryLevel(){
        setHasError(false);
        setErrorMessage("");
        setSubmitDisabled(false);
    }

    function goToLevel(level: number){
        setLevelPassed(false);
        setSubmitDisabled(false);
        setLevel(level);
        setCompleted(false);
    }

    function submitCodeLines(){
        const code = codeInputRef.current?.value;
        if(!code){
            setHasError(true);
            setErrorMessage("You need to provide code. Read the instructions to see how to write the code.");

            return;
        }

        setRawCode(code);

        let codeLines = code.split(/(\r\n|\n|\r|;)/gm);
        codeLines = codeLines.filter(n => n && n.length > 0 && n !== ";" && n !== "\n" && n !== "\r" && n !== "\r\n");
        codeLines = codeLines.map(x => x.trim() + ";");

        if(levelData.lineTest > -1 && levelData.lineTest !== codeLines.length){
            setHasError(true);

            if(codeLines.length - 1 > levelData.lineTest){
                setErrorMessage("Read the instructions again. Your code has to many lines.");
            }
            else{
                setErrorMessage("Read the instructions again. Your code is missing lines.");
            }

            return;
        }

        let error = false;
        codeLines.forEach(line => {
            if(!levelData.regexTests.some(x => x.test(line))){
                error = true;
                setHasError(true);
                setErrorMessage("Read the instructions again. Your code doesn't folow the instructions.");

                return;
            }
        });

        if(error){
            return;
        }

        setCodeLines(codeLines);
        setSubmitDisabled(true);
    }
}