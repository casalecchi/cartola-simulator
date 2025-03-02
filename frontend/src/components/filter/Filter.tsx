import { Stack } from '@mui/material'
import { FC } from 'react'
import { useFilterStateManager } from '../../hooks/useFilterStateManager'
import { PlayerField } from './PlayerField'
import { TeamField } from './TeamField'
import { YearField } from './YearField'

export const Filter: FC = () => {
    const manager = useFilterStateManager()

    return (
        <Stack alignItems={'center'} direction={'row'} spacing={2}>
            <YearField filterStateManager={manager} />
            <PlayerField filterStateManager={manager} />
            <TeamField filterStateManager={manager} />
        </Stack>
    )
}
