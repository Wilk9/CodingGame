import GameGrid from "./gameGrid";

type IntroProps = {
    onStart: () => void;
}

export default function Intro(props: IntroProps){
    const introLevelData = {
        level: 1, 
        grid: {columns: 1, rows: 1},
        allowedCells: [{x: 0, y: 0}], 
        startPosition: {x: 0, y: 0}, 
        finishPosition: {x: 1, y: 1}, 
        instructions: <></>,
        regexTests: [],
        codeLines: 0,
    };

    return (
        <>
            <div className="flex-container">
                <div className="flex-item">	
                    <h1>Welcome to the game!</h1>
                    <p>Try to move the elephant to the finish while writing code.</p>
                    <button onClick={props.onStart}>Start</button>
                </div>
                <div className="flex-item">
                    <GameGrid levelData={introLevelData} currentPosition={{x: 0, y: 0}} codeSubmitted={false} onFinishingAnimation={() => {}} />
                </div>
            </div>
        </>
    )
}