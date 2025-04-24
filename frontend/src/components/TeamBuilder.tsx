import { Button, Grid2, Paper, Stack, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BuilderState } from '../hooks/useBuilderStateManager'
import { OptimalTeam, Player, TeamInfo } from '../models'
import colors from '../styles/colors.module.scss'
import { createArray, formationSlots, getBarDataset } from '../utils'
import { Score, UserStats } from './builder/BuilderStats'
import { BuilderTable } from './builder/BuilderTable'
import { PlayerSlot } from './builder/PlayerSlot'
import { Market } from './Market'
import { TeamTable } from './TeamTable'

interface TeamBuilderProps {
    manager: BuilderState
    market: Player[]
    optimals: OptimalTeam[]
    teamsInfo: TeamInfo[]
}

export const TeamBuilder: FC<TeamBuilderProps> = ({ manager, market, optimals, teamsInfo }) => {
    const { t } = useTranslation()
    const [rows, setRows] = useState<JSX.Element[]>([])
    const { balance, formation, history, marketOptions, round, team, setMarketOptions, submit } =
        manager

    const title = round < 39 ? `${t('simulator.round')} ${round}` : t('simulator.endSeason')

    const closeMarket = () => {
        setMarketOptions((prev) => ({ ...prev, open: false }))
    }

    useEffect(() => {
        setRows([
            ...createArray(formationSlots[formation].man).map((_, i) => (
                <PlayerSlot key={`man${i}`} manager={manager} player={team.man[i]} posId={'man'} />
            )),
            ...createArray(formationSlots[formation].gk).map((_, i) => (
                <PlayerSlot key={`gk${i}`} manager={manager} player={team.gk[i]} posId={'gk'} />
            )),
            ...createArray(formationSlots[formation].cb).map((_, i) => (
                <PlayerSlot key={`cb${i}`} manager={manager} player={team.cb[i]} posId={'cb'} />
            )),
            ...createArray(formationSlots[formation].wb).map((_, i) => (
                <PlayerSlot key={`wb${i}`} manager={manager} player={team.wb[i]} posId={'wb'} />
            )),
            ...createArray(formationSlots[formation].mid).map((_, i) => (
                <PlayerSlot key={`mid${i}`} manager={manager} player={team.mid[i]} posId={'mid'} />
            )),
            ...createArray(formationSlots[formation].st).map((_, i) => (
                <PlayerSlot key={`st${i}`} manager={manager} player={team.st[i]} posId={'st'} />
            )),
        ])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formation, manager.team, manager.captain])

    return (
        <Grid2 container flex={1} spacing={1}>
            <Market
                manager={manager}
                market={market}
                marketOptions={marketOptions}
                onClose={closeMarket}
                teamsInfo={teamsInfo}
            />
            <Grid2 size={4}>
                <Stack height={'100%'} justifyContent={'center'}>
                    <BuilderTable manager={manager}>{rows}</BuilderTable>
                </Stack>
            </Grid2>
            <Grid2 border={'1px solid purple'} size={4}>
                <Stack alignItems={'center'} height={'100%'}>
                    <Typography
                        color={'textSecondary'}
                        fontFamily={`"Jersey 15"`}
                        fontSize={'4.5rem'}
                        sx={{ color: colors.almond }}
                    >
                        {title}
                    </Typography>
                    <Stack
                        alignItems={'center'}
                        flex={1}
                        justifyContent={'space-between'}
                        width={'100%'}
                    >
                        <UserStats balance={balance} history={history} round={round} />
                        <Paper elevation={5} sx={{ width: '100%', opacity: 0.95 }}>
                            <BarChart
                                dataset={getBarDataset({ history, round, optimals })}
                                grid={{ vertical: true, horizontal: true }}
                                height={250}
                                xAxis={[{ dataKey: 'x', scaleType: 'band' }]}
                                series={[
                                    {
                                        dataKey: 'user',
                                        label: t('simulator.you'),
                                        color: colors.darkGreen,
                                    },
                                    {
                                        dataKey: 'model',
                                        label: t('simulator.model'),
                                        color: colors.darkBrown,
                                    },
                                ]}
                            />
                        </Paper>
                        <Score history={history} optimals={optimals} round={round} />
                        <Stack alignItems={'center'} width={'100%'}>
                            <Button
                                onClick={submit}
                                sx={{ width: '5rem' }}
                                variant={'contained'}
                                disabled={
                                    Object.values(team).reduce(
                                        (acc, curr) => acc + curr.length,
                                        0
                                    ) != 12
                                }
                            >
                                {t('common.submit').toUpperCase()}
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Grid2>
            <Grid2 border={'1px solid red'} size={4}>
                <TeamTable
                    manager={manager}
                    market={market}
                    team={optimals.find((o) => o.round - 1 === round)}
                />
            </Grid2>
        </Grid2>
    )
}
