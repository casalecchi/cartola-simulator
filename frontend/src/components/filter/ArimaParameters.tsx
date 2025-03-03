import { Button, Stack } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { FilterState } from '../../hooks/useFilterStateManager'
import { NumberInput } from '../ui/NumberInput'

interface ArimaParametersProps {
    filterStateManager: FilterState
}

export const ArimaParameters: FC<ArimaParametersProps> = ({ filterStateManager }) => {
    const { t } = useTranslation()
    const { autoarima, d, p, q, setAutoarima, setD, setP, setQ } = filterStateManager

    return (
        <Stack direction={'row'} spacing={2}>
            <Button
                onClick={() => setAutoarima((prev) => !prev)}
                sx={{ width: '9rem' }}
                variant={autoarima ? 'contained' : 'outlined'}
            >
                {t('arima.autoarima').toUpperCase()}
            </Button>
            <NumberInput disabled={autoarima} setValue={setP} title={'arima.p'} value={p} />
            <NumberInput
                disabled={autoarima}
                max={2}
                min={0}
                setValue={setD}
                title={'arima.d'}
                value={d}
            />
            <NumberInput disabled={autoarima} setValue={setQ} title={'arima.q'} value={q} />
        </Stack>
    )
}
