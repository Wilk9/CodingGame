import * as React from 'react';

export type levelData = {
    level: number;
    numberOfCells: number;
    numberOfColumns: number;
    allowedCells: number[];
    startPosition: number;
    finishPosition: number;
    instructions: React.JSX.Element;
    regexTests: RegExp[];
    lineTest: number;
}

export const levels:levelData[] = [
    {
        level: 1, 
        numberOfCells: 2, 
        numberOfColumns: 1, 
        allowedCells: [0,1], 
        startPosition: 1, 
        finishPosition: 0, 
        instructions: <p>You can move forward, using the <code>moveForward()</code> function.<br/>TIP: Don't forget to add a <code>;</code> after the <code>moveForward()</code> function.</p>,
        regexTests: [/^moveForward\(\);$/],
        lineTest: -1,
    },
    {
        level: 2, 
        numberOfCells: 3, 
        numberOfColumns: 1, 
        allowedCells: [0,1,2], 
        startPosition: 2, 
        finishPosition: 0, 
        instructions: <p>You can move 2 places forward, using the <code>moveForward()</code> function 2 times.<br/>TIP: Don't forget to add a <code>;</code> at the end of each line.</p>,
        regexTests: [/^moveForward\(\);$/],
        lineTest: 2,
    },
    {
        level: 3, 
        numberOfCells: 3, 
        numberOfColumns: 1, 
        allowedCells: [0,1,2], 
        startPosition: 2, 
        finishPosition: 0, 
        instructions: <p>You can also move 2 places forward, using the <code>moveForward()</code> function one time. Use it like this <code>moveForward(2)</code> <br/>TIP: Don't forget to add a <code>;</code> after the function.</p>,
        regexTests: [/^moveForward\(2\);$/],
        lineTest: 1,
    },
];