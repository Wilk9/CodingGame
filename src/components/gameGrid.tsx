import "./gameGrid.css";
import GameCell from "./gameCell";
import { levelData } from "../data/levelData";
import image from "../assets/elephant.webp"
import { useEffect, useRef, useState } from "react";

export type GameGridProps = {
    levelData: levelData;
    currentPosition: {x: number, y: number};
    codeSubmitted: boolean;
    onFinishingAnimation: () => void;
}

export default function GameGrid(props: GameGridProps){
    const [imageWidth, setImageWidth] = useState(200);
    const [imageStartX, setImageStartX] = useState(15);
    const [imageStartY, setImageStartY] = useState(15);

    const myRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(myRef.current){
            const grid = props.levelData.grid;
            const gridWidth = myRef.current.offsetWidth / grid.columns;
            setImageWidth(myRef.current.offsetWidth / grid.columns - 30 / grid.columns);

            if(props.levelData.startPosition.x == props.currentPosition.x && props.levelData.startPosition.y == props.currentPosition.y){
                setImageStartX(props.currentPosition.x * gridWidth + 15);
                setImageStartY(props.currentPosition.y * gridWidth + 15);

                return;
            }

            if (props.currentPosition.x > -1 && props.currentPosition.y > -1 && props.codeSubmitted){
                const destinationX = props.currentPosition.x * gridWidth + 15;
                const destinationY = props.currentPosition.y * gridWidth + 15;

                const stepsX = (imageStartX - destinationX) / 100;
                const stepsY = (imageStartY - destinationY) / 100;

                let currentX = imageStartX;
                let currentY = imageStartY;
                const interval = setInterval(() => {
                    if(isMovedToDestination(currentX, currentY, destinationX, destinationY)){
                        clearInterval(interval);
                        props.onFinishingAnimation();
                    }

                    currentX -= stepsX;
                    currentY -= stepsY;

                    setImageStartX(currentX);
                    setImageStartY(currentY);
                }, 5);
            }
        }
    }, [props]);

    function isMovedToDestination(imageStartX: number, imageStartY: number, destinationX: number, destinationY: number){
        return imageStartX / destinationX > 0.95 && imageStartX / destinationX < 1.05 
        && imageStartY / destinationY > 0.95 && imageStartY / destinationY < 1.05;
    }

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
        <div className="grid-container" style={{gridTemplateColumns: "repeat(" + grid.columns + ", 1fr)", maxWidth: grid.columns * 200 +"px"}} ref={myRef}>
            {cells}
            <img id="grid-image" src={image} style={{position: "absolute", top: imageStartY, left: imageStartX, zIndex: 1, width: imageWidth}} />
        </div>
    )

    function isMatch(position1: {x: number, y: number}, position2: {x: number, y: number}){
        return position1.x == position2.x && position1.y == position2.y;
    }
    
    function isAllowedCell(position: {x: number, y: number}){
        return props.levelData.allowedCells.some(cell => cell.x === position.x && cell.y === position.y);
    }
}