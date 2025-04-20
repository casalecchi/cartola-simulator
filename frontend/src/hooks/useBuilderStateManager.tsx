import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { BuilderTeam, Formation, Player, Position } from '../models'
import { EMPTY_TEAM, formationSlots } from '../utils'

export interface MarketOptions {
    open: boolean
    posId: Position
}

export interface BuilderState {
    balance: number
    captain?: Player
    formation: Formation
    marketOptions: MarketOptions
    team: BuilderTeam
    addPlayer: (player: Player) => void
    changeFormation: (value: Formation) => void
    removePlayer: (player: Player) => void
    resetTeam: () => void
    setCaptain: (value: Player) => void
    setMarketOptions: Dispatch<SetStateAction<MarketOptions>>
}

export const useBuilderStateManager = (): BuilderState => {
    const [balance, setBalance] = useState(100.0)
    const [captain, setCaptain] = useState<Player>()
    const [formation, setFormation] = useState<Formation>('433')
    const [marketOptions, setMarketOptions] = useState<MarketOptions>({ open: false, posId: 'man' })
    const [team, setTeam] = useState<BuilderTeam>(EMPTY_TEAM)

    const addPlayer = (player: Player) => {
        const posId = player.positionId
        setBalance((prev) => prev - player.price)
        setTeam((prev) => ({ ...prev, [posId]: [...prev[posId], player] }))
    }

    const changeFormation = (value: Formation) => {
        setFormation(value)
    }

    const removePlayer = (player: Player) => {
        const posId = player.positionId
        setBalance((prev) => prev + player.price)
        setTeam((prev) => ({ ...prev, [posId]: prev[posId].filter((p) => p.id != player.id) }))
    }

    const resetTeam = () => {
        setTeam(EMPTY_TEAM)
    }

    useEffect(() => {
        const posId = marketOptions.posId
        const full = team[posId].length == formationSlots[formation][posId]
        setMarketOptions((prev) => ({ ...prev, open: full ? false : prev.open }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [team])

    return {
        balance,
        captain,
        formation,
        marketOptions,
        team,
        addPlayer,
        changeFormation,
        removePlayer,
        resetTeam,
        setCaptain,
        setMarketOptions,
    }
}
