import { useEffect, useRef, useState } from "react";
import "./gameCell.css";

export type GameCellProps = {
  key: number;
  allowed: boolean;
  isFinish: boolean;
  isCurrentPosition: boolean;
};

export default function GameCell(props: GameCellProps) {
  const [gridItemHeight, setGridItemHeight] = useState(0);
  const observedGridItem = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observedGridItem.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (!observedGridItem.current) {
        return;
      }

      if (observedGridItem.current.offsetWidth !== gridItemHeight) {
        setGridItemHeight(observedGridItem.current.offsetWidth);
      }
    });

    resizeObserver.observe(observedGridItem.current);

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

  const style = { height: gridItemHeight };

  return (
    <div className={classNames.join(" ")} style={style} ref={observedGridItem}>
      {props.isFinish ? (
        <div className="grid-item-content">
          <h2>Finish</h2>
        </div>
      ) : null}
    </div>
  );
}
