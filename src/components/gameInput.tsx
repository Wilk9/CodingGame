import { useEffect, useRef, useState } from "react";
import { levelData } from "../data/levelData";
import ErrorMessage from "./errorMessage";

interface GameInputProps {
  level: number;
  levelData: levelData;
  hasError: boolean;
  errorMessage: string | null;
  setSubmittedCode: (submittedCode: string[]) => void;
}

export default function GameInput(props: GameInputProps) {
  const [rawCode, setRawCode] = useState("");
  const [hasError, setHasError] = useState(props.hasError);
  const [errorMessage, setErrorMessage] = useState(props.errorMessage);
  const [codeSubmitted, setCodeSubmitted] = useState(false);

  const codeInputRef = useRef<HTMLTextAreaElement>(null);

  const onSubmitCodeLines = (code: string | undefined) => {
    setCodeSubmitted(true);
    if (!code) {
      setHasError(true);
      setErrorMessage("You need to provide code. Read the instructions to see how to write the code.");

      return;
    }

    let codeLines = code.split(/(\r\n|\n|\r|;)/gm);
    codeLines = codeLines.filter((n) => n && n.length > 0 && n !== ";" && n !== "\n" && n !== "\r" && n !== "\r\n");
    codeLines = codeLines.map((x) => x.trim() + ";");

    if (props.levelData.codeLines > -1 && props.levelData.codeLines !== codeLines.length) {
      setHasError(true);

      if (codeLines.length - 1 > props.levelData.codeLines) {
        setErrorMessage("Read the instructions again. Your code is missing lines.");
      } else {
        setErrorMessage("Read the instructions again. Your code has to many lines.");
      }

      return;
    }

    let error = false;
    codeLines.forEach((line) => {
      if (!props.levelData.regexTests.some((x) => x.test(line))) {
        error = true;
        setHasError(true);
        setErrorMessage("Read the instructions again. Your code doesn't folow the instructions.");

        return;
      }
    });

    if (error) {
      return;
    }

    props.setSubmittedCode(codeLines);
  };

  useEffect(() => {
    const handleSubmit = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        if (codeInputRef.current) {
          e.preventDefault();
          onSubmitCodeLines(codeInputRef.current.value);
        }
      }
    };

    if (codeInputRef.current) {
      codeInputRef.current.focus();
    }

    document.addEventListener("keydown", handleSubmit);

    return () => {
      document.removeEventListener("keydown", handleSubmit);
    };
  }, [props]);

  return (
    <>
      <h1>Level {props.level}</h1>
      {props.levelData.instructions}
      <textarea
        ref={codeInputRef}
        style={{ display: "block", width: "100%", resize: "none" }}
        rows={props.levelData.codeLines + 3}
        defaultValue={rawCode}
        disabled={codeSubmitted}
      ></textarea>
      {hasError ? (
        <ErrorMessage
          level={props.level}
          errorMessage={errorMessage || "An error has occurred."}
          onRetryLevel={onRetryLevel}
        />
      ) : (
        <button onClick={onSubmit} disabled={codeSubmitted}>
          Submit
        </button>
      )}
    </>
  );

  function onRetryLevel() {
    setHasError(false);
    setErrorMessage("");
    setCodeSubmitted(false);
  }

  function onSubmit() {
    if (codeInputRef.current) {
      setRawCode(codeInputRef.current.value);
      onSubmitCodeLines(codeInputRef.current.value);
    }
  }
}
