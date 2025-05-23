import { useEffect, useRef, useState } from "react";
import "./gameCell.css";

export type GameCellProps = {
  key: number;
  allowed: boolean;
  isFinish: boolean;
  isCurrentPosition: boolean;
  walls?: ["top" | "left" | "right" | "bottom"];
};

export default function GameCell(props: GameCellProps) {
  const [gridItemHeight, setGridItemHeight] = useState(0);
  const observedGridItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observedGridItemRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (!observedGridItemRef.current) {
        return;
      }

      if (observedGridItemRef.current.offsetWidth !== gridItemHeight) {
        setGridItemHeight(observedGridItemRef.current.offsetWidth);
      }
    });

    resizeObserver.observe(observedGridItemRef.current);

    return function cleanup() {
      resizeObserver.disconnect();
    };
  }, [gridItemHeight]);

  const classNames = ["grid-item"];
  if (props.allowed) {
    classNames.push("grid-item-allowed");
  } else {
    classNames.push("grid-item-not-allowed");
  }

  if (props.isFinish) {
    classNames.push("grid-item-finish");
  }

  if (props.isCurrentPosition) {
    classNames.push("grid-item-current-position");
  }

  if (props.walls) {
    props.walls.forEach((wall) => {
      if (wall === "top") {
        classNames.push("grid-item-wall-top");
      }

      if (wall === "left") {
        classNames.push("grid-item-wall-left");
      }

      if (wall === "bottom") {
        classNames.push("grid-item-wall-bottom");
      }

      if (wall === "right") {
        classNames.push("grid-item-wall-right");
      }
    });
  }

  const style = { height: gridItemHeight };

  return (
    <div className={classNames.join(" ")} style={style} ref={observedGridItemRef}>
      {props.isFinish ? (
        <div className="grid-item-content">
          <h2>Finish</h2>
        </div>
      ) : null}
    </div>
  );
}
