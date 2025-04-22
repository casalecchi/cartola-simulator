import { Close } from '@mui/icons-material'
import {
    Avatar,
    Box,
    Button,
    IconButton,
    Stack,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BuilderState } from '../../hooks/useBuilderStateManager'
import { Player, Position } from '../../models'
import { roundNumber } from '../../utils'
import { cellStyles } from './BuilderTable'

interface PlayerSlotProps {
    manager: BuilderState
    player?: Player
    posId: Position
}

export const PlayerSlot: FC<PlayerSlotProps> = ({ manager, player, posId }) => {
    const { t } = useTranslation()
    const { removePlayer, setMarketOptions } = manager

    const handleClick = () => {
        if (player) {
            removePlayer(player)
            return
        }
        setMarketOptions({ open: true, posId })
    }

    return (
        <TableRow>
            <TableCell align={'center'} sx={cellStyles}>
                {posId.toUpperCase()}
            </TableCell>
            <TableCell align={'left'} sx={cellStyles}>
                <PlayerDetail onClick={handleClick} player={player} />
            </TableCell>
            <TableCell align={'right'} sx={cellStyles}>
                {player && `${t('common.cartoleta')}${roundNumber(player?.price, 2).toFixed(2)}`}
            </TableCell>
            <TableCell align={'right'} sx={cellStyles}>
                {player && roundNumber(player?.lastScore, 2).toFixed(2)}
            </TableCell>
        </TableRow>
    )
}

interface PlayerDetailProps {
    player?: Player
    onClick: () => void
}

const PlayerDetail: FC<PlayerDetailProps> = ({ player, onClick }) => {
    const { t } = useTranslation()
    const [isHovered, setIsHovered] = useState(false)

    return (
        <Stack alignItems={'center'} direction={'row'} p={1} spacing={2}>
            {player ? (
                <>
                    <IconButton
                        disableRipple
                        onClick={onClick}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        sx={{ height: '2rem', width: '2rem' }}
                    >
                        <Avatar
                            alt={player.name}
                            sx={{ height: '2rem', width: '2rem', backgroundColor: 'transparent' }}
                            variant={'circular'}
                        >
                            <img height={'100%'} src={player.photoUrl} style={{ zIndex: 0 }} />
                            {isHovered && (
                                <>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            height: '100%',
                                            width: '100%',
                                            backgroundColor: 'red',
                                            opacity: 0.3,
                                            zIndex: 1,
                                        }}
                                    ></Box>
                                    <Close
                                        sx={{
                                            position: 'absolute',
                                            color: 'white',
                                            fontSize: '2rem',
                                            zIndex: 2,
                                        }}
                                    />
                                </>
                            )}
                        </Avatar>
                    </IconButton>
                    <Typography>{player?.name ?? t('simulator.addPlayer')}</Typography>{' '}
                </>
            ) : (
                <Button onClick={onClick}>ADD PLAYER</Button>
            )}
        </Stack>
    )
}
