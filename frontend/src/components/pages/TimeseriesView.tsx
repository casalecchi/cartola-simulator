import { Stack } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { FC, useEffect, useState } from 'react'
import background from '../../assets/capa.gif'
import { useDataContext } from '../../contexts/DataContext'
import { useDeviceContext } from '../../contexts/DeviceContext'
import { Dataset, Model } from '../../models'
import { generateTickPositions, mergeTimeseries } from '../../utils'
import { Filter } from '../filter/Filter'
import { HomeButton } from '../ui/HomeButton'

interface TimeseriesViewProps {
    model: Model
}

export const TimeseriesView: FC<TimeseriesViewProps> = ({ model }) => {
    const [dataset, setDataset] = useState<Dataset[]>([])
    const { timeseriesManager } = useDataContext()
    const { mobile } = useDeviceContext()
    const { modelTimeseries, timeseries } = timeseriesManager

    useEffect(() => {
        if (timeseries.data.length > 0 || modelTimeseries.data.length > 0) {
            setDataset(mergeTimeseries(timeseries, 'yReal', modelTimeseries, 'yPred'))
        } else {
            setDataset([])
        }
    }, [timeseries, modelTimeseries])

    return (
        <Stack
            position={'relative'}
            sx={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <HomeButton topLeft={!mobile} />
            <Stack
                alignItems={'center'}
                height={mobile ? '150dvh' : '100dvh'}
                p={mobile ? 1 : 3}
                spacing={2}
                width={'100%'}
            >
                <Filter model={model} />
                <LineChart
                    dataset={dataset}
                    grid={{ vertical: true, horizontal: true }}
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
                    sx={{
                        border: '1px solid lightgray',
                        borderRadius: '1rem',
                        backgroundColor: 'rgba(236,220,201,0.95)',
                    }}
                />
            </Stack>
        </Stack>
    )
}
