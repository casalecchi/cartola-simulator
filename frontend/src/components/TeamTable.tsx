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
import { roundNumber } from '../utils'

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
                            <TableCell sx={{ ...numberCellStyles }}>Real</TableCell>
                            <TableCell sx={{ ...numberCellStyles }}>Prediction</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {team.team.map((player) => {
                            const pInfo = findPlayer(player.id)
                            return (
                                <TableRow key={`${team.round}-${player.id}`}>
                                    <TableCell>
                                        <Stack
                                            alignItems={'center'}
                                            direction={'row'}
                                            p={1}
                                            spacing={2}
                                        >
                                            <Typography>POS</Typography>
                                            <Avatar
                                                alt={pInfo?.name}
                                                src={pInfo?.photoUrl}
                                                sx={{ height: '2rem', width: '2rem' }}
                                                variant={'circular'}
                                            />
                                            <Typography>{pInfo?.name}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ ...numberCellStyles }}>
                                        {player.points}
                                    </TableCell>
                                    <TableCell sx={{ ...numberCellStyles }}>
                                        {roundNumber(player.pred, 2)}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        <TableRow>
                            <TableCell sx={{ py: 1 }}></TableCell>
                            <TableCell sx={{ py: 1, ...numberCellStyles }}>
                                {roundNumber(
                                    team.team.reduce((acc, player) => acc + player.points, 0),
                                    2
                                )}
                            </TableCell>
                            <TableCell sx={{ py: 1, ...numberCellStyles }}>
                                {roundNumber(
                                    team.team.reduce(
                                        (acc, player) => acc + roundNumber(player.pred, 2),
                                        0
                                    ),
                                    2
                                )}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        )
    )
}
