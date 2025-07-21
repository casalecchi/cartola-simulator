import { Avatar, Button, Paper, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ace from '../../assets/ace.jpg'
import background from '../../assets/capa.gif'
import { useDeviceContext } from '../../contexts/DeviceContext'
import colors from '../../styles/colors.module.scss'

export const HomeView: FC = () => {
    const to = useNavigate()
    const { t } = useTranslation()
    const { mobile } = useDeviceContext()

    return (
        <Stack
            alignItems={'center'}
            justifyContent={'center'}
            minHeight={'100dvh'}
            spacing={2}
            sx={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
        >
            <Stack alignItems={'center'} maxWidth={mobile ? '100%' : '93.75rem'} pb={5}>
                <Typography
                    color={'textSecondary'}
                    fontSize={mobile ? '5rem' : '10rem'}
                    sx={{
                        color: colors.almond,
                        textShadow: '1rem 1rem 1rem black',
                        ...(mobile && { lineHeight: '4.5rem', textAlign: 'center' }),
                    }}
                >
                    {t('home.title')}
                </Typography>
                <Paper
                    sx={{
                        backgroundColor: 'rgba(236,220,201,0.9)',
                        p: 2,
                        width: mobile ? '95%' : '70%',
                    }}
                >
                    <Stack spacing={3}>
                        <Stack p={mobile ? undefined : 2} spacing={2}>
                            <Typography
                                fontSize={mobile ? '2rem' : '4rem'}
                                lineHeight={mobile ? '2rem' : '4rem'}
                            >
                                {t('home.subtitle')}
                            </Typography>
                            <Typography fontSize={'1.25rem'} lineHeight={mobile ? '1rem' : '2rem'}>
                                {t('home.description')}
                            </Typography>
                        </Stack>
                        <Stack p={mobile ? undefined : 2} spacing={2}>
                            <Typography
                                fontSize={mobile ? '2rem' : '4rem'}
                                lineHeight={mobile ? '2rem' : '4rem'}
                            >
                                {t('home.try')}
                            </Typography>
                            <Stack
                                alignItems={'center'}
                                direction={mobile ? 'column' : 'row'}
                                justifyContent={'center'}
                                spacing={5}
                            >
                                <Button
                                    onClick={() => to('/arma')}
                                    sx={{ width: '65%' }}
                                    variant={'contained'}
                                >
                                    <Typography fontSize={mobile ? '2rem' : '2.5rem'}>
                                        {t('home.pages.arma')}
                                    </Typography>
                                </Button>
                                <Button
                                    onClick={() => to('/lstm')}
                                    sx={{ width: '65%' }}
                                    variant={'contained'}
                                >
                                    <Typography fontSize={mobile ? '2rem' : '2.5rem'}>
                                        {t('home.pages.lstm')}
                                    </Typography>
                                </Button>
                                <Button
                                    onClick={() => to('/simulator')}
                                    sx={{ width: '65%' }}
                                    variant={'contained'}
                                >
                                    <Typography fontSize={mobile ? '2rem' : '2.5rem'}>
                                        {t('home.pages.simulator')}
                                    </Typography>
                                </Button>
                            </Stack>
                        </Stack>
                        <Stack alignItems={'center'} pt={5} spacing={1}>
                            <a
                                href="https://ac3lab.github.io/"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <Avatar
                                    alt="ACE Laboratory"
                                    src={ace}
                                    sx={{
                                        height: mobile ? '5rem' : '7rem',
                                        width: mobile ? '5rem' : '7rem',
                                    }}
                                />
                            </a>
                            <Typography fontFamily={`"Jersey 15"`} fontSize={'1.5rem'}>
                                {t('home.ace')}
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
        </Stack>
    )
}
