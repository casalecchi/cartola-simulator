import { Button, Stack } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useDataContext } from '../../contexts/DataContext'
import { useFilterStateManager } from '../../hooks/useFilterStateManager'
import { ArimaParameters } from './ArimaParameters'
import { PlayerField } from './PlayerField'
import { TeamField } from './TeamField'
import { YearField } from './YearField'

export const Filter: FC = () => {
    const { t } = useTranslation()
    const { timeseriesManager } = useDataContext()
    const {
        fetchArimaTimeseriesFromPlayer: fetchArima,
        fetchTimeseriesFromPlayer: fetchTimeseries,
    } = timeseriesManager
    const manager = useFilterStateManager()
    const { selectedPlayer, selectedYear } = manager

    const handleClick = () => {
        if (selectedPlayer && selectedYear != '') {
            fetchArima(
                selectedPlayer.id,
                Number(selectedYear),
                manager.p,
                manager.d,
                manager.q,
                manager.autoarima
            )
            fetchTimeseries(selectedPlayer.id, Number(selectedYear))
        }
    }

    return (
        <Stack spacing={2}>
            <Stack alignItems={'center'} direction={'row'} spacing={2}>
                <YearField filterStateManager={manager} />
                <PlayerField filterStateManager={manager} />
                <TeamField filterStateManager={manager} />
            </Stack>
            <Stack direction={'row'} spacing={2}>
                <ArimaParameters filterStateManager={manager} />
                <Button
                    disabled={!selectedPlayer}
                    onClick={handleClick}
                    sx={{ width: '7rem' }}
                    variant={'outlined'}
                >
                    {t('common.run')}
                </Button>
            </Stack>
        </Stack>
    )
}
