import { useEffect, useRef, useState } from "react";
import { levelData } from "../data/levelData";
import ErrorMessage from "./errorMessage";
import MonacoEditor, { EditorConstructionOptions, monaco } from "react-monaco-editor";
import { editor, MarkerSeverity } from "monaco-editor";

import "./gameInput.css";

interface GameInputProps {
  level: number;
  levelData: levelData;
  hasError: boolean;
  errorMessage: string | null;
  setSubmittedCode: () => void;
}

export default function GameInput(props: GameInputProps) {
  const [rawCode, setRawCode] = useState("");
  const [hasError, setHasError] = useState(props.hasError);
  const [errorMessage, setErrorMessage] = useState(props.errorMessage);
  const [codeSubmitted, setCodeSubmitted] = useState(false);

  const [completedCodeLines, setCompletedCodeLines] = useState<string[]>([]);
  const [completedCodeLinesLength, setCompletedCodeLinesLength] = useState(0);

  const monacoEditorRef = useRef<editor.IStandaloneCodeEditor>(null);
  const monacoCarretPositionRef = useRef<monaco.Selection>(null);
  const timeOutRef = useRef(0);

  useEffect(() => {
    setCompletedCodeLines(props.levelData.completedCode.split("||"));
    setCompletedCodeLinesLength(props.levelData.completedCode.split("||").length);

    if (monacoEditorRef.current) {
      monacoEditorRef.current.focus();
    }
  }, [props]);

  useEffect(() => {
    if (!codeSubmitted) {
      return;
    }

    const inputCode = monacoEditorRef.current?.getValue();

    setRawCode(inputCode || "");

    if (!inputCode) {
      setHasError(true);
      setErrorMessage("Your code is missing lines.");

      return;
    }

    let codeLines = inputCode.split(/(\r\n|\n|\r)/gm);
    codeLines = codeLines.filter((n) => n && n.length > 0 && n !== ";" && n !== "\n" && n !== "\r" && n !== "\r\n");

    if (completedCodeLinesLength !== codeLines.length) {
      setHasError(true);

      if (codeLines.length < completedCodeLinesLength) {
        setErrorMessage("Your code is missing lines.");
      } else {
        setErrorMessage("Your code has to many lines.");
      }

      return;
    }

    if (!validateEdits()) {
      setHasError(true);
      setErrorMessage("Invalid code. Follow the instructions in the editor.");

      return;
    }

    props.setSubmittedCode();
  }, [codeSubmitted]);

  useEffect(() => {
    if (hasError || !monacoEditorRef.current) {
      return;
    }

    monacoEditorRef.current.focus();
  }, [hasError]);

  const lineHeight = completedCodeLinesLength + 5;
  const editorOptions: EditorConstructionOptions = {
    readOnly: codeSubmitted,
    smoothScrolling: true,
    scrollBeyondLastLine: false,
    minimap: {
      enabled: false,
    },
  };

  const classNames = ["editor"];
  if (codeSubmitted) {
    classNames.push("editor-readonly");
  }

  return (
    <>
      <h1>Level {props.level}</h1>
      {props.levelData.instructions}
      <MonacoEditor
        editorDidMount={(editor) => {
          monacoEditorRef.current = editor;
          editor.onDidChangeCursorSelection((e) => {
            monacoCarretPositionRef.current = e.selection;
          });

          editor.onKeyUp((event) => {
            if (event.ctrlKey && event.keyCode === monaco.KeyCode.Enter) {
              console.log("Submit code");
              event.preventDefault();
              if (monacoEditorRef.current) {
                setCodeSubmitted(true);
              }
            }
          });

          validateEdits();
        }}
        className={classNames.join(" ")}
        height={`${lineHeight}lh`}
        language="customCodingGameJavascript"
        theme="vs-dark"
        value={rawCode}
        options={editorOptions}
        onChange={() => {
          if (timeOutRef.current) {
            clearTimeout(timeOutRef.current);
          }
          timeOutRef.current = setTimeout(() => validateEdits(), 500);
        }}
      />
      {hasError ? (
        <ErrorMessage
          level={props.level}
          errorMessage={errorMessage || "An error has occurred."}
          onRetryLevel={onRetryLevel}
        />
      ) : (
        <button className={"editor-submit"} onClick={() => setCodeSubmitted(true)} disabled={codeSubmitted}>
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

  function validateEdits(): boolean {
    const model = monacoEditorRef.current?.getModel();
    if (!model) {
      console.error("Model not found");

      return false;
    }

    const markers: editor.IMarkerData[] = [];

    for (let i = 1; i < model.getLineCount() + 1; i++) {
      const range = {
        startLineNumber: i,
        startColumn: 1,
        endLineNumber: i,
        endColumn: model.getLineLength(i) + 1,
      };
      const content = model.getValueInRange(range).trim();

      if (content.length <= 0) {
        continue;
      }

      // Skip the editing line if it is not completed
      const editingLine = monacoCarretPositionRef.current?.positionLineNumber;
      if (
        i === editingLine &&
        !content.includes(";") &&
        monaco.editor
          .getModelMarkers({ owner: "owner" })
          .filter((x) => x.startLineNumber == i && MarkerSeverity.Error == x.severity).length == 0
      ) {
        continue;
      }

      if (content.length > 1 && !content.endsWith(";")) {
        markers.push({
          message: "; expected",
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: range.startLineNumber,
          startColumn: range.endColumn,
          endLineNumber: range.endLineNumber,
          endColumn: content.length + 1,
        });
      }

      if (!completedCodeLines[i - 1]) {
        markers.push({
          message: "invalid line",
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: range.startLineNumber,
          startColumn: range.startColumn,
          endLineNumber: range.endLineNumber,
          endColumn: content.length,
        });
      } else {
        const completedCodeLine = completedCodeLines[i - 1].trim();
        let completedCodeLineOptions = completedCodeLine.split("//");
        completedCodeLineOptions = completedCodeLineOptions.map((x) => x.trim());

        const contentTrimmed = content.trim();

        if (!completedCodeLineOptions.includes(contentTrimmed)) {
          for (let j = 0; j < completedCodeLine.length; j++) {
            if (completedCodeLine[j] !== contentTrimmed[j]) {
              markers.push({
                message: "not a valid character for this function",
                severity: monaco.MarkerSeverity.Error,
                startLineNumber: range.startLineNumber,
                startColumn: range.startColumn + j,
                endLineNumber: range.endLineNumber,
                endColumn: range.startColumn + j + 1,
              });

              markers.push({
                message: "not a valid function",
                severity: monaco.MarkerSeverity.Warning,
                startLineNumber: range.startLineNumber,
                startColumn: range.startColumn,
                endLineNumber: range.endLineNumber,
                endColumn: content.length,
              });
              break;
            }
          }
        }

        if (contentTrimmed.length > completedCodeLine.length) {
          markers.push({
            message: "not a valid function",
            severity: monaco.MarkerSeverity.Warning,
            startLineNumber: range.startLineNumber,
            startColumn: range.startColumn + completedCodeLine.length,
            endLineNumber: range.endLineNumber,
            endColumn: range.endColumn,
          });
        }
      }
    }

    monaco.editor.setModelMarkers(model, "owner", markers);

    return markers.length === 0;
  }
}
