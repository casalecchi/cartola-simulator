import { Stack } from '@mui/material'
import { BarChart } from '@mui/x-charts'
import { FC, useMemo } from 'react'
import { TeamState } from '../hooks/useTeamStateManager'
import { generateTickPositions } from '../utils'
import { Stepper } from './ui/Stepper'
import { ValueCard } from './ui/ValueCard'

interface TeamControllerProps {
    manager: TeamState
}

export const TeamController: FC<TeamControllerProps> = ({ manager }) => {
    const { barSeries, round, setRound } = manager

    const data = useMemo(() => barSeries.slice(0, round), [barSeries, round])
    const accumulated = useMemo(() => data.reduce((acc, d) => acc + d, 0), [data])

    return (
        <Stack alignItems={'center'} height={'100%'} justifyContent={'center'} spacing={2}>
            <Stepper label={'model.round'} max={38} min={1} setValue={setRound} value={round} />
            <BarChart
                grid={{ vertical: true, horizontal: true }}
                height={400}
                onAxisClick={(_, d) => setRound((d?.axisValue as number) ?? round)}
                series={[{ data }]}
                sx={{ border: '1px solid lightgray', borderRadius: '1rem' }}
                xAxis={[{ data: generateTickPositions(1, round), scaleType: 'band' }]}
            />
            <Stack direction={'row'} spacing={2}>
                <ValueCard label={'model.totalPoints'} value={accumulated} />
                <ValueCard label={'model.average'} value={accumulated / round} />
            </Stack>
        </Stack>
    )
}
