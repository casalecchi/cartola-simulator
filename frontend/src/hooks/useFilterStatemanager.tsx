import { useState } from 'react'
import { PlayerInfo } from '../models'

export interface FilterState {
    selectedPlayer?: PlayerInfo
    selectedYear: string
    setSelectedPlayer: (value?: PlayerInfo) => void
    setSelectedYear: (value: string) => void
}

export const useFilterStateManager = (): FilterState => {
    const [selectedYear, setSelectedYear] = useState<string>('')
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerInfo>()

    return { selectedPlayer, selectedYear, setSelectedPlayer, setSelectedYear }
}
