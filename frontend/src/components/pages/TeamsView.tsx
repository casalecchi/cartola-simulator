import { Button, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useFilterStateManager } from '../../hooks/useFilterStateManager'
import { useGetOptimal } from '../../hooks/useGetOptimal'
import { useTeamStateManager } from '../../hooks/useTeamStateManager'
import { ModelField } from '../filter/ModelField'
import { YearField } from '../filter/YearField'
import { TeamController } from '../TeamController'
import { TeamTable } from '../TeamTable'

export const TeamsView: FC = () => {
    const { t } = useTranslation()
    const filterStateManager = useFilterStateManager()
    const { selectedYear, selectedModel } = filterStateManager
    const { getOptimals, optimals } = useGetOptimal()
    const teamStateManager = useTeamStateManager({ optimals })

    const handleRun = () => {
        if (!selectedModel) return
        getOptimals(Number(selectedYear), selectedModel.toUpperCase())
    }

    return (
        <Stack alignItems={'center'} height={'100dvh'} p={3} spacing={2} width={'100%'}>
            <Stack direction={'row'} spacing={2}>
                <YearField filterStateManager={filterStateManager} />
                <ModelField filterStateManager={filterStateManager} />
                <Button
                    disabled={!filterStateManager.selectedModel}
                    onClick={handleRun}
                    sx={{ width: '7rem' }}
                    variant={'outlined'}
                >
                    <Typography>{t('common.run')}</Typography>
                </Button>
            </Stack>
            {optimals.length > 0 && (
                <Stack direction={'row'} spacing={5} width={'100%'}>
                    <Stack width={'30%'}>
                        <TeamTable team={teamStateManager.team} year={Number(selectedYear)} />
                    </Stack>
                    <Stack width={'70%'}>
                        <TeamController manager={teamStateManager} />
                    </Stack>
                </Stack>
            )}
        </Stack>
    )
}
