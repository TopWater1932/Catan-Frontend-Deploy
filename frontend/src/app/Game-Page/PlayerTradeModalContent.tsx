import { useState } from "react"
import { useWebSocketContext } from '../../context/WebsocketContext'
import { useModalContext } from "../../context/ModalContext";
import TimerContent from "./TimerContent";
import TradeResourceSelection from "./TradeResourceSelection";
import '../../styles/options-modal.css'

import {
  ReactMouseEvent
} from '../../ts-contracts/interfaces'

function PlayerTradeModalContent( ) {

    const {players,turn} = useWebSocketContext();
    const {resources} = players[turn];

    const {setIsEnabled} = useModalContext();

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