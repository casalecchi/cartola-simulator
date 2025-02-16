import { CssBaseline, ThemeProvider } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { darkTheme } from './configurations/theme'

const App: FC = () => {
    const { t } = useTranslation()

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline>
                <>{t('test')}</>
            </CssBaseline>
        </ThemeProvider>
    )
}

export default App
