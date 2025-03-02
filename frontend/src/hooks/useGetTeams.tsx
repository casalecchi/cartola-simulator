import axios from 'axios'
import { useState } from 'react'
import { TeamInfo } from '../models/team'

export const useGetTeams = () => {
    const [teamsInfo, setTeamsInfo] = useState<TeamInfo[]>([])

    const getTeamsInfo = async (year: number) => {
        try {
            const response = await axios.post('http://localhost:8000/api/teams', { year })
            setTeamsInfo(response.data)
        } catch (error) {
            console.error(`Error fetching teams info on backend. ${error}`)
        }
    }

    return { getTeamsInfo, teamsInfo }
}
