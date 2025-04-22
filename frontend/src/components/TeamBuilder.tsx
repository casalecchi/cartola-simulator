import { Button, Stack, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BuilderState } from '../hooks/useBuilderStateManager'
import { Player, TeamInfo } from '../models'
import colors from '../styles/colors.module.scss'
import { createArray, formationSlots, roundNumber } from '../utils'
import { BuilderTable } from './builder/BuilderTable'
import { PlayerSlot } from './builder/PlayerSlot'
import { FormationSelector } from './FormationSelector'
import { Market } from './Market'

interface TeamBuilderProps {
    manager: BuilderState
    market: Player[]
    teamsInfo: TeamInfo[]
}

export const TeamBuilder: FC<TeamBuilderProps> = ({ manager, market, teamsInfo }) => {
    const { t } = useTranslation()
    const [rows, setRows] = useState<JSX.Element[]>([])
    const { formation, marketOptions, round, team, changeFormation, setMarketOptions } = manager

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
        <Stack border={'1px solid red'} direction={'row'} flex={1} spacing={2}>
            <Market
                manager={manager}
                market={market}
                marketOptions={marketOptions}
                onClose={closeMarket}
                teamsInfo={teamsInfo}
            />
            <BuilderTable>{rows}</BuilderTable>
            <Stack>
                <Typography
                    color={'textSecondary'}
                    fontFamily={`"Jersey 15"`}
                    fontSize={'4rem'}
                    sx={{ color: colors.almond, textShadow: `10px 10px 20px ${colors.black}` }}
                >{`${t('simulator.round')} ${round}`}</Typography>
                <Stack
                    alignItems={'center'}
                    border={'1px solid lightgray'}
                    borderRadius={'1rem'}
                    spacing={5}
                >
                    <FormationSelector setValue={changeFormation} value={formation} />
                    <Typography
                        sx={{ border: '1px solid lightgray', borderRadius: '0.5rem', p: 2 }}
                    >{`${t('common.cartoleta')}${roundNumber(manager.balance, 2).toFixed(
                        2
                    )}`}</Typography>
                    <Button onClick={manager.resetTeam}>RESET</Button>
                </Stack>
            </Stack>
        </Stack>
    )
}
