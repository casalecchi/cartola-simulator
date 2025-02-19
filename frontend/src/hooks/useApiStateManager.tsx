import { useEffect, useState } from 'react'
import { useGetDataYears } from './useGetYears'

export interface ApiStateManager {
    selectedYear?: string
    setSelectedYear: (value: string) => void
    years: number[]
}

export const useApiStateManager = (): ApiStateManager => {
    const [selectedYear, setSelectedYear] = useState('')
    const { getDataYears, years } = useGetDataYears()

    useEffect(() => {
        getDataYears()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { selectedYear, setSelectedYear, years }
}
