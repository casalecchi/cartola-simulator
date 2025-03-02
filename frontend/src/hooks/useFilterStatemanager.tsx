import { useState } from 'react'
import { PlayerInfo } from '../models'
import { TeamInfo } from '../models/team'

export interface FilterState {
    selectedPlayer?: PlayerInfo
    selectedTeam?: TeamInfo
    selectedYear: string
    setSelectedPlayer: (value?: PlayerInfo) => void
    setSelectedTeam: (value?: TeamInfo) => void
    setSelectedYear: (value: string) => void
}

export const useFilterStateManager = (): FilterState => {
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerInfo>()
    const [selectedTeam, setSelectedTeam] = useState<TeamInfo>()
    const [selectedYear, setSelectedYear] = useState<string>('')

    return {
        selectedPlayer,
        selectedTeam,
        selectedYear,
        setSelectedPlayer,
        setSelectedTeam,
        setSelectedYear,
    }
}
