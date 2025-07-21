import { useMediaQuery } from '@mui/material'
import { createContext, ReactNode, useContext, useMemo } from 'react'

interface DeviceContextType {
    mobile: boolean
}

const DeviceContext = createContext<DeviceContextType>({ mobile: false })

const DeviceProvider = ({ children }: { children: ReactNode }) => {
    const mobile = useMediaQuery('(max-width: 1025px)', { noSsr: true })

    const value = useMemo(() => ({ mobile }), [mobile])

    return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
}

export { DeviceContext, DeviceProvider }

export const useDeviceContext = () => useContext(DeviceContext)
