import { TextField } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TranslationKey } from '../../@types/i18n'

interface NumberInputProps {
    disabled?: boolean
    max?: number
    min?: number
    title: TranslationKey
    value: number
    setValue: (value: number) => void
}

export const NumberInput: FC<NumberInputProps> = ({
    disabled,
    max = 5,
    min = 1,
    title,
    value,
    setValue,
}) => {
    const { t } = useTranslation()

    return (
        <TextField
            disabled={disabled}
            label={t(title)}
            sx={{ width: '6rem' }}
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
