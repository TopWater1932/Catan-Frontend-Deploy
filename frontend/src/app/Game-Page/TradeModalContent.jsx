import { useContext, useState } from "react"
import { useTradeContext } from '../../context/TradeContext';
import '../../styles/options-modal.css'


function TradeModalContent( ) {

    const {setTradeModalIsVisible,setMarTradeModalIsVisible,setPlayerTradeModalIsVisible} = useTradeContext();

    const handleSelectPlayer = () => {
        setTradeModalIsVisible(false);
        setPlayerTradeModalIsVisible(true);
    }

    const handleSelectMaritime = () => {
        setTradeModalIsVisible(false);
        setMarTradeModalIsVisible(true);
    }
    
    return (
        <div className='options'>
            <div className='option-row'>
                <p><span className='bold'>{'Maritime Trade'}</span></p>
                <button className='button' type="button" onClick={handleSelectMaritime}>Select</button>
            </div>
            <div className='option-row'>
                <p><span className='bold'>{'Player Trade'}</span></p>
                <button className='button' type="button" onClick={handleSelectPlayer}>Select</button>
            </div>
        </div>
)}

export default TradeModalContent;