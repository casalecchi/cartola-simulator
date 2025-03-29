import { Dispatch, SetStateAction, useState } from 'react'
import { ArimaOptions, PlayerInfo } from '../models'
import { TeamInfo } from '../models/team'

export interface FilterState {
    arimaOptions: ArimaOptions
    selectedPlayer?: PlayerInfo
    selectedTeam?: TeamInfo
    selectedYear: string
    setArimaOptions: Dispatch<SetStateAction<ArimaOptions>>
    setSelectedPlayer: (value?: PlayerInfo) => void
    setSelectedTeam: (value?: TeamInfo) => void
    setSelectedYear: (value: string) => void
}

export const useFilterStateManager = (): FilterState => {
    const [arimaOptions, setArimaOptions] = useState<ArimaOptions>({
        p: 1,
        d: 1,
        q: 1,
        autoarima: false,
    })
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerInfo>()
    const [selectedTeam, setSelectedTeam] = useState<TeamInfo>()
    const [selectedYear, setSelectedYear] = useState<string>('')

    return {
        arimaOptions,
        selectedPlayer,
        selectedTeam,
        selectedYear,
        setArimaOptions,
        setSelectedPlayer,
        setSelectedTeam,
        setSelectedYear,
    }
}
