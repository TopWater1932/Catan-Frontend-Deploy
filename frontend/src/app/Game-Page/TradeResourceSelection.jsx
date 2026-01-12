import { useState } from 'react'
import '../../styles/buttons.css'
import '../../styles/trade-resources.css'
import doubleArrows from '../../assets/reshot-icon-left-and-right-arrows-Z5XLT7B8WY.svg'
import capsResourceName from '../../utils/func-capsResourceNames'
// import { useTradeContext } from '../../context/TradeContext'
import { useWebSocketContext } from '../../context/WebsocketContext'

function TradeResourceSelection({ dialogueType, buttons, giveTitle, receiveTitle, giveArray}) {

    const {players,turn} = useWebSocketContext();
    const {resources} = players[turn];

    const receiveArray = Object.keys(resources);
    
    const [receiveSelection,setReceiveSelection] = useState(receiveArray[0]);
    const [giveSelection,setGiveSelection] = useState(giveArray[0]);
    
    const initState = {};
    receiveArray.forEach(res => {
        initState[res] = 0;
    });

    const [giveAmount,setGiveAmount] = useState(initState);
    const [receiveAmount,setReceiveAmount] = useState(initState);



    return (

        <form className="trade-container">

            <div className="trade-columns">

                {/* ---- GIVE COLUMN ---- */}
                <div className="trade-column">
                    <h3 className="trade-header">{giveTitle}</h3>

                    <div className="panel-background">
                        {giveArray.map((res) => (

                            <label className="trade-row">
                                {`${capsResourceName(res)}`}
                                <input
                                    type={dialogueType}
                                    name={dialogueType === 'radio' ? 'give-resources' : `give-player-${res}`}
                                    value={dialogueType === 'radio'? res : giveAmount[res]}
                                    onClick={(e: ReactMouseEvent) => {dialogueType === 'radio' ? setGiveSelection(e.target.value) : setGiveAmount({...giveAmount,[res]: e.target.value})}}
                                    checked={res === giveSelection ? true : false}
                                    min={0}
                                    max={resources[res]}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* ---- CENTER ARROWS ---- */}
                <div className="trade-arrows-container">
                    <img className="trade-arrows" src={doubleArrows} alt="Trade arrows" />
                </div>

                {/* ---- RECEIVE COLUMN ---- */}
                <div className="trade-column">
                    <h3 className="trade-header">{receiveTitle}</h3>

                    <div className="panel-background">
                        {receiveArray.map((res) => (

                            <label className="trade-row">
                                {`${capsResourceName(res)}`}
                                <input
                                    type={dialogueType}
                                    name={dialogueType === 'radio' ? 'receive-resources' : `receive-player-${res}`}
                                    value={dialogueType === 'radio'? res : receiveAmount[res]}
                                    onClick={(e: ReactMouseEvent) => {dialogueType === 'radio' ? setReceiveSelection(e.target.value) : setReceiveAmount({...receiveAmount,[res]: e.target.value})}}
                                    checked={res === receiveSelection ? true : false}
                                    min={0}
                                    max={10}
                                />
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* ---- ACTION BUTTONS ---- */}
            <div className="trade-action">
                {buttons.map((button) =>
                    <button className='button' type={button.type} onClick={button.callback}>{`${button.text}`}</button>
                )}
            </div>

        </form>

    )
}

export default TradeResourceSelection
