import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { OptimalTeam } from '../models'
import { roundNumber } from '../utils'

export interface TeamState {
    barSeries: number[]
    round: number
    team?: OptimalTeam
    setRound: Dispatch<SetStateAction<number>>
}

export const useTeamStateManager = ({ optimals }: { optimals: OptimalTeam[] }): TeamState => {
    const [round, setRound] = useState<number>(1)
    const [team, setTeam] = useState<OptimalTeam>()

    const barSeries = optimals.map((team) =>
        roundNumber(
            team.team.reduce((acc, player) => acc + player.points, 0),
            2
        )
    )

    useEffect(() => {
        if (optimals.length > 0) setTeam(optimals[round - 1])
    }, [round, optimals])

    return { barSeries, round, team, setRound }
}
