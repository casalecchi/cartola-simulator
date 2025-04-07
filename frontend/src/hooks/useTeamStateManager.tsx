import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { OptimalTeam } from '../models'
import { getPoints, roundNumber } from '../utils'

export interface TeamState {
    barSeries: number[]
    round: number
    team?: OptimalTeam
    setRound: Dispatch<SetStateAction<number>>
}

export const useTeamStateManager = ({ optimals }: { optimals: OptimalTeam[] }): TeamState => {
    const [round, setRound] = useState<number>(1)
    const [team, setTeam] = useState<OptimalTeam>()

    const barSeries = optimals.map((team) => roundNumber(getPoints(team), 2))

    useEffect(() => {
        if (optimals.length > 0) setTeam(optimals[round - 1])
    }, [round, optimals])

    return { barSeries, round, team, setRound }
}
