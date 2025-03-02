import { CssBaseline, ThemeProvider } from '@mui/material'
import { FC } from 'react'
import { TimeseriesView } from './components/TimeseriesView'
import { darkTheme } from './configurations/theme'
import { DataProvider } from './contexts/DataContext'

const App: FC = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline>
                <DataProvider>
                    <TimeseriesView />
                </DataProvider>
            </CssBaseline>
        </ThemeProvider>
    )
}

export default App
