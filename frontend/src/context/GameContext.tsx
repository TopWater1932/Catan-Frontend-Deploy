import { createContext, useContext } from "react";
import { GameContextShape } from '../ts-contracts/interfaces'

export const GameContext = createContext<GameContextShape | null>(null)

export const useGameContext = () => {
    const context = useContext(GameContext)

    if (!context) {
        throw new Error('Context value has been rendered outside the provider and is null by default')
    }

    return context
}