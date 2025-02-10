import { result } from "./result";

export default function move(degrees: number, currentFacing: number): result {
  const facing = setFacing(currentFacing + degrees);

  if (!validateMove(facing)) {
    return {
      valid: false,
      errorMessage: "This is not a valid turn.",
      position: { x: 0, y: 0 },
      facing: currentFacing,
    };
  }

  return { valid: true, errorMessage: "", position: { x: 0, y: 0 }, facing: facing };
}

function setFacing(newFacing: number) {
  if (newFacing == 360) return 0;

  if (newFacing == -90) {
    return 270;
  }

  return newFacing;
}

function validateMove(facing: number) {
  if (facing == 0 || facing == 90 || facing == 180 || facing == 270) {
    return true;
  }

  return false;
}
