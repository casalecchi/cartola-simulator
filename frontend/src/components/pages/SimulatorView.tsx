import { Button, Stack, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useFilterStateManager } from '../../hooks/useFilterStateManager'
import { useGetMarket } from '../../hooks/useGetMarket'
import { useGetOptimal } from '../../hooks/useGetOptimal'
import { PlayDialog } from '../PlayDialog'
import { TeamBuilder } from '../TeamBuilder'

export const SimulatorView: FC = () => {
    const [openDialog, setOpenDialog] = useState(true)
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
                <Typography fontSize={'3rem'}>RODADA X</Typography>
                <TeamBuilder market={getRoundMarket(1)} />
                <Stack
                    alignItems={'center'}
                    direction={'row'}
                    justifyContent={'space-between'}
                    width={'100%'}
                >
                    <Button variant={'outlined'}>PREVIOUS</Button>
                    <Button variant={'contained'}>NEXT</Button>
                </Stack>
            </Stack>
        </Stack>
    )
}
