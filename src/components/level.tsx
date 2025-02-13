import { useEffect, useMemo, useState } from "react";
import GameGrid from "./gameGrid";
import "./level.css";
import { levels, Move, Turn } from "../data/levelData";
import move from "../gameMoves/move";
import GameInput from "./gameInput";
import turn from "../gameMoves/turn";

interface LevelProps {
  level: number;
  onCompleted: () => void;
}

export default function Level(props: LevelProps) {
  const levelData = useMemo(() => {
    return levels[props.level - 1];
  }, [props.level]);

  const [currentPosition, setCurrentPosition] = useState({
    x: levelData.startPosition.x,
    y: levelData.startPosition.y,
  });
  const [currentFacing, setCurrentFacing] = useState(0);

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [animationIsRunning, setAnimationIsRunning] = useState(false);
  const [executedAnimationLine, setExecutedAnimationLine] = useState(-1);

  useEffect(() => {
    if (!codeSubmitted || animationIsRunning) {
      return;
    }

    if (levelData.actions.length == executedAnimationLine + 1) {
      return;
    }

    let errorMessage = "An error occurred.";
    const actionToExecute = levelData.actions[executedAnimationLine + 1];
    if (actionToExecute === undefined) {
      console.error(`${errorMessage}: Action is undefined...`);

      return;
    }

    if (actionToExecute instanceof Move) {
      const moveAction: Move = actionToExecute;
      const actionResult = move(moveAction.params, levelData, currentPosition, currentFacing);

      if (actionResult.valid) {
        setCurrentPosition(actionResult.position);
        setAnimationIsRunning(true);
        setExecutedAnimationLine((x) => x + 1);

        return;
      }

      errorMessage = actionResult.errorMessage;
    }

    if (actionToExecute instanceof Turn) {
      const turnAction: Turn = actionToExecute;
      const actionResult = turn(turnAction.params, currentFacing);

      if (actionResult.valid) {
        setCurrentFacing(actionResult.facing);
        setAnimationIsRunning(true);
        setExecutedAnimationLine((x) => x + 1);

        return;
      }

      errorMessage = actionResult.errorMessage;
    }

    setHasError(true);
    setErrorMessage(errorMessage);

    console.error(errorMessage);
  }, [codeSubmitted, levelData, animationIsRunning, executedAnimationLine]);

  function setSubmittedCode() {
    setCodeSubmitted(true);
  }

  return (
    <div className="flex-container">
      <div className="flex-item">
        <GameInput
          level={props.level}
          levelData={levelData}
          hasError={hasError}
          errorMessage={errorMessage}
          setSubmittedCode={setSubmittedCode}
        />
      </div>
      <div className="flex-item">
        <GameGrid
          levelData={levelData}
          currentPosition={currentPosition}
          currentFacing={currentFacing}
          codeSubmitted={codeSubmitted}
          onFinishingAnimation={onFinishingAnimation}
        />
      </div>
    </div>
  );

  function onFinishingAnimation() {
    setAnimationIsRunning(false);

    if (currentPosition.x === levelData.finishPosition.x && currentPosition.y === levelData.finishPosition.y) {
      props.onCompleted();
    }
  }
}
