import { Dispatch, SetStateAction, useState } from 'react'
import { ArimaOptions, LSTMOptions, Player } from '../models'
import { TeamInfo } from '../models/team'

export interface FilterState {
    arimaOptions: ArimaOptions
    lstmOptions: LSTMOptions
    selectedPlayer?: Player
    selectedModel?: string
    selectedTeam?: TeamInfo
    selectedYear: string
    setArimaOptions: Dispatch<SetStateAction<ArimaOptions>>
    setLstmOptions: Dispatch<SetStateAction<LSTMOptions>>
    setSelectedPlayer: (value?: Player) => void
    setSelectedModel: (value?: string) => void
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
    const [selectedModel, setSelectedModel] = useState<string>()
    const [selectedPlayer, setSelectedPlayer] = useState<Player>()
    const [selectedTeam, setSelectedTeam] = useState<TeamInfo>()
    const [selectedYear, setSelectedYear] = useState<string>('2020')

    return {
        arimaOptions,
        lstmOptions,
        selectedPlayer,
        selectedModel,
        selectedTeam,
        selectedYear,
        setArimaOptions,
        setLstmOptions,
        setSelectedPlayer,
        setSelectedModel,
        setSelectedTeam,
        setSelectedYear,
    }
}
