import { Stack } from '@mui/material'
import { FC, useState } from 'react'
import { NumberInput } from '../ui/NumberInput'

export const ArimaParameters: FC = () => {
    const [p, setP] = useState(1)
    const [d, setD] = useState(1)
    const [q, setQ] = useState(1)

    return (
        <Stack direction={'row'} spacing={2}>
            <NumberInput setValue={setP} title={'arima.p'} value={p} />
            <NumberInput max={2} min={0} setValue={setD} title={'arima.d'} value={d} />
            <NumberInput setValue={setQ} title={'arima.q'} value={q} />
        </Stack>
    )
}
