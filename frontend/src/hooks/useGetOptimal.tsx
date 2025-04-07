import axios from 'axios'
import { useState } from 'react'
import { OptimalTeam } from '../models'

export const useGetOptimal = () => {
    const [otmOptions, setOtmOptions] = useState<string[]>([])
    const [optimals, setOptimals] = useState<OptimalTeam[]>([])

    const getOptimals = async (year: number, optimalCode: string) => {
        try {
            const response = await axios.post('http://localhost:8000/api/otm', {
                year,
                code: optimalCode,
            })
            setOptimals(response.data as OptimalTeam[])
        } catch (error) {
            console.error(`Error fetching Optimal Teams. ${error}`)
        }
    }

    const getOtmOptions = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/otm-options')
            setOtmOptions(response.data)
        } catch (error) {
            console.error(`Error fetching available Otm Options. ${error}`)
        }
    }

    return { getOptimals, getOtmOptions, optimals, otmOptions }
}
