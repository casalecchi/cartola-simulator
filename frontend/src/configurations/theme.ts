import { createTheme } from '@mui/material'
import colors from '../styles/colors.module.scss'

export const darkTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: colors.darkGreen,
        },
        secondary: {
            main: colors.darkBrown,
        },
        text: {
            primary: colors.blueBlack,
        },
        background: {
            paper: 'rgba(236,220,201,0.95)',
        },
    },
    typography: {
        fontFamily: `"Jersey 15"`,
    },
})
