import { useState } from 'react'
import { TeamInfo } from '../models/team'
import api from '../configurations/api'

export const useGetTeams = () => {
    const [teamsInfo, setTeamsInfo] = useState<TeamInfo[]>([])

    const getTeamsInfo = async (year: number) => {
        try {
            const response = await api.post('/teams', { year })
            setTeamsInfo(response.data)
        } catch (error) {
            console.error(`Error fetching teams info on backend. ${error}`)
        }
    }

    return { getTeamsInfo, teamsInfo }
}
