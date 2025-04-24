import { Paper, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { HistoryTeam, OptimalTeam } from '../../models'
import { getPoints, roundNumber } from '../../utils'

interface UserStatsProps {
    balance: number
    history: HistoryTeam[]
    round: number
}

export const UserStats: FC<UserStatsProps> = ({ balance, history, round }) => {
    const { t } = useTranslation()

    return (
        <Paper elevation={5} sx={{ opacity: 0.95, p: 1 }}>
            <Stack direction={'row'} justifyContent={'space-between'} spacing={4}>
                <Stack alignItems={'center'}>
                    <Typography>{t('simulator.balance')}</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700 }}>{`${t(
                        'common.cartoleta'
                    )}${roundNumber(balance, 2).toFixed(2)}`}</Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography>{t('simulator.lastScore')}</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        {roundNumber(history[round - 2]?.points ?? 0, 2).toFixed(2)}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    )
}

interface ScoreProps {
    history: HistoryTeam[]
    optimals: OptimalTeam[]
    round: number
}

export const Score: FC<ScoreProps> = ({ history, optimals, round }) => {
    const { t } = useTranslation()

    return (
        <Paper elevation={5} sx={{ opacity: 0.95, p: 1 }}>
            <Stack direction={'row'} justifyContent={'space-between'} spacing={4}>
                <Stack alignItems={'center'}>
                    <Typography>{t('simulator.you')}</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        {roundNumber(
                            history.slice(0, round - 1).reduce((acc, curr) => acc + curr.points, 0),
                            2
                        ).toFixed(2)}
                    </Typography>
                </Stack>
                <Stack alignItems={'center'}>
                    <Typography>{t('simulator.model')}</Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        {roundNumber(
                            optimals
                                .slice(0, round - 1)
                                .reduce((acc, curr) => acc + getPoints(curr), 0),
                            2
                        ).toFixed(2)}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    )
}
