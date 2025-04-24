import { Player } from './player'

export interface BarDataset {
    model: number
    round: number
    user: number
}

export type BuilderFormation = {
    [key in Position]: number
}

export type BuilderTeam = {
    [key in Position]: Player[]
}

export type Formation = '343' | '352' | '433' | '442' | '451' | '532' | '541'

export interface HistoryTeam {
    points: number
    team: BuilderTeam
}

export interface Market {
    [key: number]: Player[]
}

export type Position = 'man' | 'gk' | 'cb' | 'wb' | 'mid' | 'st'

export type Status = 'doubt' | 'suspended' | 'injury' | 'null' | 'probable'
