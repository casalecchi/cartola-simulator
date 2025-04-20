import axios from 'axios'
import { useState } from 'react'
import { Market } from '../models'

export const useGetMarket = () => {
    const [allMarkets, setAllMarkets] = useState<Market>()

    const fetchAllMarkets = async (year: number) => {
        try {
            const response = await axios.post('http://localhost:8000/api/market', { year })
            setAllMarkets(response.data as Market)
        } catch (error) {
            console.error(`Error fetching markets from ${year}. ${error}`)
        }
    }

    const getRoundMarket = (round: number) => allMarkets?.[round] ?? []

    return { fetchAllMarkets, getRoundMarket }
}
