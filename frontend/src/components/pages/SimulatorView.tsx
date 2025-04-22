import { Button, Stack } from '@mui/material'
import { t } from 'i18next'
import { FC, useEffect, useState } from 'react'
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
    const { round, submit } = builderStateManager
    const filterStateManager = useFilterStateManager()
    const { selectedYear, selectedModel } = filterStateManager
    const { getOptimals } = useGetOptimal()
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
        <Stack>
            <PlayDialog
                clickPlay={clickPlay}
                filterStateManager={filterStateManager}
                open={openDialog}
                setOpen={setOpenDialog}
            />
            <Stack
                border={'1px solid blue'}
                height={'100dvh'}
                justifyContent={'space-between'}
                p={3}
                spacing={2}
                width={'100%'}
            >
                {/* <Typography fontSize={'3rem'}>{`${t('simulator.round')} ${round}`}</Typography> */}
                <TeamBuilder
                    manager={builderStateManager}
                    market={getRoundMarket(round)}
                    teamsInfo={teamsInfo}
                />
                <Stack
                    alignItems={'center'}
                    direction={'row'}
                    justifyContent={'center'}
                    width={'100%'}
                >
                    <Button
                        onClick={submit}
                        variant={'contained'}
                        disabled={
                            Object.values(builderStateManager.team).reduce(
                                (acc, curr) => acc + curr.length,
                                0
                            ) != 12
                        }
                    >
                        {t('common.submit').toUpperCase()}
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    )
}
