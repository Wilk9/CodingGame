import "./gameGrid.css";
import GameCell from "./gameCell";
import { levelData } from "../data/levelData";

export type GameGridProps = {
    levelData: levelData;
    currentPosition: number;
}

export default function GameGrid(props: GameGridProps){
    if(props.levelData.numberOfCells < 1){
        return;
    }

    const cells= [<GameCell key={0} allowed={props.levelData.allowedCells.includes(0)} isFinish={props.levelData.finishPosition == 0} isCurrentPosition={props.currentPosition == 0} />];
    for(let x = 1; x < props.levelData.numberOfCells; x++){
        cells.push(<GameCell key={x} allowed={props.levelData.allowedCells.includes(x)} isFinish={props.levelData.finishPosition == x} isCurrentPosition={props.currentPosition == x} />);
    }

    return (
        <div className="grid-container" style={{gridTemplateColumns: "repeat(" + props.levelData.numberOfColumns + ", 1fr)", maxWidth: props.levelData.numberOfColumns * 200 +"px"}}>
            {cells}
        </div>
    )
}