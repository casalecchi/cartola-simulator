import { Position } from './builder'

export interface PlayerDataset {
    x: number
    [key: string]: number | null
}

export interface Player {
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
