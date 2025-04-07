import {
    Avatar,
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
import { FC, useEffect } from 'react'
import { useGetPlayersFromYear } from '../hooks/useGetPlayersFromYear'
import { OptimalTeam } from '../models'
import { getPoints, roundNumber } from '../utils'

const numberCellStyles: SxProps = {
    px: 1,
}

interface TeamTableProps {
    team?: OptimalTeam
    year?: number
}

export const TeamTable: FC<TeamTableProps> = ({ team, year }) => {
    const { fetchPlayersInfo, findPlayer } = useGetPlayersFromYear()

    useEffect(() => {
        if (!year) return
        fetchPlayersInfo(year)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year])

    return (
        team && (
            <TableContainer sx={{ display: 'inline-block' }}>
                <Table padding={'none'}>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell align={'right'} sx={{ ...numberCellStyles }}>
                                Real
                            </TableCell>
                            <TableCell align={'right'} sx={{ ...numberCellStyles }}>
                                Prediction
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {team.team.map((player) => {
                            const pInfo = findPlayer(player.id)
                            const isCap = team.cap === pInfo?.id

                            return (
                                <TableRow key={`${team.round}-${player.id}`}>
                                    <TableCell>
                                        <Typography>{pInfo?.positionId.toUpperCase()}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack
                                            alignItems={'center'}
                                            direction={'row'}
                                            p={1}
                                            spacing={2}
                                        >
                                            <Avatar
                                                alt={pInfo?.name}
                                                src={pInfo?.photoUrl}
                                                sx={{ height: '2rem', width: '2rem' }}
                                                variant={'circular'}
                                            />
                                            <Typography>{pInfo?.name}</Typography>
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
                                    <TableCell align={'right'} sx={{ ...numberCellStyles }}>
                                        {player.points}
                                    </TableCell>
                                    <TableCell align={'right'} sx={{ ...numberCellStyles }}>
                                        {roundNumber(player.pred, 2)}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell align={'right'} sx={{ py: 1, ...numberCellStyles }}>
                                {roundNumber(getPoints(team), 2)}
                            </TableCell>
                            <TableCell align={'right'} sx={{ py: 1, ...numberCellStyles }}>
                                {roundNumber(getPoints(team, 'pred'), 2)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        )
    )
}
