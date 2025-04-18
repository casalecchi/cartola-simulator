import { Player } from './player'

export type BuilderFormation = {
    [key in Position]: number
}

export type BuilderTeam = {
    [key in Position]: Player[]
}

export type Formation = '343' | '352' | '433' | '442' | '451' | '532' | '541'

export type Position = 'man' | 'gk' | 'cb' | 'wb' | 'mid' | 'st'
