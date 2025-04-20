import { Stack, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BuilderState } from '../hooks/useBuilderStateManager'
import { Player } from '../models'
import { createArray, formationSlots, roundNumber } from '../utils'
import { BuilderTable } from './builder/BuilderTable'
import { PlayerSlot } from './builder/PlayerSlot'
import { FormationSelector } from './FormationSelector'
import { Market } from './Market'

interface TeamBuilderProps {
    manager: BuilderState
    market: Player[]
}

export const TeamBuilder: FC<TeamBuilderProps> = ({ manager, market }) => {
    const { t } = useTranslation()
    const [rows, setRows] = useState<JSX.Element[]>([])
    const { formation, marketOptions, team, changeFormation, setMarketOptions } = manager

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
        <Stack alignItems={'center'} border={'1px solid red'} flex={1} spacing={2}>
            <Market
                manager={manager}
                market={market}
                marketOptions={marketOptions}
                onClose={closeMarket}
            />
            <Stack alignItems={'center'} direction={'row'} spacing={5}>
                <FormationSelector setValue={changeFormation} value={formation} />
                <Typography
                    sx={{ border: '1px solid lightgray', borderRadius: '0.5rem', p: 2 }}
                >{`${t('common.cartoleta')}${roundNumber(manager.balance, 2).toFixed(
                    2
                )}`}</Typography>
            </Stack>
            <Stack direction={'row'} spacing={2}>
                <BuilderTable>{rows.slice(0, 6)}</BuilderTable>
                <BuilderTable>{rows.slice(6)}</BuilderTable>
            </Stack>
        </Stack>
    )
}
