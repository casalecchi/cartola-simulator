import axios from 'axios'
import { useState } from 'react'
import { PlayerTimeseries, PlayerTimeseriesPoint } from '../models'

export const useGetTimeseries = () => {
    // TODO - colocar label aqui na função
    const [timeseries, setTimeseries] = useState<PlayerTimeseries>({ data: [] })
    const [arimaTimeseries, setArimaTimeseries] = useState<PlayerTimeseries>({ data: [] })

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

    const fetchArimaTimeseriesFromPlayer = async (
        id: number,
        year: number,
        p?: number,
        d?: number,
        q?: number,
        autoarima?: boolean
    ) => {
        try {
            const response = await axios.post('http://localhost:8000/api/player-arima', {
                id,
                year,
                p,
                d,
                q,
                autoarima,
            })
            setArimaTimeseries({ data: response.data as PlayerTimeseriesPoint[] })
        } catch (error) {
            console.error(
                `Error fetching arima timeseries from player with id=${id} for year=${year}. ${error}`
            )
        }
    }

    return {
        arimaTimeseries,
        timeseries,
        fetchArimaTimeseriesFromPlayer,
        fetchTimeseriesFromPlayer,
    }
}
