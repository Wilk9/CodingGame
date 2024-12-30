import { useEffect, useRef, useState } from "react";
import { levelData } from "../data/levelData";

type GameInputProps = {
    level: number;
    levelData: levelData;
    codeSubmitted: boolean;
    onSubmitCodeLines: (code: string | undefined) => void;
}

export default function GameInput(props: GameInputProps){
    const [rawCode, setRawCode] = useState("");
        
    const codeInputRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "Enter") {
            if(codeInputRef.current){
                e.preventDefault();
                props.onSubmitCodeLines(codeInputRef.current.value);
            }
        }
    }

    useEffect(() => {
        if(codeInputRef.current){
            codeInputRef.current.focus();
        }

        document.addEventListener ("keydown", handleSubmit );

        return () => { document.removeEventListener ("keydown", handleSubmit)};
    }, []);

    return (
    <>
        <h1>Level {props.level}</h1>
        {props.levelData.instructions}
        <textarea ref={codeInputRef} style={{display: "block", width: "100%", resize: "none"}} rows={props.levelData.codeLines + 3} defaultValue={rawCode} disabled={props.codeSubmitted}></textarea>
        <button onClick={onSubmit} disabled={props.codeSubmitted}>Submit</button>
    </>);

    function onSubmit(){
        if(codeInputRef.current){
            setRawCode(codeInputRef.current.value);
            props.onSubmitCodeLines(codeInputRef.current.value);
        }
    }
}