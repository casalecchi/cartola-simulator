import { Stack, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBuilderStateManager } from '../hooks/useBuilderStateManager'
import { Formation, Player } from '../models'
import { createArray, formationSlots, roundNumber } from '../utils'
import { BuilderTable } from './builder/BuilderTable'
import { PlayerSlot } from './builder/PlayerSlot'
import { FormationSelector } from './FormationSelector'
import { Market } from './Market'

interface TeamBuilderProps {
    market: Player[]
}

export const TeamBuilder: FC<TeamBuilderProps> = ({ market }) => {
    const { t } = useTranslation()
    const [formation, setFormation] = useState<Formation>('433')
    const [rows, setRows] = useState<JSX.Element[]>([])
    const builderStateManager = useBuilderStateManager()
    const { marketOptions, team, setMarketOptions } = builderStateManager

    const closeMarket = () => {
        setMarketOptions((prev) => ({ ...prev, open: false }))
    }

    useEffect(() => {
        setRows([
            ...createArray(formationSlots[formation].man).map((_, i) => (
                <PlayerSlot
                    key={`man${i}`}
                    manager={builderStateManager}
                    player={team.man[i]}
                    posId={'man'}
                />
            )),
            ...createArray(formationSlots[formation].gk).map((_, i) => (
                <PlayerSlot
                    key={`gk${i}`}
                    manager={builderStateManager}
                    player={team.gk[i]}
                    posId={'gk'}
                />
            )),
            ...createArray(formationSlots[formation].cb).map((_, i) => (
                <PlayerSlot
                    key={`cb${i}`}
                    manager={builderStateManager}
                    player={team.cb[i]}
                    posId={'cb'}
                />
            )),
            ...createArray(formationSlots[formation].wb).map((_, i) => (
                <PlayerSlot
                    key={`wb${i}`}
                    manager={builderStateManager}
                    player={team.wb[i]}
                    posId={'wb'}
                />
            )),
            ...createArray(formationSlots[formation].mid).map((_, i) => (
                <PlayerSlot
                    key={`mid${i}`}
                    manager={builderStateManager}
                    player={team.mid[i]}
                    posId={'mid'}
                />
            )),
            ...createArray(formationSlots[formation].st).map((_, i) => (
                <PlayerSlot
                    key={`st${i}`}
                    manager={builderStateManager}
                    player={team.st[i]}
                    posId={'st'}
                />
            )),
        ])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formation, builderStateManager.team, builderStateManager.captain])

    return (
        <Stack alignItems={'center'} border={'1px solid red'} flex={1} spacing={2}>
            <Market
                manager={builderStateManager}
                market={market}
                marketOptions={marketOptions}
                onClose={closeMarket}
            />
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
