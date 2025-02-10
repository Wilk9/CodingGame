import { levelData } from "../data/levelData";
import { result } from "./result";

export default function move(
  steps: number,
  levelData: levelData,
  currentPosition: { x: number; y: number },
  currentFacing: number,
): result {
  let newPosition = { x: currentPosition.x, y: currentPosition.y - steps };
  if (currentFacing == 90) {
    newPosition = { x: currentPosition.x + steps, y: currentPosition.y };
  }
  if (currentFacing == -90) {
    newPosition = { x: currentPosition.x - steps, y: currentPosition.y };
  }
  if (currentFacing == 180) {
    newPosition = { x: currentPosition.x, y: currentPosition.y + steps };
  }

  if (!validateMove(newPosition, levelData)) {
    return {
      valid: false,
      errorMessage: "You can't move there.",
      position: currentPosition,
      facing: currentFacing,
    };
  }

  return { valid: true, errorMessage: "", position: newPosition, facing: currentFacing };
}

function validateMove(newPosition: { x: number; y: number }, levelData: levelData) {
  if (
    newPosition.x < 0 ||
    newPosition.x >= levelData.grid.columns ||
    newPosition.y < 0 ||
    newPosition.y >= levelData.grid.rows
  ) {
    return false;
  }

  return true;
}
