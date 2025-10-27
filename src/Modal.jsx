import { createPortal } from "react-dom"
import closeBtn from "./assets/close-btn.svg"
import './styles/modal.css'

function Modal({ isVisible, setIsVisible, modalClassTypes, content }) {
    
    if (!isVisible) return null;
    
    return createPortal(
        <>
            
            <div className="modal-background"></div>
            <div className={`modal ${modalClassTypes}`}>
                <img className="cancel" src={closeBtn} onClick={() => setIsVisible(false)} alt="Cancel" />
                
                {content}
                
            </div>
            document.getElementById('modal')
            
        </>,
        document.getElementById('modal')
)}

export default Modal;