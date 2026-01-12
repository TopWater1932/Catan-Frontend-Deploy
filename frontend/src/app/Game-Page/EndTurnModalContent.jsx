import { useContext } from "react"
import { WebsocketContext } from "../../context/WebsocketContext.jsx";
import '../../styles/close-btn.css';

function EndTurnModalContent({ setEndModalIsVisible }) {
    
    const { turn, setTurn } = useWebSocketContext();

    const handleClick = () => {
        
        // setTurn();
        setEndModalIsVisible(false);
    }
    
    return (
        <>
            <p className="exit-msg">Are you ready to end your turn?</p>
            <div className="exit-options">
                <button className="button" onClick={handleClick}>Yes</button>
                <button className="button" onClick={() => setEndModalIsVisible(false)}>Go Back</button>
            </div>
        </>
)}

export default EndTurnModalContent;