import { Dataset, HistoryTeam, OptimalTeam, PlayerTimeseries } from '../models'
import { getPoints } from './array'

export const mergeTimeseries = (
    t1: PlayerTimeseries,
    t1Key: string,
    t2: PlayerTimeseries,
    t2Key: string
): Dataset[] => {
    return Array.from({ length: 38 }, (_, i) => {
        const round = i + 1
        const t1Value = t1.data.find((p) => p.round === round)
        const t2Value = t2.data.find((p) => p.round === round)

        return { x: round, [t1Key]: t1Value?.points ?? null, [t2Key]: t2Value?.points ?? null }
    })
}

export const getBarDataset = ({
    history,
    optimals,
    round,
}: {
    history: HistoryTeam[]
    optimals: OptimalTeam[]
    round: number
}): Dataset[] => {
    return Array.from({ length: round - 1 }, (_, r) => {
        const user = history[r]?.points ?? 0
        const model = getPoints(optimals[r])
        return { user, model, x: r + 1 }
    })
}
