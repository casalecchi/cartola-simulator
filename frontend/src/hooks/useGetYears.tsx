import axios from 'axios'
import { useState } from 'react'

export const useGetDataYears = () => {
    const [years, setYears] = useState<number[]>([])

    const getDataYears = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/years')
            setYears(response.data)
        } catch (error) {
            console.error(`Error fetching available years on backend. ${error}`)
        }
    }

    return { getDataYears, years }
}
