import "./gameGrid.css";
import GameCell from "./gameCell";
import { levelData } from "../data/levelData";

export type GameGridProps = {
    levelData: levelData;
    currentPosition: {x: number, y: number};
}

export default function GameGrid(props: GameGridProps){
    if(props.levelData.grid.columns == 0 || props.levelData.grid.rows == 0){
        return;
    }

    const grid = props.levelData.grid;
    const finishPosition = props.levelData.finishPosition;
    const currentPosition = props.currentPosition;

    const cells= [];
    let i = 0;
    for(let column = 0; column < grid.columns; column++){
        for(let row = 0; row < grid.rows; row++){
            cells.push(<GameCell key={i} allowed={isAllowedCell({x: column, y: row})} isFinish={isMatch(finishPosition, {x: column, y: row})} isCurrentPosition={isMatch(currentPosition, {x: column, y: row})} />);
            i++;
        }
    }

    return (
        <div className="grid-container" style={{gridTemplateColumns: "repeat(" + grid.columns + ", 1fr)", maxWidth: grid.columns * 200 +"px"}}>
            {cells}
        </div>
    )

    function isMatch(position1: {x: number, y: number}, position2: {x: number, y: number}){
        return position1.x == position2.x && position1.y == position2.y;
    }
    
    function isAllowedCell(position: {x: number, y: number}){
        return props.levelData.allowedCells.some(cell => cell.x === position.x && cell.y === position.y);
    }
}