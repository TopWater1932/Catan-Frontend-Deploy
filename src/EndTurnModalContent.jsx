import { useContext } from "react"
import { GlobalContext } from "./GlobalContext.jsx";
import './styles/close-btn.css';

function EndTurnModalContent({ setEndModalIsVisible }) {
    
    const { turnState } = useContext(GlobalContext);
    const [turn,setTurn] = turnState;

    const handleClick = () => {
        
        // setTurn();
        setEndModalIsVisible(false);
    }
    
    return (
        <>
            <p className="exit-msg">Are you ready to end your turn?</p>
            <div className="options">
                <button className="button" onClick={(e) => handleClick(e)}>Yes</button>
                <button className="button" onClick={() => setEndModalIsVisible(false)}>Go Back</button>
            </div>
        </>
)}

export default EndTurnModalContent;