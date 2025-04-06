import { Stack } from '@mui/material'
import { FC } from 'react'
import { FilterState } from '../../hooks/useFilterStateManager'
import { NumberInput } from '../ui/NumberInput'

interface LSTMParametersProps {
    filterStateManager: FilterState
}

export const LSTMParameters: FC<LSTMParametersProps> = ({ filterStateManager }) => {
    const { lstmOptions, selectedPlayer, setLstmOptions } = filterStateManager
    const { nSteps } = lstmOptions

    return (
        <Stack direction={'row'} spacing={2}>
            <NumberInput
                max={selectedPlayer ? selectedPlayer.validLSTMValues : 10}
                setValue={(value) => setLstmOptions((prev) => ({ ...prev, nSteps: value }))}
                title={'lstm.nSteps'}
                value={nSteps}
            />
        </Stack>
    )
}
