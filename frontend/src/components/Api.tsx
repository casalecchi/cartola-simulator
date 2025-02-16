import { Button, Stack } from '@mui/material'
import { FC } from 'react'
import { useGetDataYears } from '../hooks/useGetYears'

export const Api: FC = () => {
    const { getDataYears, years } = useGetDataYears()

    return (
        <Stack alignItems={'center'} height={'100dvh'} justifyContent={'center'} width={'100%'}>
            <Stack alignItems={'center'} direction={'row'}>
                <Stack
                    alignItems={'center'}
                    border={'1px solid lightgray'}
                    borderRadius={'1rem'}
                    p={2}
                >
                    <Button onClick={getDataYears} variant={'outlined'}>
                        YEARS
                    </Button>
                    {years.length != 0 && years}
                </Stack>
            </Stack>
        </Stack>
    )
}
