import { useState } from 'react'
import { OptimalTeam } from '../models'
import api from '../configurations/api'

export const useGetOptimal = () => {
    const [otmOptions, setOtmOptions] = useState<string[]>([])
    const [optimals, setOptimals] = useState<OptimalTeam[]>([])

    const getOptimals = async (year: number, optimalCode: string) => {
        try {
            const response = await api.post('/otm', {
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
            const response = await api.get('/otm-options')
            setOtmOptions(response.data)
        } catch (error) {
            console.error(`Error fetching available Otm Options. ${error}`)
        }
    }

    return { getOptimals, getOtmOptions, optimals, otmOptions }
}
