import { useState } from "react";
import "./App.css";
import Level from "./components/level";
import Intro from "./components/intro";
import CompletedGame from "./components/completedGame";
import { levels } from "./data/levelData";
import CompletedLevel from "./components/completedLevel";

export default function App() {
  const [level, setLevel] = useState(1);
  const [levelChanged, setLevelChanged] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasCompletedGame, setHasCompletedGame] = useState(false);

  const onStart = () => {
    setHasStarted(true);
  };

  const onCompletedLevel = () => {
    if (level < levels.length) {
      setLevelChanged(true);
    } else {
      setHasCompletedGame(true);
    }
  };

  const onStartNewLevel = () => {
    setLevelChanged(false);
    setLevel(level + 1);
  };

  const onRetryLevel = (level: number) => {
    setHasCompletedGame(false);
    setLevel(level);
  };

  if (!hasStarted) {
    return <Intro onStart={onStart} />;
  }

  if (levelChanged) {
    return <CompletedLevel level={level} onStartNewLevel={onStartNewLevel} />;
  }

  if (!hasCompletedGame) {
    return <Level level={level} onCompleted={onCompletedLevel} />;
  }

  return <CompletedGame onRetryLevel={onRetryLevel} />;
}
