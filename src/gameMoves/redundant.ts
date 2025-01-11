// import { levelData } from "../data/levelData";

// function setFacing(line: string, facing: "forward" | "left" | "right" | "backward", levelData: levelData, setFacing : any, setRelativeSteps: any){
//     if(line.includes("rotateLeft")){
//         const matches = line.match(/\(([^)]+)\)/g);

//         let params = undefined;
//         if (matches && matches.length > 0) {
//             params = matches[0];
//         }

//         if(params){
//             console.log(params)
//             console.error("Invalid rotateLeft call");
//             return;
//         }

//         switch(facing){
//             case "forward":
//                 setFacing("left");
//                 setRelativeSteps(-1);
//                 break;
//             case "left":
//                 setFacing("backward");

//                 break;
//             case "backward":
//                 setFacing("right");
//                 setRelativeSteps(1);
//                 break;
//             case "right":
//                 setFacing("forward");

//                 break;
//         }
//     }
//     else if(line.includes("rotateRight")){
//         const matches = line.match(/\(([^)]+)\)/g);

//         let params = undefined;
//         if (matches && matches.length > 0) {
//             params = matches[0];
//         }

//         if(params){
//             console.log(params)
//             console.error("Invalid rotateLeft call");
//             return;
//         }

//         switch(facing){
//             case "forward":
//                 setFacing("right");
//                 setRelativeSteps(1);
//                 break;
//             case "left":
//                 setFacing("forward");

//                 break;
//             case "backward":
//                 setFacing("left");
//                 setRelativeSteps(-1);
//                 break;
//             case "right":
//                 setFacing("backward");

//                 break;
//         }
//     }
// }
