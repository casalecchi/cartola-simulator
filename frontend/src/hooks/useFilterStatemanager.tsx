import { Dispatch, SetStateAction, useState } from 'react'
import { ArimaOptions, LSTMOptions, PlayerInfo } from '../models'
import { TeamInfo } from '../models/team'

export interface FilterState {
    arimaOptions: ArimaOptions
    lstmOptions: LSTMOptions
    selectedPlayer?: PlayerInfo
    selectedTeam?: TeamInfo
    selectedYear: string
    setArimaOptions: Dispatch<SetStateAction<ArimaOptions>>
    setLstmOptions: Dispatch<SetStateAction<LSTMOptions>>
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
    const [lstmOptions, setLstmOptions] = useState<LSTMOptions>({ nSteps: 5 })
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerInfo>()
    const [selectedTeam, setSelectedTeam] = useState<TeamInfo>()
    const [selectedYear, setSelectedYear] = useState<string>('')

    return {
        arimaOptions,
        lstmOptions,
        selectedPlayer,
        selectedTeam,
        selectedYear,
        setArimaOptions,
        setLstmOptions,
        setSelectedPlayer,
        setSelectedTeam,
        setSelectedYear,
    }
}
