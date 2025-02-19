import { FC, PropsWithChildren, createContext, useContext, useMemo } from 'react'
import { ApiStateManager, useApiStateManager } from '../hooks/useApiStateManager'

interface DataStateContext {
    apiStateManager: ApiStateManager
}

export const DataContext = createContext<DataStateContext>({} as DataStateContext)

export const DataProvider: FC<PropsWithChildren> = (props) => {
    const apiStateManager = useApiStateManager()

    const dataContextValue = useMemo(() => ({ apiStateManager }), [apiStateManager])

    return <DataContext.Provider value={dataContextValue}>{props.children}</DataContext.Provider>
}

export const useDataContext = () => useContext(DataContext)
