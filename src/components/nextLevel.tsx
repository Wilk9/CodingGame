type NextLevelProps = {
    level: number;
    onNextLevel: () => void;
} 

export default function NextLevel(props: NextLevelProps){
    return <div><h1>Level {props.level} passed!</h1><button onClick={props.onNextLevel}>Go to level {props.level + 1}</button></div>
};