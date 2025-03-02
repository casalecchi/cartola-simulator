import { Stack } from '@mui/material'
import { FC } from 'react'
import { useFilterStateManager } from '../../hooks/useFilterStateManager'
import { PlayerSelector } from './PlayerSelector'
import { TeamSelector } from './TeamSelector'
import { YearSelector } from './YearSelector'

export const Filter: FC = () => {
    const manager = useFilterStateManager()

    return (
        <Stack alignItems={'center'} direction={'row'} spacing={2}>
            <YearSelector filterStateManager={manager} />
            <PlayerSelector filterStateManager={manager} />
            <TeamSelector filterStateManager={manager} />
        </Stack>
    )
}
