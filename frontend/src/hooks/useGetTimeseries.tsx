import axios from 'axios'
import { useState } from 'react'
import { PlayerTimeseries, PlayerTimeseriesPoint } from '../models'

export interface TimeseriesStateManager {
    arimaTimeseries: PlayerTimeseries
    loading: boolean
    timeseries: PlayerTimeseries
    fetchArimaTimeseriesFromPlayer: (
        id: number,
        year: number,
        p?: number,
        d?: number,
        q?: number,
        autoarima?: boolean
    ) => Promise<void>
    fetchTimeseriesFromPlayer: (id: number, year: number) => Promise<void>
    resetAllTimeseries: () => void
}

export const useGetTimeseries = (): TimeseriesStateManager => {
    // TODO - colocar label aqui na função
    const [arimaTimeseries, setArimaTimeseries] = useState<PlayerTimeseries>({ data: [] })
    const [arimaLoading, setArimaLoading] = useState(false)
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

    const fetchArimaTimeseriesFromPlayer = async (
        id: number,
        year: number,
        p?: number,
        d?: number,
        q?: number,
        autoarima?: boolean
    ) => {
        try {
            setArimaLoading(true)
            const response = await axios.post('http://localhost:8000/api/player-arima', {
                id,
                year,
                p,
                d,
                q,
                autoarima,
            })
            setArimaTimeseries({ data: response.data as PlayerTimeseriesPoint[] })
            setArimaLoading(false)
        } catch (error) {
            console.error(
                `Error fetching arima timeseries from player with id=${id} for year=${year}. ${error}`
            )
        }
    }

    const resetAllTimeseries = () => {
        setArimaTimeseries({ data: [] })
        setTimeseries({ data: [] })
    }

    return {
        arimaTimeseries,
        loading: arimaLoading,
        timeseries,
        fetchArimaTimeseriesFromPlayer,
        fetchTimeseriesFromPlayer,
        resetAllTimeseries,
    }
}
