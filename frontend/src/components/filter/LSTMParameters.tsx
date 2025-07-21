import { Stack } from '@mui/material'
import { FC } from 'react'
import { FilterState } from '../../hooks/useFilterManager'
import { NumberInput } from '../ui/NumberInput'

interface LSTMParametersProps {
    filterStateManager: FilterState
}

export const LSTMParameters: FC<LSTMParametersProps> = ({ filterStateManager }) => {
    const { lstmOptions, selectedPlayer, setLstmOptions } = filterStateManager
    const { nSteps, epochs, u1, u2 } = lstmOptions

    return (
        <Stack direction={'row'} spacing={4}>
            <NumberInput
                max={selectedPlayer ? selectedPlayer.validLSTMValues : 10}
                setValue={(value) => setLstmOptions((prev) => ({ ...prev, nSteps: value }))}
                title={'lstm.nSteps'}
                value={nSteps}
            />
            <NumberInput
                max={4000}
                setValue={(value) => setLstmOptions((prev) => ({ ...prev, epochs: value }))}
                title={'lstm.epochs'}
                value={epochs}
            />
            <NumberInput
                max={1000}
                setValue={(value) => setLstmOptions((prev) => ({ ...prev, u1: value }))}
                title={'lstm.u1'}
                value={u1}
            />
            <NumberInput
                max={1000}
                setValue={(value) => setLstmOptions((prev) => ({ ...prev, u2: value }))}
                title={'lstm.u2'}
                value={u2}
            />
        </Stack>
    )
}
