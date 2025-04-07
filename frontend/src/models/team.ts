import { PlayerOptimal } from './player'

export interface TeamInfo {
    id: number
    name: string
    photoUrl: string
    code: string
    surname: string
}

export interface OptimalTeam {
    round: number
    team: PlayerOptimal[]
    cap: number
}
