import { Stack } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { FC, useEffect, useState } from 'react'
import { useDataContext } from '../contexts/DataContext'
import { Model, PlayerDataset } from '../models'
import { generateTickPositions, mergeTimeseries } from '../utils'
import { Filter } from './filter/Filter'

interface TimeseriesViewProps {
    model: Model
}

export const TimeseriesView: FC<TimeseriesViewProps> = ({ model }) => {
    const [dataset, setDataset] = useState<PlayerDataset[]>([])
    const { timeseriesManager } = useDataContext()
    const { modelTimeseries, timeseries } = timeseriesManager

    useEffect(() => {
        if (timeseries.data.length > 0 || modelTimeseries.data.length > 0) {
            setDataset(mergeTimeseries(timeseries, 'yReal', modelTimeseries, 'yPred'))
        } else {
            setDataset([])
        }
    }, [timeseries, modelTimeseries])

    return (
        <Stack alignItems={'center'} height={'100dvh'} p={3} spacing={2} width={'100%'}>
            <Filter model={model} />
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
