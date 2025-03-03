import { Dispatch, SetStateAction, useState } from 'react'
import { PlayerInfo } from '../models'
import { TeamInfo } from '../models/team'

export interface FilterState {
    autoarima: boolean
    d: number
    p: number
    q: number
    selectedPlayer?: PlayerInfo
    selectedTeam?: TeamInfo
    selectedYear: string
    setAutoarima: Dispatch<SetStateAction<boolean>>
    setD: (value: number) => void
    setP: (value: number) => void
    setQ: (value: number) => void
    setSelectedPlayer: (value?: PlayerInfo) => void
    setSelectedTeam: (value?: TeamInfo) => void
    setSelectedYear: (value: string) => void
}

export const useFilterStateManager = (): FilterState => {
    const [autoarima, setAutoarima] = useState(false)
    const [d, setD] = useState(1)
    const [p, setP] = useState(1)
    const [q, setQ] = useState(1)
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerInfo>()
    const [selectedTeam, setSelectedTeam] = useState<TeamInfo>()
    const [selectedYear, setSelectedYear] = useState<string>('')

    return {
        autoarima,
        d,
        p,
        q,
        selectedPlayer,
        selectedTeam,
        selectedYear,
        setAutoarima,
        setD,
        setP,
        setQ,
        setSelectedPlayer,
        setSelectedTeam,
        setSelectedYear,
    }
}
