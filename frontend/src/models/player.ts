import { Position, Status } from './builder'

export interface Dataset {
    x: number
    [key: string]: number | null
}

export interface Player {
    id: number
    average: number
    gamesPlayed: number
    lastScore: number
    name: string
    photoUrl: string
    positionId: Position
    price: number
    points: number
    statusId: Status
    teamId: number
}

export interface PlayerInfo {
    id: number
    name: string
    photoUrl: string
    teamId: number
    positionId: Position
    validLSTMValues: number
}

export interface PlayerTimeseries {
    data: PlayerTimeseriesPoint[]
}

export interface PlayerTimeseriesPoint {
    round: number
    points: number
}

export interface PlayerOptimal {
    id: number
    points: number
    pred: number
}
