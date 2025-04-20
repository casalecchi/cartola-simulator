import { Dispatch, SetStateAction, useState } from 'react'
import { BuilderTeam, Player, Position } from '../models'
import { EMPTY_TEAM } from '../utils'

export interface MarketOptions {
    open: boolean
    posId: Position
}

export interface BuilderState {
    balance: number
    captain?: Player
    marketOptions: MarketOptions
    team: BuilderTeam
    addPlayer: (player: Player) => void
    removePlayer: (player: Player) => void
    resetTeam: () => void
    setCaptain: (value: Player) => void
    setMarketOptions: Dispatch<SetStateAction<MarketOptions>>
}

export const useBuilderStateManager = (): BuilderState => {
    const [balance, setBalance] = useState(100.0)
    const [captain, setCaptain] = useState<Player>()
    const [marketOptions, setMarketOptions] = useState<MarketOptions>({ open: false, posId: 'man' })
    const [team, setTeam] = useState<BuilderTeam>(EMPTY_TEAM)

    const addPlayer = (player: Player) => {
        const posId = player.positionId
        setTeam((prev) => ({ ...prev, [posId]: [...prev[posId], player] }))
    }

    const removePlayer = (player: Player) => {
        const posId = player.positionId
        setTeam((prev) => ({ ...prev, [posId]: prev[posId].filter((p) => p.id != player.id) }))
    }

    const resetTeam = () => {
        setTeam(EMPTY_TEAM)
    }

    return {
        balance,
        captain,
        marketOptions,
        team,
        addPlayer,
        removePlayer,
        resetTeam,
        setCaptain,
        setMarketOptions,
    }
}
