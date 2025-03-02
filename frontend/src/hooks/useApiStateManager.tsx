import { useEffect, useState } from 'react'
import { PlayerInfo } from '../models/player'
import { useGetPlayersFromYear } from './useGetPlayersFromYear'

export interface ApiStateManager {
    playersInfo: PlayerInfo[]
    selectedYear?: string
    setSelectedYear: (value: string) => void
}

export const useApiStateManager = (): ApiStateManager => {
    const [selectedYear, setSelectedYear] = useState('')
    const { fetchPlayersInfo, playersInfo } = useGetPlayersFromYear()

    useEffect(() => {
        if (selectedYear == '') return
        const convertedYear = Number(selectedYear)
        fetchPlayersInfo(convertedYear)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear])

    return { playersInfo, selectedYear, setSelectedYear }
}
