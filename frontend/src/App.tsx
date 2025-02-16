import { CssBaseline, ThemeProvider } from '@mui/material'
import { FC } from 'react'
import { Api } from './components/Api'
import { darkTheme } from './configurations/theme'

const App: FC = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline>
                <Api />
            </CssBaseline>
        </ThemeProvider>
    )
}

export default App
