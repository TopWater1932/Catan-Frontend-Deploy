import { useState,useContext } from 'react'
import './styles/buttons.css'
import './styles/trade-resources.css'
import doubleArrows from './assets/reshot-icon-left-and-right-arrows-Z5XLT7B8WY.svg'
import capsResourceName from './utils/func-capsResourceNames.jsx'
import { TradeContext } from './TradeContext.jsx'
import { GlobalContext } from "./GlobalContext.jsx";

function TradeResourceSelection({ dialogueType, buttons, giveTitle, receiveTitle, giveArray}) {

    const {players,turn} = useContext(GlobalContext);
    const {resources} = players[turn];

    const receiveArray = Object.keys(resources);

    const [receiveSelection,setReceiveSelection] = useState(receiveArray[0]);
    const [giveSelection,setGiveSelection] = useState(giveArray[0]);



  



    return (

        <form className="trade-container">

            <div className="trade-columns">

                {/* ---- GIVE COLUMN ---- */}
                <div className="trade-column">
                    <h3 className="trade-header">{giveTitle}</h3>

                    <div className="panel-background">
                        {giveArray.map((res, i) => (

                            <label className="trade-row">
                                {`${capsResourceName(res)}`}
                                <input
                                    type={dialogueType}
                                    name={'give-resources'}
                                    value={res}
                                    checked={res === giveSelection? true : false}
                                    onChange={(e) => setGiveSelection(e.target.value)}
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
                        {receiveArray.map((res, i) => (

                            <label className="trade-row">
                                {`${capsResourceName(res)}`}
                                <input
                                    type={dialogueType}
                                    name={'receive-resources'}
                                    value={res}
                                    checked={res === receiveSelection? true : false}
                                    onChange={(e) => setReceiveSelection(e.target.value)}
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
