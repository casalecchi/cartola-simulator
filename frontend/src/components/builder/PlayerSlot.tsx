import { Avatar, Button, Stack, TableCell, TableRow, Typography } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TranslationKey } from '../../@types/i18n'
import { BuilderState } from '../../hooks/useBuilderStateManager'
import { Player, Position } from '../../models'
import { roundNumber } from '../../utils'

interface PlayerSlotProps {
    manager: BuilderState
    player?: Player
    posId: Position
}

export const PlayerSlot: FC<PlayerSlotProps> = ({ manager, player, posId }) => {
    const { t } = useTranslation()

    return (
        <TableRow sx={{ height: '5rem' }}>
            <TableCell>{posId.toUpperCase()}</TableCell>
            <TableCell>
                <PlayerDetail player={player} />
            </TableCell>
            <TableCell>{player && roundNumber(player?.price, 2)}</TableCell>
            <TableCell>{player && roundNumber(player?.lastScore, 2)}</TableCell>
            <TableCell>
                <Button
                    sx={{ backgroundColor: player ? 'red' : 'green', color: 'white' }}
                    variant={player ? 'contained' : 'outlined'}
                >
                    {t(`simulator.${player ? 'sell' : 'buy'}` as TranslationKey)}
                </Button>
            </TableCell>
        </TableRow>
    )
}

interface PlayerDetailProps {
    player?: Player
}

const PlayerDetail: FC<PlayerDetailProps> = ({ player }) => {
    const { t } = useTranslation()
    return (
        <Stack alignItems={'center'} direction={'row'} p={1} spacing={2}>
            <Avatar
                alt={player?.name}
                src={player?.photoUrl}
                sx={{ height: '2rem', width: '2rem' }}
                variant={'circular'}
            />
            <Typography>{player?.name ?? t('simulator.addPlayer')}</Typography>
        </Stack>
    )
}
