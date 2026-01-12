import { createContext, useContext } from 'react'
import {
  ModalContextShape
} from '../ts-contracts/interfaces'


// Create a context for passing Websocket data to components
export const ModalContext = createContext<ModalContextShape | null>(null);

export const useWebSocketContext = () => {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error('Context value has been rendered outside the provider and is null by default')
    }
    return context
}