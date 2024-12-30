import { useEffect, useState } from "react";
import GameGrid from "./gameGrid";
import "./level.css";
import { levels } from "../data/levelData";
import move from "../gameMoves/move";
import ErrorMessage from "./errorMessage";
import GameInput from "./gameInput";

type LevelProps = {
    level: number;
    onCompleted: () => void;
}

export default function Level(props: LevelProps){
    const levelData = levels[props.level - 1];

    const [currentPosition, setCurrentPosition] = useState({x: levelData.startPosition.x, y: levelData.startPosition.y});
    const [codeLines, setCodeLines] = useState<string[]>([]);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [codeSubmitted, setCodeSubmitted] = useState(false);
    const [animationIsRunning, setAnimationIsRunning] = useState(false);

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

    const onSubmitCodeLines = (code: string | undefined) => {
        if(!code){
            setHasError(true);
            setErrorMessage("You need to provide code. Read the instructions to see how to write the code.");

            return;
        }

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
    
    let leftContent = <GameInput level={props.level} levelData={levelData} codeSubmitted={codeSubmitted} onSubmitCodeLines={onSubmitCodeLines} />;

    if(hasError){
        leftContent = <ErrorMessage level={props.level} errorMessage={errorMessage} onRetryLevel={onRetryLevel} />
    }

    return (
        <div className="flex-container">
            <div className="flex-item">	
                {leftContent}
            </div>
            <div className="flex-item">
                <GameGrid levelData={levelData} currentPosition={currentPosition} codeSubmitted={codeSubmitted} onFinishingAnimation={onFinishingAnimation} />
            </div>
        </div>
    )

    function onFinishingAnimation(){
        setAnimationIsRunning(false);

        if(currentPosition.x === levelData.finishPosition.x && currentPosition.y === levelData.finishPosition.y){
            props.onCompleted();
        }
    }

    function onRetryLevel(){
        setHasError(false);
        setErrorMessage("");
        setCodeSubmitted(false);
    }
}