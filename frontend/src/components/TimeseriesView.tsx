import { Stack } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { FC, useEffect, useState } from 'react'
import { useGetTimeseries } from '../hooks/useGetTimeseries'
import { PlayerDataset } from '../models'
import { generateTickPositions, mergeTimeseries } from '../utils'
import { Filter } from './filter/Filter'

export const TimeseriesView: FC = () => {
    const [dataset, setDataset] = useState<PlayerDataset[]>([])
    const {
        arimaTimeseries,
        fetchArimaTimeseriesFromPlayer,
        fetchTimeseriesFromPlayer,
        timeseries,
    } = useGetTimeseries()

    useEffect(() => {
        if (timeseries.data.length > 0 || arimaTimeseries.data.length > 0) {
            setDataset(mergeTimeseries(timeseries, 'yReal', arimaTimeseries, 'yPred'))
        }
    }, [timeseries, arimaTimeseries])

    return (
        <Stack alignItems={'center'} height={'100dvh'} p={3} spacing={2} width={'100%'}>
            <Filter
                fetchArima={fetchArimaTimeseriesFromPlayer}
                fetchTimeseries={fetchTimeseriesFromPlayer}
            />
            <LineChart
                dataset={dataset}
                grid={{ vertical: true, horizontal: true }}
                sx={{ border: '1px solid lightgray', borderRadius: '1rem' }}
                xAxis={[{ data: generateTickPositions(1, 38) }]}
                series={[
                    {
                        dataKey: 'yReal',
                        label: 'Real',
                    },
                    {
                        dataKey: 'yPred',
                        label: 'Prediction',
                    },
                ]}
            />
        </Stack>
    )
}
