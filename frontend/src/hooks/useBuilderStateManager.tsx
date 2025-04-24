import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { BuilderTeam, Formation, HistoryTeam, Player, Position } from '../models'
import { formationSlots, getEmptyTeam } from '../utils'

export interface MarketOptions {
    open: boolean
    posId: Position
}

export interface BuilderState {
    balance: number
    captain?: Player
    formation: Formation
    history: HistoryTeam[]
    marketOptions: MarketOptions
    round: number
    team: BuilderTeam
    addPlayer: (player: Player) => void
    changeFormation: (value: Formation) => void
    removePlayer: (player: Player) => void
    resetTeam: () => void
    setCaptain: (value: Player) => void
    setMarketOptions: Dispatch<SetStateAction<MarketOptions>>
    submit: () => void
}

interface BuilderProps {
    getRoundMarket: (round: number) => Player[]
}

export const useBuilderStateManager = ({ getRoundMarket }: BuilderProps): BuilderState => {
    const [balance, setBalance] = useState(100.0)
    const [captain, setCaptain] = useState<Player>()
    const [formation, setFormation] = useState<Formation>('433')
    const [history, setHistory] = useState<HistoryTeam[]>([])
    const [marketOptions, setMarketOptions] = useState<MarketOptions>({ open: false, posId: 'man' })
    const [round, setRound] = useState(1)
    const [team, setTeam] = useState<BuilderTeam>(getEmptyTeam())

    const addPlayer = (player: Player) => {
        const posId = player.positionId
        setBalance((prev) => prev - player.price)
        setTeam((prev) => ({ ...prev, [posId]: [...prev[posId], player] }))
    }

    const changeFormation = (value: Formation) => {
        const f = formationSlots[value]
        Object.entries(f).forEach(([key, value]) => {
            const posId = key as Position
            team[posId].forEach((p, index) => index + 1 > value && removePlayer(p))
        })
        setFormation(value)
    }

    const removePlayer = (player: Player) => {
        const posId = player.positionId
        setBalance((prev) => prev + player.price)
        setTeam((prev) => ({ ...prev, [posId]: prev[posId].filter((p) => p.id != player.id) }))
    }

    const resetTeam = () => {
        Object.entries(team).forEach(([, value]) => {
            value.forEach((p) => removePlayer(p))
        })
    }

    const submit = () => {
        const hisTeam: HistoryTeam = { points: 0, team }
        const updatedTeam = getEmptyTeam()
        const market = getRoundMarket(round < 38 ? round + 1 : round)
        Object.entries(team).forEach(([key, value]) => {
            const posId = key as Position
            value.forEach((player) => {
                const updatedPlayer = market.find((p) => p.id === player.id)
                if (!updatedPlayer) {
                    setBalance((prev) => prev + player.price)
                    return
                }
                updatedTeam[posId].push(updatedPlayer)
                if (round < 38) {
                    hisTeam.points += updatedPlayer.lastScore
                } else {
                    hisTeam.points += updatedPlayer.points
                }
            })
        })
        setRound((prev) => prev + 1)
        setTeam(updatedTeam)
        setHistory((prev) => [...prev, hisTeam])
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
        history,
        marketOptions,
        round,
        team,
        addPlayer,
        changeFormation,
        removePlayer,
        resetTeam,
        setCaptain,
        setMarketOptions,
        submit,
    }
}
