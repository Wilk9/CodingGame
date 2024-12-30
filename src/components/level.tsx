import { useEffect, useRef, useState } from "react";
import GameGrid from "./gameGrid";
import "./level.css";
import { levels, levelData } from "../data/levelData";
import move from "../gameMoves/move";
import ErrorMessage from "./errorMessage";
import NextLevel from "./nextLevel";
import CompletedGame from "./completedGame";

export default function Level(){
    const [level, setLevel] = useState(1);
    const [levelData, setLevelData] = useState<levelData>(levels[0]);
    const [currentPosition, setCurrentPosition] = useState({x: -1, y: -1});
    const [rawCode, setRawCode] = useState("");
    const [codeLines, setCodeLines] = useState<string[]>([]);
    const [levelPassed, setLevelPassed] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [codeSubmitted, setCodeSubmitted] = useState(false);
    const [completedAllLevels, setCompletedAllLevels] = useState(false);
    const [animationIsRunning, setAnimationIsRunning] = useState(false);

    const codeInputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setCurrentPosition({x: -1, y: -1});
        setRawCode("");
        setCodeLines([]);
        setLevelPassed(false);
        setCodeSubmitted(false);
        setCompletedAllLevels(false);

        const currentLevel = levels.find(x => x.level === level);
        if(!currentLevel){
            return;
        }

        setLevelData(currentLevel);

        if(currentLevel){
            setCurrentPosition(currentLevel.startPosition);
        }

        if(codeInputRef.current){
            codeInputRef.current.focus();
        }
    }, [level]);

    useEffect(() => {
        if(!codeSubmitted || animationIsRunning){
            return;
        }

        let positionDuringExecution = currentPosition;

        codeLines.forEach(line => {
            if(line){
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
        
                    const moveResult = move(steps, levelData, positionDuringExecution);
                    if(!moveResult.valid){
                        setHasError(true);
                        setErrorMessage("You can't move there.");
        
                        return;
                    }
    
                    positionDuringExecution = moveResult.result;
                }
                else{
                    setHasError(true);
                    setErrorMessage("Invalid code line found: " + line + ";");
    
                    return;
                }
            }
        });

        setCurrentPosition(positionDuringExecution);
        setAnimationIsRunning(true);
    }, [codeLines, codeSubmitted]);

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
    
    let leftContent = <>
        <h1>Level {level}</h1>
        {levelData.instructions}
        <textarea ref={codeInputRef} style={{display: "block", width: "100%", resize: "none"}} rows={levelData.codeLines + 3} defaultValue={rawCode} disabled={codeSubmitted}></textarea>
        <button onClick={submitCodeLines} disabled={codeSubmitted}>Submit</button>
    </>;

    if(completedAllLevels){
        leftContent = <CompletedGame onGoToLevel={onGoToLevel} />
    }

    if(hasError){
        leftContent = <ErrorMessage level={level} errorMessage={errorMessage} onRetryLevel={onRetryLevel} />
    }

    if(levelPassed){
        leftContent = <NextLevel level={level} onNextLevel={onNextLevel} />
    }

    return (
        <>
            <div className="flex-container">
                <div className="flex-item">	
                    {leftContent}
                </div>
                <div className="flex-item">
                    <GameGrid levelData={levelData} currentPosition={currentPosition} codeSubmitted={codeSubmitted} onFinishingAnimation={() => onFinishingAnimation(level)} />
                </div>
            </div>
        </>
    )

    function onFinishingAnimation(finishedLevel: number){
        setAnimationIsRunning(false);

        if(!codeSubmitted || finishedLevel !== level){
            return;
        }

        if(currentPosition.x === levelData.startPosition.x && currentPosition.y === levelData.startPosition.y){
            return;
        }

        if(currentPosition.x === levelData.finishPosition.x && currentPosition.y === levelData.finishPosition.y){
            setCodeSubmitted(false);
            if(finishedLevel < levels.length){
                setLevelPassed(true);
            }
            else{
                setCompletedAllLevels(true);
            }
        }
    }

    function onNextLevel(){
        setLevel(oldValue => oldValue + 1);
    }

    function onRetryLevel(){
        setHasError(false);
        setErrorMessage("");
        setCodeSubmitted(false);
    }

    function onGoToLevel(level: number){
        setLevel(level);
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

        if(levelData.codeLines > -1 && levelData.codeLines !== codeLines.length){
            setHasError(true);

            if(codeLines.length - 1 > levelData.codeLines){
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
        setCodeSubmitted(true);
    }
}