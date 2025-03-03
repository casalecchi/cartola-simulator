import { PlayerDataset, PlayerTimeseries } from '../models'

export const mergeTimeseries = (
    t1: PlayerTimeseries,
    t1Key: string,
    t2: PlayerTimeseries,
    t2Key: string
): PlayerDataset[] => {
    return Array.from({ length: 38 }, (_, i) => {
        const round = i + 1
        const t1Value = t1.data.find((p) => p.round === round)
        const t2Value = t2.data.find((p) => p.round === round)

        return { x: round, [t1Key]: t1Value?.points ?? null, [t2Key]: t2Value?.points ?? null }
    })
}
