import {
    Avatar,
    Button,
    Dialog,
    DialogTitle,
    Divider,
    Grid2,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { t } from 'i18next'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BuilderState, MarketOptions } from '../hooks/useBuilderStateManager'
import { Player, TeamInfo } from '../models'
import colors from '../styles/colors.module.scss'
import { roundNumber } from '../utils'
import { CustomAutocomplete } from './ui/CustomAutocomplete'
import { StatusIcon } from './ui/StatusIcon'

interface MarketProps {
    manager: BuilderState
    market: Player[]
    marketOptions: MarketOptions
    onClose: () => void
    teamsInfo: TeamInfo[]
}

export const Market: FC<MarketProps> = ({ manager, market, marketOptions, teamsInfo, onClose }) => {
    const { t } = useTranslation()
    const { balance, team, addPlayer, removePlayer } = manager
    const [filterTeam, setFilterTeam] = useState<TeamInfo>()
    const [search, setSearch] = useState('')

    return (
        <Dialog fullWidth maxWidth={'md'} onClose={onClose} open={marketOptions.open}>
            <DialogTitle>
                <Stack alignItems={'center'} direction={'row'} justifyContent={'space-between'}>
                    <Typography fontSize={'2rem'} fontWeight={700}>
                        {t('common.market').toUpperCase()}
                    </Typography>
                    <Typography fontSize={'1.25rem'} fontWeight={700}>
                        {`${t('common.cartoleta')}${balance.toFixed(2)}`}
                    </Typography>
                    <Stack direction={'row'} spacing={1}>
                        <TextField
                            label={t('filter.byName')}
                            onChange={(event) => setSearch(event.target.value)}
                            sx={{ width: '12rem' }}
                            value={search}
                        />
                        <CustomAutocomplete
                            avatarProps={{ variant: 'square' }}
                            optionImgUrl={'photoUrl'}
                            optionKey={'id'}
                            optionLabel={'name'}
                            options={teamsInfo}
                            selectedOption={filterTeam}
                            setSelectedOption={setFilterTeam}
                            textFieldLabel={'filter.teamTitle'}
                            width={'12rem'}
                        />
                    </Stack>
                </Stack>
            </DialogTitle>
            <Stack divider={<Divider />} overflow={'auto'}>
                {market
                    .filter((p) => p.positionId == marketOptions.posId)
                    .filter((p) => (filterTeam ? p.teamId === filterTeam.id : true))
                    .filter((p) =>
                        search != '' ? p.name.toLowerCase().includes(search.toLowerCase()) : true
                    )
                    .map((player) => {
                        const isOnTeam = !!team[marketOptions.posId].find((p) => p.id === player.id)
                        return (
                            <Row
                                balance={balance}
                                buy={addPlayer}
                                isOnTeam={isOnTeam}
                                key={player.id}
                                player={player}
                                sell={removePlayer}
                                teamInfo={teamsInfo?.find((ti) => ti.id === player.teamId)}
                            />
                        )
                    })}
            </Stack>
        </Dialog>
    )
}

interface RowProps {
    balance: number
    isOnTeam: boolean
    player: Player
    teamInfo?: TeamInfo
    buy: (player: Player) => void
    sell: (player: Player) => void
}

