import { Button, Stack, Typography } from '@mui/material'
import { t } from 'i18next'
import { FC, useState } from 'react'
import { useBuilderStateManager } from '../../hooks/useBuilderStateManager'
import { useFilterStateManager } from '../../hooks/useFilterStateManager'
import { useGetMarket } from '../../hooks/useGetMarket'
import { useGetOptimal } from '../../hooks/useGetOptimal'
import { PlayDialog } from '../PlayDialog'
import { TeamBuilder } from '../TeamBuilder'

export const SimulatorView: FC = () => {
    const [round, setRound] = useState<number>(1)
    const [openDialog, setOpenDialog] = useState(true)
    const builderStateManager = useBuilderStateManager()
    const filterStateManager = useFilterStateManager()
    const { selectedYear, selectedModel } = filterStateManager
    const { getOptimals } = useGetOptimal()
    const { fetchAllMarkets, getRoundMarket } = useGetMarket()

    const clickPlay = () => {
        if (!selectedModel) return
        getOptimals(Number(selectedYear), selectedModel.toUpperCase())
        if (!selectedYear) return
        fetchAllMarkets(Number(selectedYear))
    }

    const clickSubmit = () => {
        setRound((prev) => prev + 1)
    }

    return (
        <Stack>
            <PlayDialog
                clickPlay={clickPlay}
                filterStateManager={filterStateManager}
                open={openDialog}
                setOpen={setOpenDialog}
            />
            <Stack
                alignItems={'center'}
                border={'1px solid blue'}
                height={'100dvh'}
                justifyContent={'space-between'}
                p={3}
                spacing={2}
                width={'100%'}
            >
                <Typography fontSize={'3rem'}>{`${t('simulator.round')} ${round}`}</Typography>
                <TeamBuilder manager={builderStateManager} market={getRoundMarket(round)} />
                <Stack
                    alignItems={'center'}
                    direction={'row'}
                    justifyContent={'center'}
                    width={'100%'}
                >
                    <Button onClick={clickSubmit} variant={'outlined'}>
                        {t('common.submit').toUpperCase()}
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    )
}
