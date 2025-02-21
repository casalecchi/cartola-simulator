import { useEffect, useState } from 'react'
import { PlayerInfo } from '../models/player'
import { useGetPlayersFromYear } from './useGetPlayersFromYear'
import { useGetDataYears } from './useGetYears'

export interface ApiStateManager {
    playersInfo: PlayerInfo[]
    selectedYear?: string
    setSelectedYear: (value: string) => void
    years: number[]
}

export const useApiStateManager = (): ApiStateManager => {
    const [selectedYear, setSelectedYear] = useState('')
    const { getDataYears, years } = useGetDataYears()
    const { fetchPlayersInfo, playersInfo } = useGetPlayersFromYear()

    useEffect(() => {
        getDataYears()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (selectedYear == '') return
        const convertedYear = Number(selectedYear)
        fetchPlayersInfo(convertedYear)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear])

    return { playersInfo, selectedYear, setSelectedYear, years }
}
