import {
    KeyboardArrowLeft,
    KeyboardArrowRight,
    KeyboardDoubleArrowLeft,
    KeyboardDoubleArrowRight,
} from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { t } from 'i18next'
import { Dispatch, FC, SetStateAction } from 'react'
import { TranslationKey } from '../../@types/i18n'
import { CustomIconButton } from './CustomIconButton'

interface StepperProps {
    label: TranslationKey
    min: number
    max: number
    value: number
    setValue: Dispatch<SetStateAction<number>>
}

export const Stepper: FC<StepperProps> = ({ label, min, max, value, setValue }) => {
    return (
        <Stack alignItems={'center'} direction={'row'} spacing={1}>
            <CustomIconButton
                disabled={value == min}
                Icon={KeyboardDoubleArrowLeft}
                onClick={() => setValue((prev) => (prev - 10 >= min ? prev - 10 : min))}
            />
            <CustomIconButton
                disabled={value == min}
                Icon={KeyboardArrowLeft}
                onClick={() => setValue((prev) => prev - 1)}
            />
            <Typography>{`${t(label)} ${value}`}</Typography>
            <CustomIconButton
                disabled={value == max}
                Icon={KeyboardArrowRight}
                onClick={() => setValue((prev) => prev + 1)}
            />
            <CustomIconButton
                disabled={value == max}
                Icon={KeyboardDoubleArrowRight}
                onClick={() => setValue((prev) => (prev + 10 <= max ? prev + 10 : max))}
            />
        </Stack>
    )
}
