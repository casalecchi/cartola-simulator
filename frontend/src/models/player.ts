export interface PlayerDataset {
    x: number
    [key: string]: number | null
}

export interface PlayerInfo {
    id: number
    name: string
    photoUrl: string
    teamId: number
}

export interface PlayerTimeseries {
    data: PlayerTimeseriesPoint[]
}

export interface PlayerTimeseriesPoint {
    round: number
    points: number
}