const Row: FC<RowProps> = ({ balance, isOnTeam, player, teamInfo, buy, sell }) => {
    return (
        <Grid2 container alignItems={'center'} px={3} py={3} spacing={2}>
            <Grid2>
                <Stack alignItems={'center'}>
                    <Avatar
                        alt={teamInfo?.name}
                        src={teamInfo?.photoUrl}
                        sx={{ height: 45, width: 45 }}
                        variant={'square'}
                    />
                    <Typography mt={0.1}>{teamInfo?.code}</Typography>
                </Stack>
            </Grid2>
            <Grid2>
                <Avatar
                    alt={player.name}
                    src={player.photoUrl}
                    sx={{ height: 80, width: 80 }}
                    variant={'square'}
                />
            </Grid2>
            <Grid2 size={2.5}>
                <Typography fontSize={'1.35rem'} fontWeight={700}>
                    {player.name}
                </Typography>
            </Grid2>
            <Grid2>
                <StatusIcon status={player.statusId} />
            </Grid2>
            <Grid2 size={3}>
                <Stack
                    borderRadius={'0.5rem'}
                    direction={'row'}
                    justifyContent={'space-between'}
                    px={2}
                    sx={{ backgroundColor: colors.olive }}
                >
                    <Stack alignItems={'center'}>
                        <Typography fontSize={'0.8rem'}>LAST</Typography>
                        <Typography fontWeight={600}>{player.lastScore}</Typography>
                    </Stack>
                    <Stack alignItems={'center'}>
                        <Typography fontSize={'0.8rem'}>AVG</Typography>
                        <Typography fontWeight={600}>{player.average}</Typography>
                    </Stack>
                    <Stack alignItems={'center'}>
                        <Typography fontSize={'0.8rem'}>GAMES</Typography>
                        <Typography fontWeight={600}>{player.gamesPlayed}</Typography>
                    </Stack>
                </Stack>
            </Grid2>
            <Grid2 size={1.5}>
                <Typography fontSize={'1.15rem'} fontWeight={700} textAlign={'center'}>{`${t(
                    'common.cartoleta'
                )}${player.price.toFixed(2)}`}</Typography>
            </Grid2>
            <Grid2 flex={1}>
                <Button
                    fullWidth
                    disabled={roundNumber(balance - player.price, 2) < 0 && !isOnTeam}
                    onClick={() => (isOnTeam ? sell(player) : buy(player))}
                    sx={{
                        backgroundColor: isOnTeam ? 'red' : 'green',
                        borderRadius: '0.5rem',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 700,
                        height: '3rem',
                    }}
                >
                    {t(isOnTeam ? 'simulator.sell' : 'simulator.buy').toUpperCase()}
                </Button>
            </Grid2>
        </Grid2>
    )
}

// const MobileRow: FC<RowProps> = ({ balance, isOnTeam, player, teamInfo, buy, sell }) => {
//     return (
//         <Stack alignItems={'center'} direction={'row'} spacing={1}>
//             <Avatar
//                 alt={player.name}
//                 src={player.photoUrl}
//                 sx={{ height: 100, width: 100 }}
//                 variant={'square'}
//             />
//             <Stack spacing={1} width={'100%'}>
//                 <Stack alignItems={'center'} direction={'row'} spacing={2}>
//                     <StatusIcon status={player.statusId} />
//                     <Stack
//                         alignItems={'center'}
//                         direction={'row'}
//                         justifyContent={'space-between'}
//                         width={'100%'}
//                     >
//                         <Typography fontSize={'1.2rem'}>{player.name}</Typography>
//                         <Typography fontSize={'0.75rem'} sx={{ opacity: 0.4 }}>
//                             {teamInfo?.name}
//                         </Typography>
//                     </Stack>
//                 </Stack>
//                 <Stack
//                     alignItems={'center'}
//                     direction={'row'}
//                     justifyContent={'space-between'}
//                     pl={1}
//                 >
//                     <Stack alignItems={'center'}>
//                         <Typography fontSize={'0.8rem'} sx={{ opacity: 0.4 }}>
//                             LAST
//                         </Typography>
//                         <Typography>{player.lastScore}</Typography>
//                     </Stack>
//                     <Stack alignItems={'center'}>
//                         <Typography fontSize={'0.8rem'} sx={{ opacity: 0.4 }}>
//                             AVG
//                         </Typography>
//                         <Typography>{player.average}</Typography>
//                     </Stack>
//                     <Stack alignItems={'center'}>
//                         <Typography fontSize={'0.8rem'} sx={{ opacity: 0.4 }}>
//                             GAMES
//                         </Typography>
//                         <Typography>{player.gamesPlayed}</Typography>
//                     </Stack>
//                 </Stack>
//                 <Stack
//                     alignItems={'center'}
//                     direction={'row'}
//                     justifyContent={'space-between'}
//                     pl={1}
//                 >
//                     <Typography fontSize={'1.3rem'}>{`${t('common.cartoleta')}${
//                         player.price
//                     }`}</Typography>
//                     <Button
//                         disabled={balance - player.price < 0 && !isOnTeam}
//                         onClick={() => (isOnTeam ? sell(player) : buy(player))}
//                         sx={{
//                             color: 'white',
//                             backgroundColor: isOnTeam ? 'red' : 'green',
//                             borderRadius: 8,
//                             justifyContent: 'center',
//                             width: '45%',
//                         }}
//                     >
//                         {t(isOnTeam ? 'simulator.sell' : 'simulator.buy').toUpperCase()}
//                     </Button>
//                 </Stack>
//             </Stack>
//         </Stack>
//     )
// }
