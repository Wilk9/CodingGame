import * as React from "react";

export type levelData = {
  level: number;
  grid: { columns: number; rows: number };
  allowedCells: { x: number; y: number }[];
  startPosition: { x: number; y: number };
  finishPosition: { x: number; y: number };
  instructions: React.JSX.Element;
  completedCode: string;
};

export const levels: levelData[] = [
  {
    level: 1,
    grid: { columns: 1, rows: 2 },
    allowedCells: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ],
    startPosition: { x: 0, y: 1 },
    finishPosition: { x: 0, y: 0 },
    instructions: (
      <p>
        You can move forward by typing <code>move();</code>. <br />
        When you type <code>move();</code> you call a function named <code>move</code> and that function executes the
        move.
      </p>
    ),
    completedCode: "move();",
  },
  {
    level: 2,
    grid: { columns: 1, rows: 3 },
    allowedCells: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ],
    startPosition: { x: 0, y: 2 },
    finishPosition: { x: 0, y: 0 },
    instructions: (
      <p>
        You can move 2 places forward, using the <code>move</code> function 2 times.
        <br />
        TIP: Don't forget to add a <code>;</code> at the end of each line.
      </p>
    ),
    completedCode: "move(); || move();",
  },
  {
    level: 3,
    grid: { columns: 1, rows: 3 },
    allowedCells: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ],
    startPosition: { x: 0, y: 2 },
    finishPosition: { x: 0, y: 0 },
    instructions: (
      <p>
        You can also move 2 places forward, typing the <code>move</code> function one time. <br />
        You have to set a value (parameter) in between the parenthesis, for example <code>move(2)</code>.
      </p>
    ),
    completedCode: "move(2);",
  },
];
