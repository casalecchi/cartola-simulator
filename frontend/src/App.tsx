import { CssBaseline, ThemeProvider } from '@mui/material'
import { FC } from 'react'
import { darkTheme } from './configurations/theme'

const App: FC = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline>
                <>Teste</>
            </CssBaseline>
        </ThemeProvider>
    )
}

export default App
