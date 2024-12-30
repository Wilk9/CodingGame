type ErrorMessageProps = {
    level: number;
    errorMessage: string;
    onRetryLevel: () => void;
}

export default function ErrorMessage(props: ErrorMessageProps){
    return (
        <div>
            <h1>Level {props.level}</h1>
            <h3>{props.errorMessage}</h3>
            <button onClick={props.onRetryLevel}>Retry level {props.level}</button>
        </div>
    );
}