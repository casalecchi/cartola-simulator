import { Stack, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBuilderStateManager } from '../hooks/useBuilderStateManager'
import { useGetPlayersFromYear } from '../hooks/useGetPlayersFromYear'
import { Formation } from '../models'
import { createArray, formationSlots, roundNumber } from '../utils'
import { FormationSelector } from './FormationSelector'
import { BuilderTable } from './builder/BuilderTable'
import { PlayerSlot } from './builder/PlayerSlot'

interface TeamBuilderProps {
    year?: number
}

export const TeamBuilder: FC<TeamBuilderProps> = ({ year }) => {
    const { t } = useTranslation()
    const [formation, setFormation] = useState<Formation>('433')
    const [rows, setRows] = useState<JSX.Element[]>([])
    const { fetchPlayersInfo } = useGetPlayersFromYear()
    const builderStateManager = useBuilderStateManager()

    useEffect(() => {
        setRows([
            ...createArray(formationSlots[formation].man).map((_, i) => (
                <PlayerSlot key={`man${i}`} manager={builderStateManager} posId={'man'} />
            )),
            ...createArray(formationSlots[formation].gk).map((_, i) => (
                <PlayerSlot key={`gk${i}`} manager={builderStateManager} posId={'gk'} />
            )),
            ...createArray(formationSlots[formation].cb).map((_, i) => (
                <PlayerSlot key={`cb${i}`} manager={builderStateManager} posId={'cb'} />
            )),
            ...createArray(formationSlots[formation].wb).map((_, i) => (
                <PlayerSlot key={`wb${i}`} manager={builderStateManager} posId={'wb'} />
            )),
            ...createArray(formationSlots[formation].mid).map((_, i) => (
                <PlayerSlot key={`mid${i}`} manager={builderStateManager} posId={'mid'} />
            )),
            ...createArray(formationSlots[formation].st).map((_, i) => (
                <PlayerSlot key={`st${i}`} manager={builderStateManager} posId={'st'} />
            )),
        ])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formation, builderStateManager.team, builderStateManager.captain])

    useEffect(() => {
        if (!year) return
        fetchPlayersInfo(year)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year])

    return (
        <Stack alignItems={'center'} border={'1px solid red'} flex={1} spacing={2}>
            <Stack alignItems={'center'} direction={'row'} spacing={5}>
                <FormationSelector setValue={setFormation} value={formation} />
                <Typography
                    sx={{ border: '1px solid lightgray', borderRadius: '0.5rem', p: 2 }}
                >{`${t('common.cartoleta')}${roundNumber(builderStateManager.balance, 2).toFixed(
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
