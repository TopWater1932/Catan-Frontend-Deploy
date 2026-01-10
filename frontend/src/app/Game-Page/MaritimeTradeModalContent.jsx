import { useState,useContext } from "react"
import { WebsocketContext } from "../../context/WebsocketContext.jsx";
import '../../styles/options-modal.css'

import TradeResourceSelection from './TradeResourceSelection.jsx'


function MaritimeTradeModalContent( ) {

    const {players,turn} = useContext(WebsocketContext);
    // const {ports, resources} = players[turn];
    const {resources} = players[turn];

    const [marDealsVisible,setMarDealsVisible] = useState(false);
    const [portSelected,setPortSelected] = useState({'reqNumIn':null,'reqTypeIn':'any','vert':[],'text':`null`});
    
    // ******************************
    // Replace this with a fetch to get the port names initialised by the backend:
    const portMap = {
        'port-3-1A':{'reqNumIn':3,'reqTypeIn':'any','vert':['V0','V1'],'text':`?\n3 : 1`},
        'port-wh':{'reqNumIn':2,'reqTypeIn':'wheat','vert':['V3','V4'],'text':`🌾\n2 : 1`},
        'port-or':{'reqNumIn':2,'reqTypeIn':'ore','vert':['V14','V15'],'text':`🪨\n2 : 1`},
        'port-3-1B':{'reqNumIn':3,'reqTypeIn':'any','vert':['V26','V37'],'text':`?\n3 : 1`},
        'port-sh':{'reqNumIn':2,'reqTypeIn':'sheep','vert':['V46','V45'],'text':`🐑\n2 : 1`},
        'port-3-1C':{'reqNumIn':3,'reqTypeIn':'any','vert':['V50','V51'],'text':`?\n3 : 1`},
        'port-3-1D':{'reqNumIn':3,'reqTypeIn':'any','vert':['V47','V48'],'text':`?\n3 : 1`},
        'port-br':{'reqNumIn':2,'reqTypeIn':'brick','vert':['V28','V38'],'text':`🧱\n2 : 1`},
        'port-wo':{'reqNumIn':2,'reqTypeIn':'wood','vert':['V7','V17'],'text':`🪵\n2 : 1`}
    };

    const ports = [
        {'reqNumIn':4,'reqTypeIn':'any','vert':[],'text':`? 4 : 1`},
        {'reqNumIn':3,'reqTypeIn':'any','vert':['V0','V1'],'text':`? 3 : 1`},
        {'reqNumIn':2,'reqTypeIn':'wheat','vert':['V3','V4'],'text':`🌾2 : 1`},
        {'reqNumIn':2,'reqTypeIn':'ore','vert':['V14','V15'],'text':`🪨2 : 1`}
    ]
    // ******************************

    const usablePorts = ports.map(p => {
        p.enabled = false;
        
        if (p.reqTypeIn === 'any') {
            p.anyTradeList = []
            for (const res in resources) {
                if (resources[res] >= p.reqNumIn) {
                    p.enabled = true;
                    p.anyTradeList.push(res)
                }
            }
        } else {
            if (resources[p.reqTypeIn] >= p.reqNumIn) {
                p.enabled = true;
            }
        }

        return p
    });


    const handleUseClick = (e,port) => {
        setMarDealsVisible(true);
        setPortSelected(port);
    }

    const handleConfirm = (e: ReactMouseEvent) => {
        e.preventDefault();
        // Post the trade to the backend here
    };

    const handleBack = () => {
        setMarDealsVisible(false);
    };
    
    if (!marDealsVisible) {
        return (
            <>
                <div className='options'>
                    {usablePorts.map((port,i) => 
                            <div className='option-row'>
                                <p><span className='bold'>{`${ports[i]['text']}`}</span></p>
                                <button className='button' type="button" onClick={(e: ReactMouseEvent) => handleUseClick(e,port)} disabled={!port.enabled}>Use</button>
                            </div>
                    )}
                </div>
            </>
        )
    } else {
        return (
            <>
                <TradeResourceSelection
                    dialogueType={'radio'}
                    buttons={[
                        {'text':'Back','type':'button','callback':handleBack},
                        {'text':'Confirm','type':'submit','callback':handleConfirm}
                    ]}
                    giveTitle={`Give ${portSelected.reqNumIn}`}
                    receiveTitle={'Receive 1'}
                    giveArray={portSelected.reqTypeIn === 'any' ? portSelected.anyTradeList : [portSelected.reqTypeIn]}
                />
            </>
        )
    }
}

export default MaritimeTradeModalContent;