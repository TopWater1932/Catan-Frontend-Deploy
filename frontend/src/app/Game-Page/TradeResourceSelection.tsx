import { useState } from 'react'
import '../../styles/buttons.css'
import '../../styles/trade-resources.css'
import doubleArrows from '../../assets/reshot-icon-left-and-right-arrows-Z5XLT7B8WY.svg'
import capsResourceName from '../../utils/func-capsResourceNames'
import { useWebSocketContext } from '../../context/WebsocketContext'

import {
  TradeResourceSelectionArgs,
  ReactMouseEvent,
  ResourcesMap,
  ReactChangeEvent,
  ButtonInfo
} from '../../ts-contracts/interfaces'

function TradeResourceSelection({ dialogueType, buttons, giveTitle, receiveTitle, giveArray}: TradeResourceSelectionArgs) {

    const {players,turn} = useWebSocketContext();
    const {resources} = players[turn];

    const receiveArray: string[] = Object.keys(resources);
    
    const [receiveSelection,setReceiveSelection] = useState(receiveArray[0]);
    const [giveSelection,setGiveSelection] = useState(giveArray[0]);
    
    const initState: ResourcesMap = {};
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
                                    onChange={(e: ReactChangeEvent<HTMLInputElement>) => {dialogueType === 'radio' ? setGiveSelection(e.currentTarget.value) : setGiveAmount({...giveAmount, [res]: Number(e.currentTarget.value)})}}
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
                                    onChange={(e: ReactChangeEvent<HTMLInputElement>) => {dialogueType === 'radio' ? setReceiveSelection(e.currentTarget.value) : setReceiveAmount({...receiveAmount,[res]: Number(e.currentTarget.value)})}}
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
