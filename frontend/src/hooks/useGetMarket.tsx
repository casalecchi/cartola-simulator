import { useState } from 'react'
import { Market } from '../models'
import api from '../configurations/api'

export const useGetMarket = () => {
    const [allMarkets, setAllMarkets] = useState<Market>()

    const fetchAllMarkets = async (year: number) => {
        try {
            const response = await api.post('/market', { year })
            setAllMarkets(response.data as Market)
        } catch (error) {
            console.error(`Error fetching markets from ${year}. ${error}`)
        }
    }

    const getRoundMarket = (round: number) => {
        const market = allMarkets?.[round] ?? []
        const probables = market
            .filter((p) => p.statusId === 'probable')
            .toSorted((a, b) => b.price - a.price)
        const others = market
            .filter((p) => p.statusId !== 'probable')
            .toSorted((a, b) => b.price - a.price)
        return [...probables, ...others]
    }

    return { fetchAllMarkets, getRoundMarket }
}
