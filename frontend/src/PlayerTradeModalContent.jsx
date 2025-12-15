import { useContext } from "react"
import { GlobalContext } from "./GlobalContext.jsx";
import './styles/options-modal.css'


function MaritimeTradeModalContent({ setTradeModalIsVisible }) {

    const {players,turn} = useContext(GlobalContext);
    // const {ports} = players[turn];

    // ******************************
    // Replace this with a fetch to get the port names initialised by the backend:
    const portMap = {
        'port-3-1A':{'reqNumIn':3,'reqTypeIn':'any','vert':['V0','V1'],'text':`?\n3 : 1`},
        'port-wh':{'reqNumIn':2,'reqTypeIn':'wh','vert':['V3','V4'],'text':`🌾\n2 : 1`},
        'port-or':{'reqNumIn':2,'reqTypeIn':'or','vert':['V14','V15'],'text':`🪨\n2 : 1`},
        'port-3-1B':{'reqNumIn':3,'reqTypeIn':'any','vert':['V26','V37'],'text':`?\n3 : 1`},
        'port-sh':{'reqNumIn':2,'reqTypeIn':'sh','vert':['V46','V45'],'text':`🐑\n2 : 1`},
        'port-3-1C':{'reqNumIn':3,'reqTypeIn':'any','vert':['V50','V51'],'text':`?\n3 : 1`},
        'port-3-1D':{'reqNumIn':3,'reqTypeIn':'any','vert':['V47','V48'],'text':`?\n3 : 1`},
        'port-br':{'reqNumIn':2,'reqTypeIn':'br','vert':['V28','V38'],'text':`🧱\n2 : 1`},
        'port-wo':{'reqNumIn':2,'reqTypeIn':'wo','vert':['V7','V17'],'text':`🪵\n2 : 1`}
    };

    const ports = [
        {'reqNumIn':3,'reqTypeIn':'any','vert':['V0','V1'],'text':`? 3 : 1`},
        {'reqNumIn':2,'reqTypeIn':'wh','vert':['V3','V4'],'text':`🌾2 : 1`},
        {'reqNumIn':2,'reqTypeIn':'or','vert':['V14','V15'],'text':`🪨2 : 1`}
    ]
    // ******************************

    const handleUseClick = (selectionIndex,e) => {
        
        setTradeModalIsVisible(false);
    }
    
    return (
        <div className='options'>
            {ports.map((port,i) => 
                    <div className='option-row'>
                        <p><span className='bold'>{`${ports[i]['text']}`}</span></p>
                        <button className='button' type="button" onClick={(e) => handleUseClick(i,e)}>Use</button>
                    </div>
            )}
        </div>
)}

export default MaritimeTradeModalContent;