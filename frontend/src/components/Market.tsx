import { Avatar, Button, Dialog, Divider, Stack, Typography } from '@mui/material'
import { t } from 'i18next'
import { FC } from 'react'
import { BuilderState, MarketOptions } from '../hooks/useBuilderStateManager'
import { Player } from '../models'
import StatusIcon from './ui/StatusIcon'

interface MarketProps {
    manager: BuilderState
    market: Player[]
    marketOptions: MarketOptions
    onClose: () => void
}

export const Market: FC<MarketProps> = ({ manager, market, marketOptions, onClose }) => {
    const { team, addPlayer, removePlayer } = manager

    return (
        <Dialog onClose={onClose} open={marketOptions.open}>
            <Stack divider={<Divider />} overflow={'auto'}>
                {(market ?? [])
                    .filter((p) => p.positionId == marketOptions.posId)
                    .map((player) => {
                        const isOnTeam = !!team[marketOptions.posId].find((p) => p.id === player.id)
                        return (
                            <MarketRow
                                buy={addPlayer}
                                isOnTeam={isOnTeam}
                                key={player.id}
                                player={player}
                                sell={removePlayer}
                                teamName={'Fluminense'}
                            />
                        )
                    })}
            </Stack>
        </Dialog>
    )
}

interface MarketRowProps {
    isOnTeam: boolean
    player: Player
    teamName?: string
    buy: (player: Player) => void
    sell: (player: Player) => void
}

const MarketRow: FC<MarketRowProps> = ({ isOnTeam, player, teamName, buy, sell }) => {
    return (
        <Stack alignItems={'center'} direction={'row'} spacing={1}>
            <Avatar
                alt={player.name}
                src={player.photoUrl}
                sx={{ height: 100, width: 100 }}
                variant={'square'}
            />
            <Stack spacing={1} width={'100%'}>
                <Stack alignItems={'center'} direction={'row'} spacing={2}>
                    <StatusIcon status={player.statusId} />
                    <Stack
                        alignItems={'center'}
                        direction={'row'}
                        justifyContent={'space-between'}
                        width={'100%'}
                    >
                        <Typography fontSize={'1.2rem'}>{player.name}</Typography>
                        <Typography fontSize={'0.75rem'} sx={{ opacity: 0.4 }}>
                            {teamName}
                        </Typography>
                    </Stack>
                </Stack>
                <Stack
                    alignItems={'center'}
                    direction={'row'}
                    justifyContent={'space-between'}
                    pl={1}
                >
                    <Stack alignItems={'center'}>
                        <Typography fontSize={'0.8rem'} sx={{ opacity: 0.4 }}>
                            LAST
                        </Typography>
                        <Typography>{player.lastScore}</Typography>
                    </Stack>
                    <Stack alignItems={'center'}>
                        <Typography fontSize={'0.8rem'} sx={{ opacity: 0.4 }}>
                            AVG
                        </Typography>
                        <Typography>{player.average}</Typography>
                    </Stack>
                    <Stack alignItems={'center'}>
                        <Typography fontSize={'0.8rem'} sx={{ opacity: 0.4 }}>
                            GAMES
                        </Typography>
                        <Typography>{player.gamesPlayed}</Typography>
                    </Stack>
                </Stack>
                <Stack
                    alignItems={'center'}
                    direction={'row'}
                    justifyContent={'space-between'}
                    pl={1}
                >
                    <Typography fontSize={'1.3rem'}>{`${t('common.cartoleta')}${
                        player.price
                    }`}</Typography>
                    <Button
                        onClick={() => (isOnTeam ? sell(player) : buy(player))}
                        sx={{
                            color: 'white',
                            backgroundColor: isOnTeam ? 'red' : 'green',
                            borderRadius: 8,
                            justifyContent: 'center',
                            width: '45%',
                        }}
                    >
                        {t(isOnTeam ? 'simulator.sell' : 'simulator.buy').toUpperCase()}
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    )
}
