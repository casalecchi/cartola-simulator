import { Button, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

export const HomeView: FC = () => {
    const to = useNavigate()

    return (
        <Stack alignItems={'center'} height={'100dvh'} justifyContent={'center'} spacing={2}>
            <Typography>Home Page</Typography>
            <Stack direction={'row'} spacing={2}>
                <Button onClick={() => to('/arima')} variant={'contained'}>
                    Arima
                </Button>
                <Button onClick={() => to('/lstm')} variant={'contained'}>
                    LSTM
                </Button>
                <Button onClick={() => to('/teams')} variant={'contained'}>
                    OPTIMAL TEAMS
                </Button>
            </Stack>
        </Stack>
    )
}
