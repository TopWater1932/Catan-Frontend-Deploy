import { useState, useEffect } from "react"

interface TimerContentArgs {
    message: string;
}

function TimerContent( {message}: TimerContentArgs) {
    
    const [timer,setTimer] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => prev + 1);
        },1000);
        return () => clearInterval(interval);
    },[]);

    return (
        <>
            <p>{message}</p>
            <br/>
            <p>{`\n${timer}sec`}</p>
        </>
    )
}

export default TimerContent;