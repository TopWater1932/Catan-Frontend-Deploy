import { createContext, useContext } from 'react'
import {
  WebsocketContextShape
} from '../ts-contracts/interfaces'


// Create a context for passing Websocket data to components
export const WebsocketContext = createContext<WebsocketContextShape | null>(null);

export const useWebSocketContext = () => {
    const context = useContext(WebsocketContext)
    if (!context) {
        throw new Error('Context value has been rendered outside the provider and is null by default')
    }
    return context
}