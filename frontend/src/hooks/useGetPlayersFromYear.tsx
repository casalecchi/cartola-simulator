import axios from 'axios'
import { useState } from 'react'
import { PlayerInfo } from '../models/player'

export const useGetPlayersFromYear = () => {
    const [playersInfo, setPlayersInfo] = useState<PlayerInfo[]>([])

    const fetchPlayersInfo = async (year: number) => {
        try {
            const response = await axios.post('http://localhost:8000/api/players', { year })
            setPlayersInfo(response.data as PlayerInfo[])
        } catch (error) {
            console.error(`Error fetching players from ${year}. ${error}`)
        }
    }

    return { fetchPlayersInfo, playersInfo }
}
