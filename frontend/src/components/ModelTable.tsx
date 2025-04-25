import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
    Avatar,
    Button,
    Paper,
    Stack,
    SxProps,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BuilderState } from '../hooks/useBuilderStateManager'
import { OptimalTeam, Player } from '../models'
import { roundNumber } from '../utils'
import { cellStyles } from './builder/BuilderTable'

const numberCellStyles: SxProps = {
    px: 1,
}

interface ModelTableProps {
    manager: BuilderState
    market: Player[]
    name?: string
    team?: OptimalTeam
}

export const ModelTable: FC<ModelTableProps> = ({ manager, market, name, team }) => {
    const { t } = useTranslation()
    const [hide, setHide] = useState(true)
    const findPlayer = (id: number) => market.find((p) => p.id === id)
    const teamPlayers = Object.values(manager.team).flatMap((players) => players)

    return (
        team && (
            <TableContainer
                component={Paper}
                sx={{
                    px: 1,
                    opacity: 0.95,
                }}
            >
                <Table padding={'none'}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={cellStyles}></TableCell>
                            <TableCell sx={cellStyles}>
                                <Stack alignItems={'center'} direction={'row'} py={1}>
                                    <Typography>{name?.toUpperCase()}</Typography>
                                </Stack>
                            </TableCell>
                            <TableCell align={'right'} sx={{ ...numberCellStyles, ...cellStyles }}>
                                <Typography>{t('common.prediction')}</Typography>
                            </TableCell>
                            <TableCell align={'center'} sx={cellStyles}>
                                <Stack
                                    alignItems={'center'}
                                    onClick={() => setHide((prev) => !prev)}
                                >
                                    {hide ? <Visibility /> : <VisibilityOff />}
                                </Stack>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {team.team.map((p) => {
                            const player = findPlayer(p.id)
                            const isCap = team.cap === player?.id
                            const isOnTeam = teamPlayers.some((p) => p.id === player?.id)

                            return (
                                <TableRow
                                    key={`${team.round}-${p.id}`}
                                    sx={{
                                        height: '3.35rem',
                                        filter: hide ? 'blur(4px)' : undefined,
                                    }}
                                >
                                    <TableCell
                                        align={'center'}
                                        sx={{ ...cellStyles, width: '3rem' }}
                                    >
                                        <Typography>{player?.positionId.toUpperCase()}</Typography>
                                    </TableCell>
                                    <TableCell sx={cellStyles}>
                                        <Stack
                                            alignItems={'center'}
                                            direction={'row'}
                                            p={1}
                                            spacing={2}
                                        >
                                            <Avatar
                                                alt={player?.name}
                                                src={player?.photoUrl}
                                                sx={{ height: '2.5rem', width: '2.5rem' }}
                                                variant={'circular'}
                                            />
                                            <Typography>{player?.name}</Typography>
                                            {isCap && (
                                                <Typography
                                                    sx={{
                                                        backgroundColor: 'orange',
                                                        height: '1.5rem',
                                                        width: '1.5rem',
                                                        borderRadius: '50%',
                                                        border: '2px solid white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    C
                                                </Typography>
                                            )}
                                        </Stack>
                                    </TableCell>
                                    <TableCell
                                        align={'right'}
                                        sx={{ ...numberCellStyles, ...cellStyles }}
                                    >
                                        {roundNumber(p.pred, 2)}
                                    </TableCell>
                                    <TableCell sx={cellStyles}>
                                        <Button
                                            onClick={() => player && manager.addPlayer(player)}
                                            disabled={
                                                hide ||
                                                !player ||
                                                isOnTeam ||
                                                manager.balance - player.price < 0
                                            }
                                        >
                                            ADD
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    )
}
