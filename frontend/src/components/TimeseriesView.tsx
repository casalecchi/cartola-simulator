import { Stack } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { FC } from 'react'
import { generateTickPositions } from '../utils'
import { Filter } from './filter/Filter'

export const TimeseriesView: FC = () => {
    return (
        <Stack alignItems={'center'} height={'100dvh'} p={3} spacing={2} width={'100%'}>
            <Filter />
            <LineChart
                grid={{ vertical: true, horizontal: true }}
                series={[]}
                sx={{ border: '1px solid lightgray', borderRadius: '1rem' }}
                xAxis={[{ data: generateTickPositions(1, 38) }]}
            />
        </Stack>
    )
}
