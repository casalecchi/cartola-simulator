import { CssBaseline, ThemeProvider } from '@mui/material'
import { FC } from 'react'
import { Api } from './components/Api'
import { darkTheme } from './configurations/theme'
import { DataProvider } from './contexts/DataContext'

const App: FC = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline>
                <DataProvider>
                    <Api />
                </DataProvider>
            </CssBaseline>
        </ThemeProvider>
    )
}

export default App
