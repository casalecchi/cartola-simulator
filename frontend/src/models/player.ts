export interface PlayerDataset {
    x: number
    [key: string]: number | null
}

export interface PlayerInfo {
    id: number
    name: string
    photoUrl: string
    teamId: number
    positionId: PlayerPosition
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

export type PlayerPosition = 'gk' | 'wb' | 'cb' | 'mid' | 'st' | 'man'
