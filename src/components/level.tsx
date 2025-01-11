import { useCallback, useEffect, useMemo, useState } from "react";
import GameGrid from "./gameGrid";
import "./level.css";
import { levels } from "../data/levelData";
import move from "../gameMoves/move";
import GameInput from "./gameInput";

interface LevelProps {
  level: number;
  onCompleted: () => void;
};

export default function Level(props: LevelProps) {
  const levelData = useMemo(() => {
    return levels[props.level - 1];
  }, [props.level]);

  const [currentPosition, setCurrentPosition] = useState({
    x: levelData.startPosition.x,
    y: levelData.startPosition.y,
  });
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [animationIsRunning, setAnimationIsRunning] = useState(false);

  const getParams = useCallback((line: string): string[] => {
    const matches = line.match(/\(([^)]+)\)/g);

    let paramString = undefined;
    let params: string[] = [];
    if (matches && matches.length > 0) {
      paramString = matches[0];
      paramString = paramString.replace(/[()]/g, "");

      paramString = paramString.trim();
      if (paramString.length > 0) {
        params = paramString.split(",");
      }
    }

    return params;
  }, []);

  const getSteps = useCallback((params: string[]) => {
    if (params.length == 0) {
      return 1;
    }

    const steps = Number(params[0]);
    if (!isNaN(steps) && steps > 0) {
      return steps;
    }

    setHasError(true);
    setErrorMessage("You need to provide a number as parameter");

    return -1;
  }, []);

  const movePlayer = useCallback(
    (
      line: string,
      position: { x: number; y: number },
      actions: {
        type: "start" | "move";
        steps: number;
        position: { x: number; y: number };
        hasError: boolean;
        errorMessage: string | null;
      }[],
    ) => {
      const params = getParams(line);
      const steps = getSteps(params);

      const moveResult = move(steps, levelData, position);
      if (!moveResult.valid) {
        actions.push({
          type: "move",
          steps: steps,
          position: moveResult.result,
          hasError: true,
          errorMessage: "You can't move there.",
        });

        return;
      }

      let error = false;
      let errorMessage: string | null = null;
      const errorAction = actions.find((x) => x.hasError);
      if (errorAction) {
        error = true;
        errorMessage = errorAction.errorMessage;
      }

      actions.push({
        type: "move",
        steps: steps,
        position: moveResult.result,
        hasError: error,
        errorMessage: errorMessage,
      });
    },
    [],
  );

  useEffect(() => {
    if (!codeSubmitted || animationIsRunning) {
      return;
    }

    const executingCodeLines = codeLines;
    const actions: {
      type: "start" | "move";
      steps: number;
      position: { x: number; y: number };
      hasError: boolean;
      errorMessage: string | null;
    }[] = [{ type: "start", steps: 0, position: currentPosition, hasError: false, errorMessage: null }];

    executingCodeLines.forEach((line) => {
      if (line) {
        if (/^move\([0-9]{0,2}\);$/.test(line)) {
          movePlayer(line, actions[actions.length - 1].position, actions);

          return;
        }

        setHasError(true);
        setErrorMessage("Invalid code line found: " + line + ";");

        return;
      }
    });

    actions.forEach((action, i) => {
      if (action.type == "move") {
        if (action.hasError) {
          setHasError(true);
          setErrorMessage(action.errorMessage || "An error occurred.");
        }

        if (actions[i + 1] !== undefined && actions[i + 1].type == "move") {
          return;
        }

        setCurrentPosition(action.position);
        setAnimationIsRunning(true);
      }
    });
  }, [codeLines, codeSubmitted, levelData, getParams, getSteps]);

  function setSubmittedCode(codeLines: string[]) {
    setCodeLines(codeLines);
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
            onRetryLevel={onRetryLevel}
            setSubmittedCode={setSubmittedCode}
          />
      </div>
      <div className="flex-item">
        <GameGrid
          levelData={levelData}
          currentPosition={currentPosition}
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

  function onRetryLevel() {
    setHasError(false);
    setErrorMessage("");
    setCodeSubmitted(false);
  }
}
