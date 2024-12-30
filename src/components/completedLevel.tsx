import { useEffect } from "react";

type NextLevelProps = {
    level: number;
    onStartNewLevel: () => void;
} 

export default function CompletedLevel(props: NextLevelProps){
    const handleSubmit = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            props.onStartNewLevel();
        }
    }

    useEffect(() => {
        document.addEventListener ("keydown", handleSubmit );

        return () => { document.removeEventListener ("keydown", handleSubmit)};
    }, []);

    return (
        <div>
            <h1>Level {props.level} passed!</h1>
            <button onClick={props.onStartNewLevel}>Go to level {props.level + 1}</button>
        </div>
    )
};