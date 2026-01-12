import { createContext, useContext } from 'react'
import {
  TradeContextShape
} from '../ts-contracts/interfaces'

// Create a trade actions context
export const TradeContext = createContext<TradeContextShape | null>(null);

export const useTradeContext = () => {
  const context = useContext(TradeContext)
  if (!context) {
    throw new Error('Context value has been rendered outside the provider and is null by default')
  }
  return context
}