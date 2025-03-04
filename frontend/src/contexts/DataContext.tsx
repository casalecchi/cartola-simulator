import { FC, PropsWithChildren, createContext, useContext, useMemo } from 'react'
import { TimeseriesStateManager, useGetTimeseries } from '../hooks/useGetTimeseries'

interface DataStateContext {
    timeseriesManager: TimeseriesStateManager
}

export const DataContext = createContext<DataStateContext>({} as DataStateContext)

export const DataProvider: FC<PropsWithChildren> = (props) => {
    const timeseriesManager = useGetTimeseries()

    const dataContextValue = useMemo(() => ({ timeseriesManager }), [timeseriesManager])

    return <DataContext.Provider value={dataContextValue}>{props.children}</DataContext.Provider>
}

export const useDataContext = () => useContext(DataContext)
