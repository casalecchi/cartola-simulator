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
import { Dispatch, FC, SetStateAction, useState } from 'react'
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
    const { captain, removePlayer, setCaptain, setMarketOptions } = manager

    const handleClick = () => {
        if (player) {
            removePlayer(player)
            return
        }
        setMarketOptions({ open: true, posId })
    }

    return (
        <TableRow sx={{ height: '3.35rem' }}>
            <TableCell align={'center'} sx={{ ...cellStyles, width: '3rem' }}>
                {posId.toUpperCase()}
            </TableCell>
            <TableCell align={'left'} sx={cellStyles}>
                <PlayerDetail
                    captain={captain}
                    onClick={handleClick}
                    player={player}
                    setCaptain={setCaptain}
                />
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
    captain?: Player
    player?: Player
    onClick: () => void
    setCaptain: Dispatch<SetStateAction<Player | undefined>>
}

const PlayerDetail: FC<PlayerDetailProps> = ({ captain, player, onClick, setCaptain }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [capHover, setCapHover] = useState(false)
    const isCaptain = captain?.id === player?.id

    return (
        <Stack alignItems={'center'} direction={'row'} p={1} spacing={2}>
            {player ? (
                <Stack
                    alignItems={'center'}
                    direction={'row'}
                    justifyContent={'space-between'}
                    width={'100%'}
                >
                    <Stack alignItems={'center'} direction={'row'}>
                        <IconButton
                            disableRipple
                            onClick={onClick}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            sx={{ height: '2rem', width: '2rem' }}
                        >
                            <Avatar
                                alt={player.name}
                                variant={'circular'}
                                sx={{
                                    height: '2rem',
                                    width: '2rem',
                                    backgroundColor: 'transparent',
                                }}
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
                        <Typography ml={'1rem'}>{player.name}</Typography>
                    </Stack>
                    {player.positionId != 'man' && (
                        <Typography
                            onMouseEnter={() => setCapHover(true)}
                            onMouseLeave={() => setCapHover(false)}
                            onClick={() =>
                                setCaptain((prev) => (prev?.id == player.id ? undefined : player))
                            }
                            sx={{
                                backgroundColor: capHover || isCaptain ? 'orange' : 'gray',
                                height: '1.5rem',
                                width: '1.5rem',
                                borderRadius: '50%',
                                border: '2px solid white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: captain && isCaptain ? 1 : 0.5,
                                cursor: 'pointer',
                            }}
                        >
                            C
                        </Typography>
                    )}
                </Stack>
            ) : (
                <Button onClick={onClick}>ADD PLAYER</Button>
            )}
        </Stack>
    )
}
