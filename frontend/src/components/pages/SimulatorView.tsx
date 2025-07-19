import { Stack } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import background from '../../assets/capa.gif'
import { useBuilderStateManager } from '../../hooks/useBuilderStateManager'
import { useFilterStateManager } from '../../hooks/useFilterStateManager'
import { useGetMarket } from '../../hooks/useGetMarket'
import { useGetOptimal } from '../../hooks/useGetOptimal'
import { useGetTeams } from '../../hooks/useGetTeams'
import { PlayDialog } from '../PlayDialog'
import { TeamBuilder } from '../TeamBuilder'

export const SimulatorView: FC = () => {
    const [openDialog, setOpenDialog] = useState(true)
    const { fetchAllMarkets, getRoundMarket } = useGetMarket()
    const builderStateManager = useBuilderStateManager({ getRoundMarket })
    const { round } = builderStateManager
    const filterStateManager = useFilterStateManager()
    const { selectedYear, selectedModel } = filterStateManager
    const { optimals, getOptimals } = useGetOptimal()
    const { teamsInfo, getTeamsInfo } = useGetTeams()

    const clickPlay = () => {
        if (!selectedModel) return
        getOptimals(Number(selectedYear), selectedModel.toUpperCase())
        if (!selectedYear) return
        fetchAllMarkets(Number(selectedYear))
    }

    useEffect(() => {
        if (!selectedYear) return
        getTeamsInfo(Number(selectedYear))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear])

    return (
        <Stack
            sx={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <PlayDialog
                clickPlay={clickPlay}
                filterStateManager={filterStateManager}
                open={openDialog}
                setOpen={setOpenDialog}
            />
            <Stack
                height={'100dvh'}
                justifyContent={'space-between'}
                p={3}
                spacing={2}
                width={'100%'}
            >
                <TeamBuilder
                    manager={builderStateManager}
                    market={getRoundMarket(round)}
                    modelName={selectedModel}
                    optimals={optimals}
                    teamsInfo={teamsInfo}
                />
            </Stack>
        </Stack>
    )
}
