import axios from 'axios'
import { useState } from 'react'
import { PlayerTimeseries, PlayerTimeseriesPoint } from '../models'

export const useGetTimeseries = () => {
    const [timeseries, setTimeseries] = useState<PlayerTimeseries>({ data: [] })

    const fetchTimeseriesFromPlayer = async (id: number, year: number) => {
        try {
            const response = await axios.post('http://localhost:8000/api/player-timeseries', {
                id,
                year,
            })
            setTimeseries({ data: response.data as PlayerTimeseriesPoint[] })
        } catch (error) {
            console.error(
                `Error fetching timeseries from player with id=${id} for year=${year}. ${error}`
            )
        }
    }

    return { fetchTimeseriesFromPlayer, timeseries }
}
