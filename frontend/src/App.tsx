import { CssBaseline, ThemeProvider } from '@mui/material'
import { FC } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomeView } from './components/pages/HomeView'
import { SimulatorView } from './components/pages/SimulatorView'
import { TimeseriesView } from './components/pages/TimeseriesView'
import { darkTheme } from './configurations/theme'
import { DataProvider } from './contexts/DataContext'

const router = createBrowserRouter([
    { path: '/', element: <HomeView />, errorElement: <>Error 404</> },
    {
        path: '/arima',
        element: <TimeseriesView model={'arima'} />,
    },
    {
        path: '/lstm',
        element: <TimeseriesView model={'lstm'} />,
    },
    {
        path: '/simulator',
        element: <SimulatorView />,
    },
])

const App: FC = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline>
                <DataProvider>
                    <RouterProvider router={router} />
                </DataProvider>
            </CssBaseline>
        </ThemeProvider>
    )
}

export default App
