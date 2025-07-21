import { useState } from 'react'
import { PlayerInfo } from '../models/player'
import api from '../configurations/api'

export const useGetPlayersFromYear = () => {
    const [playersInfo, setPlayersInfo] = useState<PlayerInfo[]>([])

    const fetchPlayersInfo = async (year: number) => {
        try {
            const response = await api.post('/players', { year })
            setPlayersInfo(response.data as PlayerInfo[])
        } catch (error) {
            console.error(`Error fetching players from ${year}. ${error}`)
        }
    }

    const findPlayer = (id: number) => playersInfo.find((player) => player.id === id)

    return { fetchPlayersInfo, findPlayer, playersInfo }
}
