import { Stack } from '@mui/material'
import { FC, useState } from 'react'
import { useFilterStateManager } from '../../hooks/useFilterStateManager'
import { useGetOptimal } from '../../hooks/useGetOptimal'
import { useTeamStateManager } from '../../hooks/useTeamStateManager'
import { PlayDialog } from '../PlayDialog'
import { TeamBuilder } from '../TeamBuilder'
import { TeamTable } from '../TeamTable'

export const TeamsView: FC = () => {
    const [openDialog, setOpenDialog] = useState(true)

    const filterStateManager = useFilterStateManager()
    const { selectedYear, selectedModel } = filterStateManager
    const { getOptimals, optimals } = useGetOptimal()
    const teamStateManager = useTeamStateManager({ optimals })

    const runModel = () => {
        if (!selectedModel) return
        getOptimals(Number(selectedYear), selectedModel.toUpperCase())
    }

    return (
        <Stack position={'relative'}>
            <PlayDialog
                filterStateManager={filterStateManager}
                open={openDialog}
                runModel={runModel}
                setOpen={setOpenDialog}
            />
            <Stack alignItems={'center'} height={'100dvh'} p={3} spacing={2} width={'100%'}>
                {optimals.length > 0 && (
                    <Stack direction={'row'} spacing={5} width={'100%'}>
                        <Stack width={'50%'}>
                            <TeamTable team={teamStateManager.team} year={Number(selectedYear)} />
                        </Stack>
                        <Stack width={'50%'}>
                            {/* <TeamController manager={teamStateManager} /> */}
                            <TeamBuilder year={Number(selectedYear)} />
                        </Stack>
                    </Stack>
                )}
            </Stack>
        </Stack>
    )
}
