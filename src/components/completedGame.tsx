import { levelData, levels } from "../data/levelData";

type CompletedGameProps = {
  onRetryLevel: (level: number) => void;
};

export default function CompletedGame(props: CompletedGameProps) {
  return (
    <div>
      <h1>Congratulations! You have completed all levels!</h1>
      <h3>Thank you for playing!</h3>
      <p>Do you want to retry a level? Click one of the buttons below.</p>
      {levels.map((x: levelData) => (
        <button key={x.level} onClick={() => props.onRetryLevel(x.level)}>
          {x.level}
        </button>
      ))}
    </div>
  );
}
