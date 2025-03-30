import axios from 'axios'
import { useState } from 'react'
import { PlayerTimeseries, PlayerTimeseriesPoint } from '../models'

export interface TimeseriesStateManager {
    loading: boolean
    modelTimeseries: PlayerTimeseries
    timeseries: PlayerTimeseries
    fetchArimaTimeseriesFromPlayer: (
        id: number,
        year: number,
        p?: number,
        d?: number,
        q?: number,
        autoarima?: boolean
    ) => Promise<void>
    fetchLSTMTimeseriesFromPlayer: (id: number, year: number, nSteps: number) => Promise<void>
    fetchTimeseriesFromPlayer: (id: number, year: number) => Promise<void>
    resetAllTimeseries: () => void
}

export const useGetTimeseries = (): TimeseriesStateManager => {
    const [modelTimeseries, setModelTimeseries] = useState<PlayerTimeseries>({ data: [] })
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
            setModelTimeseries({ data: response.data as PlayerTimeseriesPoint[] })
            setArimaLoading(false)
        } catch (error) {
            console.error(
                `Error fetching arima timeseries from player with id=${id} for year=${year}. ${error}`
            )
        }
    }

    const fetchLSTMTimeseriesFromPlayer = async (id: number, year: number, nSteps: number) => {
        try {
            setArimaLoading(true)
            const response = await axios.post('http://localhost:8000/api/player-lstm', {
                id,
                year,
                n_steps: nSteps,
            })
            setModelTimeseries({ data: response.data as PlayerTimeseriesPoint[] })
        } catch (error) {
            console.error(
                `Error fetching arima timeseries from player with id=${id} for year=${year}. ${error}`
            )
        }
        setArimaLoading(false)
    }

    const resetAllTimeseries = () => {
        setModelTimeseries({ data: [] })
        setTimeseries({ data: [] })
    }

    return {
        loading: arimaLoading,
        modelTimeseries,
        timeseries,
        fetchArimaTimeseriesFromPlayer,
        fetchLSTMTimeseriesFromPlayer,
        fetchTimeseriesFromPlayer,
        resetAllTimeseries,
    }
}
