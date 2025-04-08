import { Stack, Typography } from '@mui/material'
import { t } from 'i18next'
import { FC } from 'react'
import { TranslationKey } from '../../@types/i18n'
import { roundNumber } from '../../utils'

interface ValueCardProps {
    label: TranslationKey
    value: number
}

export const ValueCard: FC<ValueCardProps> = ({ label, value }) => {
    return (
        <Stack
            alignItems={'center'}
            justifyContent={'center'}
            p={3}
            spacing={1}
            sx={{ border: '1px solid lightgrey', borderRadius: '1rem' }}
        >
            <Typography sx={{ fontSize: '2rem', fontWeight: 700 }}>
                {roundNumber(value, 2)}
            </Typography>
            <Typography>{t(label).toUpperCase()}</Typography>
        </Stack>
    )
}
