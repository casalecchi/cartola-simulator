import { CssBaseline, ThemeProvider } from '@mui/material'
import { FC } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomeView } from './components/pages/HomeView'
import { SimulatorView } from './components/pages/SimulatorView'
import { TimeseriesView } from './components/pages/TimeseriesView'
import { darkTheme } from './configurations/theme'
import { DataProvider } from './contexts/DataContext'
import { DeviceProvider } from './contexts/DeviceContext'

const router = createBrowserRouter([
    { path: '/', element: <HomeView />, errorElement: <>Error 404</> },
    {
        path: '/arma',
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
                <DeviceProvider>
                    <DataProvider>
                        <RouterProvider router={router} />
                    </DataProvider>
                </DeviceProvider>
            </CssBaseline>
        </ThemeProvider>
    )
}

export default App
