import { OptimalTeam } from '../models'

export const generateTickPositions = (min: number, max: number) => {
    const ticks = []
    for (let i = min; i <= max; i++) {
        ticks.push(i)
    }
    return ticks
}

export const getPoints = (team: OptimalTeam, key: 'points' | 'pred' = 'points') => {
    const total = team.team.reduce((acc, player) => acc + player[key], 0)
    const cap = team.team.find((player) => player.id == team.cap)
    return total + (cap?.points ?? 0)
}
