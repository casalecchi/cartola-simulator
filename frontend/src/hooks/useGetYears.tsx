import { useState } from 'react'
import api from '../configurations/api'

export const useGetDataYears = () => {
    const [years, setYears] = useState<number[]>([])

    const getDataYears = async () => {
        try {
            const response = await api.get('/years')
            setYears(response.data)
        } catch (error) {
            console.error(`Error fetching available years on backend. ${error}`)
        }
    }

    return { getDataYears, years }
}
