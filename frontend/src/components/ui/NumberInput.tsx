import { TextField } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TranslationKey } from '../../@types/i18n'

interface NumberInputProps {
    max?: number
    min?: number
    title: TranslationKey
    value: number
    setValue: (value: number) => void
}

export const NumberInput: FC<NumberInputProps> = ({ max = 5, min = 1, title, value, setValue }) => {
    const { t } = useTranslation()

    return (
        <TextField
            label={t(title)}
            sx={{ width: '12rem' }}
            type={'number'}
            value={value}
            onChange={(e) => {
                let num = Number(e.target.value)
                if (num < min) num = min
                if (num > max) num = max
                setValue(num)
            }}
            slotProps={{
                inputLabel: { shrink: true },
            }}
        />
    )
}
