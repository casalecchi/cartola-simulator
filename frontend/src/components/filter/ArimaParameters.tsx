import { Button, Stack } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { FilterState } from '../../hooks/useFilterManager'
import { NumberInput } from '../ui/NumberInput'

interface ArimaParametersProps {
    filterStateManager: FilterState
}

export const ArimaParameters: FC<ArimaParametersProps> = ({ filterStateManager }) => {
    const { t } = useTranslation()
    const { arimaOptions, setArimaOptions } = filterStateManager
    const { autoarima, d, p, q } = arimaOptions

    return (
        <Stack direction={'row'} spacing={2}>
            <Button
                onClick={() => setArimaOptions((prev) => ({ ...prev, autoarima: !prev.autoarima }))}
                sx={{ width: '9rem' }}
                variant={autoarima ? 'contained' : 'outlined'}
            >
                {t('arima.autoarima').toUpperCase()}
            </Button>
            <NumberInput
                disabled={autoarima}
                setValue={(value) => setArimaOptions((prev) => ({ ...prev, p: value }))}
                title={'arima.p'}
                value={p}
            />
            <NumberInput
                disabled={autoarima}
                max={2}
                min={0}
                setValue={(value) => setArimaOptions((prev) => ({ ...prev, d: value }))}
                title={'arima.d'}
                value={d}
            />
            <NumberInput
                disabled={autoarima}
                setValue={(value) => setArimaOptions((prev) => ({ ...prev, q: value }))}
                title={'arima.q'}
                value={q}
            />
        </Stack>
    )
}
