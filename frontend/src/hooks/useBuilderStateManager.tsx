import { useState } from 'react'
import { BuilderTeam, Player } from '../models'
import { EMPTY_TEAM } from '../utils'

export const useBuilderStateManager = () => {
    const [captain, setCaptain] = useState<Player>()
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

    return { captain, team, addPlayer, removePlayer, resetTeam, setCaptain }
}
