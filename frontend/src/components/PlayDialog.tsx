import { Close } from '@mui/icons-material'
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FilterState } from '../hooks/useFilterStateManager'
import { ModelField } from './filter/ModelField'
import { YearField } from './filter/YearField'
import { CustomIconButton } from './ui/CustomIconButton'

interface DialogProps {
    filterStateManager: FilterState
    open: boolean
    runModel: () => void
    setOpen: (value: boolean) => void
}

export const PlayDialog: FC<DialogProps> = ({ filterStateManager, open, runModel, setOpen }) => {
    const { t } = useTranslation()
    const to = useNavigate()

    const handlePlay = () => {
        setOpen(false)
        runModel()
    }

    return (
        <Dialog
            keepMounted
            open={open}
            // TransitionComponent={Transition}
        >
            <CustomIconButton
                Icon={Close}
                iconColor={'gray'}
                onClick={() => to('/')}
                sx={{ position: 'absolute', top: 12, right: 15 }}
            />
            <DialogTitle>{t('play.title')}</DialogTitle>
            <DialogContent>
                <DialogContentText>{t('play.description')}</DialogContentText>
                <DialogContentText>{t('play.instructions')}</DialogContentText>
                <Stack alignItems={'center'}>
                    <Stack
                        alignItems={'center'}
                        direction={'row'}
                        justifyContent={'center'}
                        py={2}
                        spacing={2}
                    >
                        <YearField filterStateManager={filterStateManager} />
                        <ModelField filterStateManager={filterStateManager} />
                    </Stack>
                    <Button
                        disabled={!filterStateManager.selectedModel}
                        onClick={handlePlay}
                        sx={{ maxWidth: '5rem' }}
                        variant={'contained'}
                    >
                        {t('common.play')}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}
