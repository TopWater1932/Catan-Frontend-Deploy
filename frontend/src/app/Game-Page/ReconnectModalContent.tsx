import { useEffect } from "react"
import { useModalContext } from "../../context/ModalContext";
import TimerContent from "./TimerContent";
import '../../styles/options-modal.css'

function ReconnectModalContent( ) {

    const {setIsEnabled} = useModalContext();

    useEffect (() => {
    setIsEnabled(false)
    }, []);
    
    return (
        <>
            <TimerContent
                message={'Reconnecting...'}
            />
        </>
    )    
}

export default ReconnectModalContent;