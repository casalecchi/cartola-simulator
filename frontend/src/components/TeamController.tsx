import {
    KeyboardArrowLeft,
    KeyboardArrowRight,
    KeyboardDoubleArrowLeft,
    KeyboardDoubleArrowRight,
} from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts'
import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TeamState } from '../hooks/useTeamStateManager'
import { generateTickPositions, roundNumber } from '../utils'
import { CustomIconButton } from './ui/CustomIconButton'

interface TeamControllerProps {
    manager: TeamState
}

export const TeamController: FC<TeamControllerProps> = ({ manager }) => {
    const { t } = useTranslation()
    const { barSeries, round, setRound } = manager

    const data = useMemo(() => barSeries.slice(0, round), [barSeries, round])

    return (
        <Stack alignItems={'center'} spacing={2}>
            <Stack alignItems={'center'} direction={'row'} spacing={1}>
                <CustomIconButton
                    disabled={round == 1}
                    Icon={KeyboardDoubleArrowLeft}
                    onClick={() => setRound((prev) => (prev - 10 > 0 ? prev - 10 : 1))}
                />
                <CustomIconButton
                    disabled={round == 1}
                    Icon={KeyboardArrowLeft}
                    onClick={() => setRound((prev) => prev - 1)}
                />
                <Typography>{`${t('model.round')} ${round}`}</Typography>
                <CustomIconButton
                    disabled={round == 38}
                    Icon={KeyboardArrowRight}
                    onClick={() => setRound((prev) => prev + 1)}
                />
                <CustomIconButton
                    disabled={round == 38}
                    Icon={KeyboardDoubleArrowRight}
                    onClick={() => setRound((prev) => (prev + 10 <= 38 ? prev + 10 : 38))}
                />
            </Stack>
            <BarChart
                grid={{ vertical: true, horizontal: true }}
                height={290}
                onAxisClick={(_, d) => setRound((d?.axisValue as number) ?? round)}
                series={[{ data }]}
                sx={{ border: '1px solid lightgray', borderRadius: '1rem' }}
                xAxis={[{ data: generateTickPositions(1, round), scaleType: 'band' }]}
            />
            <Stack
                alignItems={'center'}
                justifyContent={'center'}
                p={3}
                spacing={1}
                sx={{ border: '1px solid lightgrey', borderRadius: '1rem' }}
            >
                <Typography sx={{ fontSize: '2rem' }}>
                    {roundNumber(
                        data.reduce((acc, d) => acc + d, 0),
                        2
                    )}
                </Typography>
                <Typography>{t('model.totalPoints').toUpperCase()}</Typography>
            </Stack>
        </Stack>
    )
}
