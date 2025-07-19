import { Avatar, Button, Paper, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import ace from '../../assets/ace.jpg'
import background from '../../assets/capa.gif'
import colors from '../../styles/colors.module.scss'

export const HomeView: FC = () => {
    const to = useNavigate()

    return (
        <Stack
            alignItems={'center'}
            height={'100dvh'}
            justifyContent={'center'}
            spacing={2}
            sx={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Stack alignItems={'center'} height={'100dvh'} maxWidth={'93.75rem'} pb={5}>
                <Typography
                    color={'textSecondary'}
                    fontFamily={`"Jersey 15"`}
                    fontSize={window.innerHeight > 900 ? '10rem' : '8rem'}
                    sx={{ color: colors.almond, textShadow: '1rem 1rem 1rem black' }}
                >
                    Cartola Simulator
                </Typography>
                <Paper
                    sx={{
                        backgroundColor: 'rgba(236,220,201,0.9)',
                        height: '75%',
                        p: 2,
                        width: '70%',
                    }}
                >
                    <Stack height={'100%'} justifyContent={'space-between'}>
                        <Stack>
                            <Typography fontSize={window.innerHeight > 900 ? '4rem' : '2.5rem'}>
                                Welcome to the Cartola Simulator!
                            </Typography>
                            <Typography fontSize={'1.25rem'}>
                                This application is designed to help you simulate and predict player
                                performances in the famous Brazilian fantasy football game, Cartola
                                FC. Using advanced time series forecasting models, we provide
                                accurate predictions for player scores based on historical data and
                                trends. Explore the features to build your ultimate fantasy football
                                team, analyze projected scores, and make informed decisions for each
                                round. Stay ahead of the competition with real-time insights and
                                optimize your team’s performance with our powerful prediction tools.
                                Start simulating today and take your Cartola FC strategy to the next
                                level!
                            </Typography>
                            <Stack>
                                <Typography fontSize={'3rem'}>Have a try!</Typography>
                                <Stack direction={'row'} justifyContent={'center'} spacing={5}>
                                    <Button onClick={() => to('/arma')} variant={'contained'}>
                                        <Typography fontSize={'2.5rem'}>Arma</Typography>
                                    </Button>
                                    <Button onClick={() => to('/lstm')} variant={'contained'}>
                                        <Typography fontSize={'2.5rem'}>LSTM</Typography>
                                    </Button>
                                    <Button onClick={() => to('/simulator')} variant={'contained'}>
                                        <Typography fontSize={'2.5rem'}>Simulator</Typography>
                                    </Button>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack alignItems={'center'} spacing={1}>
                            <a
                                href="https://ac3lab.github.io/"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <Avatar
                                    alt="ACE Laboratory"
                                    src={ace}
                                    sx={{
                                        height: window.innerHeight > 900 ? '7rem' : '5rem',
                                        width: window.innerHeight > 900 ? '7rem' : '5rem',
                                    }}
                                />
                            </a>
                            <Typography fontFamily={`"Jersey 15"`} fontSize={'1.5rem'}>
                                Developed by ACE Laboratory
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
        </Stack>
    )
}
