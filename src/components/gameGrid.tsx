import "./gameGrid.css";
import GameCell from "./gameCell";
import { levelData } from "../data/levelData";
import image from "../assets/elephant.webp";
import { useEffect, useRef, useState } from "react";

export type GameGridProps = {
  levelData: levelData;
  currentPosition: { x: number; y: number };
  currentFacing: number;
  codeSubmitted: boolean;
  onFinishingAnimation: () => void;
};

export default function GameGrid(props: GameGridProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageOffset, setImageOffset] = useState(10);

  const [imageWidth, setImageWidth] = useState(200);
  const [gridWidth, setGridWidth] = useState(200);
  const [imageStartX, setImageStartX] = useState(imageOffset);
  const [imageStartY, setImageStartY] = useState(imageOffset);
  const [facingDirection, setFacingDirection] = useState(0);

  const [movingAnimationRunning, setMovingAnimationRunning] = useState(false);
  const [turningAnimationRunning, setTurningAnimationRunning] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) {
      return;
    }

    if (isLoaded) {
      return;
    }
    const grid = props.levelData.grid;
    const gridWidth = gridRef.current.offsetWidth / grid.columns;
    const imageWidth = gridRef.current.offsetWidth / grid.columns - 30 / grid.columns;
    const imageOffset = (gridWidth - imageWidth) / 2;

    setGridWidth(gridWidth);
    setImageWidth(imageWidth);
    setImageOffset(imageOffset);

    setImageStartX(props.levelData.startPosition.x * gridWidth + imageOffset);
    setImageStartY(props.levelData.startPosition.y * gridWidth + imageOffset);
    setFacingDirection(0);

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (props.currentPosition.x > -1 && props.currentPosition.y > -1 && props.codeSubmitted) {
      const destinationX = props.currentPosition.x * gridWidth + imageOffset;
      const destinationY = props.currentPosition.y * gridWidth + imageOffset;

      if (!isMovedToDestination(imageStartX, imageStartY, destinationX, destinationY)) {
        const stepsX = (imageStartX - destinationX) / 100;
        const stepsY = (imageStartY - destinationY) / 100;

        let currentX = imageStartX;
        let currentY = imageStartY;

        setMovingAnimationRunning(true);
        const interval = setInterval(() => {
          if (isMovedToDestination(currentX, currentY, destinationX, destinationY)) {
            clearInterval(interval);

            setImageStartX(destinationX);
            setImageStartY(destinationY);
            setMovingAnimationRunning(false);
          }

          currentX -= stepsX;
          currentY -= stepsY;

          setImageStartX(currentX);
          setImageStartY(currentY);
        }, 5);
      }
    }

    if (props.currentFacing > -1 && props.codeSubmitted) {
      const destinationFacing = props.currentFacing;

      if (!isTurned(facingDirection, destinationFacing)) {
        setTurningAnimationRunning(true);

        let currentFacing = facingDirection;
        let steps = 5;
        if (destinationFacing < facingDirection) {
          steps = -5;
        }

        const interval = setInterval(() => {
          if (isTurned(currentFacing, destinationFacing)) {
            clearInterval(interval);

            setFacingDirection(destinationFacing);
            setTurningAnimationRunning(false);
          }

          currentFacing += steps;

          if (!isTurned(currentFacing, destinationFacing)) {
            setFacingDirection(currentFacing);
          }
        }, 10);
      }
    }
  }, [props]);

  useEffect(() => {
    if (movingAnimationRunning || turningAnimationRunning || !isLoaded || !props.codeSubmitted) {
      return;
    }

    setImageStartX(props.currentPosition.x * gridWidth + imageOffset);
    setImageStartY(props.currentPosition.y * gridWidth + imageOffset);
    setFacingDirection(props.currentFacing);

    setTimeout(() => {
      props.onFinishingAnimation();
    }, 500);
  }, [movingAnimationRunning, turningAnimationRunning]);

  function isMovedToDestination(imageStartX: number, imageStartY: number, destinationX: number, destinationY: number) {
    return (
      imageStartX / destinationX > 0.95 &&
      imageStartX / destinationX < 1.05 &&
      imageStartY / destinationY > 0.95 &&
      imageStartY / destinationY < 1.05
    );
  }

  function isTurned(startFacingDirection: number, finishFacingDirection: number) {
    if (finishFacingDirection == 0 && startFacingDirection == 0) {
      return true;
    }

    if (finishFacingDirection == 0) {
      return finishFacingDirection / startFacingDirection >= 1 && finishFacingDirection / startFacingDirection < 1.05;
    }

    return startFacingDirection / finishFacingDirection >= 1 && startFacingDirection / finishFacingDirection < 1.05;
  }

  if (props.levelData.grid.columns == 0 || props.levelData.grid.rows == 0) {
    return;
  }

  const grid = props.levelData.grid;
  const finishPosition = props.levelData.finishPosition;
  const currentPosition = props.currentPosition;

  const cells = [];
  let i = 0;
  for (let row = 0; row < grid.rows; row++) {
    for (let column = 0; column < grid.columns; column++) {
      const isCurrentPosition = isMatch(currentPosition, { x: column, y: row });

      cells.push(
        <GameCell
          key={i}
          allowed={isAllowedCell({ x: column, y: row })}
          isFinish={isMatch(finishPosition, { x: column, y: row })}
          isCurrentPosition={isCurrentPosition}
          walls={getWalls({ x: column, y: row })}
        />,
      );
      i++;
    }
  }

  return (
    <>
      <style>
        {grid.columns == 1 ? ".grid-item:nth-child(odd) {  background-color: rgba(255, 255, 255, 0.1);}" : ""}
        {grid.columns == 2
          ? ".grid-item:nth-child(4n), .grid-item:nth-child(4n+1) {  background-color: rgba(255, 255, 255, 0.1);}"
          : ""}
      </style>
      <div
        className="grid-container"
        style={{
          gridTemplateColumns: "repeat(" + grid.columns + ", 1fr)",
          maxWidth: grid.columns * 200 + "px",
        }}
        ref={gridRef}
      >
        {cells}
        <img
          id="grid-image"
          src={image}
          style={{
            position: "absolute",
            top: imageStartY,
            left: imageStartX,
            zIndex: 1,
            width: imageWidth,
            rotate: `${facingDirection}deg`,
          }}
        />
      </div>
    </>
  );

  function isMatch(position1: { x: number; y: number }, position2: { x: number; y: number }) {
    return position1.x == position2.x && position1.y == position2.y;
  }

  function isAllowedCell(position: { x: number; y: number }) {
    return props.levelData.allowedCells.some((cell) => isMatch(cell, position));
  }

  function getWalls(position: { x: number; y: number }) {
    if (!props.levelData.walls) {
      return undefined;
    }

    const wallObject = props.levelData.walls.find((wallObject) => isMatch(wallObject.cell, position));
    return wallObject ? wallObject.side : undefined;
  }
}
