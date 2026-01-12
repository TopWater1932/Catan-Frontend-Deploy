import { useState, useEffect } from "react"



function TimerContent( ) {
    
    const [timer,setTimer] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => prev + 1);
        },1000);
        return () => clearInterval(interval);
    },[]);

    return (
        <>
            <p>Waiting for other players to respond to your trade proposal:</p>
            <br/>
            <p>{`\n${timer}sec`}</p>
        </>
    )
}

export default TimerContent;