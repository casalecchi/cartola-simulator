import { Button, CircularProgress, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useDataContext } from '../../contexts/DataContext'
import { useFilterStateManager } from '../../hooks/useFilterStateManager'
import { Model } from '../../models'
import { ArimaParameters } from './ArimaParameters'
import { LSTMParameters } from './LSTMParameters'
import { PlayerField } from './PlayerField'
import { TeamField } from './TeamField'
import { YearField } from './YearField'

interface FilterProps {
    model: Model
}

export const Filter: FC<FilterProps> = ({ model }) => {
    const { t } = useTranslation()
    const { timeseriesManager } = useDataContext()
    const {
        loading,
        fetchArimaTimeseriesFromPlayer: fetchArima,
        fetchLSTMTimeseriesFromPlayer: fetchLSTM,
        fetchTimeseriesFromPlayer: fetchTimeseries,
    } = timeseriesManager
    const manager = useFilterStateManager()
    const { selectedPlayer, selectedYear } = manager
    const isArima = model == 'arima'

    const handleClick = () => {
        if (selectedPlayer && selectedYear != '') {
            if (isArima) {
                fetchArima(
                    selectedPlayer.id,
                    Number(selectedYear),
                    manager.arimaOptions.p,
                    manager.arimaOptions.d,
                    manager.arimaOptions.q,
                    manager.arimaOptions.autoarima
                )
            } else {
                fetchLSTM(selectedPlayer.id, Number(selectedYear), manager.lstmOptions.nSteps)
            }
            fetchTimeseries(selectedPlayer.id, Number(selectedYear))
        }
    }

    return (
        <Stack spacing={2}>
            <Stack alignItems={'center'} direction={'row'} spacing={2}>
                <YearField filterStateManager={manager} />
                <PlayerField filterStateManager={manager} model={model} />
                <TeamField filterStateManager={manager} />
            </Stack>
            <Stack direction={'row'} spacing={2}>
                {isArima ? (
                    <ArimaParameters filterStateManager={manager} />
                ) : (
                    <LSTMParameters filterStateManager={manager} />
                )}
                <Button
                    disabled={!selectedPlayer}
                    onClick={handleClick}
                    sx={{ width: '7rem' }}
                    variant={'outlined'}
                >
                    {loading ? (
                        <CircularProgress size={'2rem'} />
                    ) : (
                        <Typography>{t('common.run')}</Typography>
                    )}
                </Button>
            </Stack>
        </Stack>
    )
}
