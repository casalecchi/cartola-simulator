import axios from 'axios'
import { useState } from 'react'
import { Player } from '../models/player'

export const useGetPlayersFromYear = () => {
    const [playersInfo, setPlayersInfo] = useState<Player[]>([])

    const fetchPlayersInfo = async (year: number) => {
        try {
            const response = await axios.post('http://localhost:8000/api/players', { year })
            setPlayersInfo(response.data as Player[])
        } catch (error) {
            console.error(`Error fetching players from ${year}. ${error}`)
        }
    }

    const findPlayer = (id: number) => playersInfo.find((player) => player.id === id)

    return { fetchPlayersInfo, findPlayer, playersInfo }
}
