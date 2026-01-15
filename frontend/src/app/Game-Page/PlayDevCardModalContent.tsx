import { useContext } from "react"
import { useWebSocketContext } from '../../context/WebsocketContext'
import capsResourceName from '../../utils/func-capsResourceNames'
import '../../styles/options-modal.css'

import {
    SetterFunction,
    ReactMouseEvent
} from '../../ts-contracts/interfaces'

interface PlayDevCardModalContentArgs {
    setDCModalIsVisible: SetterFunction<boolean>;
}

function PlayDevCardModalContent({setDCModalIsVisible}: PlayDevCardModalContentArgs) {

  const {players,turn} = useWebSocketContext();
  const {devCards} = players[turn];

    const names = Object.keys(devCards).slice(0,5);
    const dcNames = names.map((key) => capsResourceName(key));


    const handleUseClick = (selectionIndex: number) => {
        
        setDCModalIsVisible(false);
    }
    
    return (
        <div className='options'>
            {names.map((name,i) => 
                    <div className='option-row'>
                        <p><span className='bold'>{`${dcNames[i]}: `}</span><span>{`${devCards[name]}`}</span></p>
                        <button className='button' type="button" onClick={(e: ReactMouseEvent) => handleUseClick(i)} disabled={devCards[name]>0 ? false : true}>Use</button>
                    </div>
            )}
        </div>
)}

export default PlayDevCardModalContent;