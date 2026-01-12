import { useContext, useState, useEffect } from "react"
import { useWebSocketContext } from '../../context/WebsocketContext'
import { ModalContext } from "../../context/ModalContext.jsx";
import TimerContent from "./TimerContent.jsx";
import TradeResourceSelection from "./TradeResourceSelection.jsx";
import '../../styles/options-modal.css'


function PlayerTradeModalContent( ) {

    const {players,turn} = useWebSocketContext();
    const {resources} = players[turn];

    const {setIsEnabled} = useContext(ModalContext);

    const [waiting,setWaiting] = useState(false);

    const giveArray = Object.keys(resources);


    const handlePropose = (e: ReactMouseEvent) => {
        e.preventDefault()
        setIsEnabled(false);
        setWaiting(true);
    }
    
    if (waiting) {
        return (
            <>
                <TimerContent />
            </>
        )
    } else {
        return (
        <>
            <TradeResourceSelection
                dialogueType={'number'}
                buttons={[
                    {'text':'Propose','type':'submit','callback':handlePropose}
                ]}
                giveTitle={`You Give:`}
                receiveTitle={'You Receive'}
                giveArray={giveArray}
            />
        </>
    )}
}

export default PlayerTradeModalContent;