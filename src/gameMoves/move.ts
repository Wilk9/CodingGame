import { levelData } from "../data/levelData";

export default function move(steps: number, levelData: levelData, currentPosition: {x: number, y: number}){
    const newPosition = {x: currentPosition.x, y: currentPosition.y - steps};

    if(!validateMove(newPosition, levelData)){
        return {valid: false, result: currentPosition};
    }

    return {valid: true, result: newPosition};
}

function validateMove(newPosition: {x: number, y: number}, levelData: levelData){
    if(newPosition.x < 0 || newPosition.x >= levelData.grid.columns || newPosition.y < 0 || newPosition.y >= levelData.grid.rows){
        return false;
    }

    return true;
}