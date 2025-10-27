import { useContext } from "react"
import { GlobalContext } from "./GlobalContext.jsx";
import './styles/playDC-modal.css'

function PlayDevCardModalContent({ setDCModalIsVisible }) {

    const {turnState, devCardsState} = useContext(GlobalContext)
    const [turn] = turnState;
    const [devCards,setDevCards] = devCardsState;

    const names = Object.keys(devCards[turn]).slice(0,5);
    const dcNames = names.map((key) => {
        let capitalised = key.charAt(0).toUpperCase() + key.slice(1);
        return capitalised.split(/(?=[A-Z])/).join(" ");
    });

    const handleUseClick = (selectionIndex,e) => {
        
        setDCModalIsVisible(false);
    }
    
    return (
        <div className='DC-options'>
            {names.map((name,i) => 
                    <div className='playDC-row'>
                        <p className='dev-card-label'><span className='bold'>{`${dcNames[i]}: `}</span><span>{`${devCards[turn][name]}`}</span></p>
                        <button className='button' type="button" onClick={(e) => handleUseClick(i,e)} disabled={devCards[turn][name]>0 ? false : true}>Use</button>
                    </div>
            )}
        </div>
)}

export default PlayDevCardModalContent;