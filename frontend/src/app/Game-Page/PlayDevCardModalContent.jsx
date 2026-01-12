import { useContext } from "react"
import { WebsocketContext } from "../../context/WebsocketContext.jsx";
import capsResourceName from '../../utils/func-capsResourceNames.tsx'
import '../../styles/options-modal.css'

function PlayDevCardModalContent({ setDCModalIsVisible }) {

  const {players,turn} = useWebSocketContext();
  const {devCards} = players[turn];

    const names = Object.keys(devCards).slice(0,5);
    const dcNames = names.map((key) => capsResourceName(key));


    const handleUseClick = (selectionIndex,e) => {
        
        setDCModalIsVisible(false);
    }
    
    return (
        <div className='options'>
            {names.map((name,i) => 
                    <div className='option-row'>
                        <p><span className='bold'>{`${dcNames[i]}: `}</span><span>{`${devCards[name]}`}</span></p>
                        <button className='button' type="button" onClick={(e: ReactMouseEvent) => handleUseClick(i,e)} disabled={devCards[name]>0 ? false : true}>Use</button>
                    </div>
            )}
        </div>
)}

export default PlayDevCardModalContent;