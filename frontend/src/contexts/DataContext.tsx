import { FC, PropsWithChildren, createContext, useContext, useMemo } from 'react'

interface DataStateContext {
    placeholder: number
}

export const DataContext = createContext<DataStateContext>({} as DataStateContext)

export const DataProvider: FC<PropsWithChildren> = (props) => {
    const dataContextValue = useMemo(() => ({ placeholder: 0 }), [])

    return <DataContext.Provider value={dataContextValue}>{props.children}</DataContext.Provider>
}

export const useDataContext = () => useContext(DataContext)
