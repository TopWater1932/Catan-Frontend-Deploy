import { useState } from "react"
import { createPortal } from "react-dom"
import closeBtn from "../../assets/close-btn.svg"
import '../../styles/modal.css'

import { ModalContext } from "../../context/ModalContext.jsx";

function Modal({ isVisible, setIsVisible, modalClassTypes, content }) {
    
    const [isEnabled, setIsEnabled] = useState(true);

    const exitModalCallback = () => {
        setIsVisible(false);
    }

    if (!isVisible) return null;

    return createPortal(
        <>
            <ModalContext.Provider value={{isEnabled, setIsEnabled}}>

                <div className="modal-background" onClick={isEnabled ? exitModalCallback : undefined}></div>
                <div className={`modal ${modalClassTypes}`}>
                    {isEnabled ? <img className="cancel" src={closeBtn} onClick={() => setIsVisible(false)} alt="Cancel" /> : null}
                    
                    {content}
                    
                </div>
                document.getElementById('modal')

            </ModalContext.Provider>
        </>,
        document.getElementById('modal')
)}

export default Modal;