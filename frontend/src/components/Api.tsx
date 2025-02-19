import {
    Autocomplete,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
} from '@mui/material'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDataContext } from '../contexts/DataContext'
import { PlayerInfo } from '../models/playerInfo'

export const Api: FC = () => {
    const { t } = useTranslation()
    const { apiStateManager } = useDataContext()
    const { playersInfo, selectedYear, setSelectedYear, years } = apiStateManager
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerInfo | null>(null)

    const handleYearChange = (event: SelectChangeEvent) => {
        setSelectedYear(event.target.value as string)
    }

    return (
        <Stack alignItems={'center'} height={'100dvh'} justifyContent={'center'} width={'100%'}>
            <Stack
                alignItems={'center'}
                border={'1px solid lightgray'}
                borderRadius={'1rem'}
                p={2}
                spacing={2}
            >
                <Stack alignItems={'center'} direction={'row'} spacing={2}>
                    <FormControl fullWidth sx={{ width: '12rem' }}>
                        <InputLabel id="year-select-label">{t('model.year')}</InputLabel>
                        <Select
                            label="Year"
                            labelId="year-select-label"
                            onChange={handleYearChange}
                            value={selectedYear}
                        >
                            {years.map((y) => (
                                <MenuItem key={y} value={y}>
                                    {y}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Autocomplete
                        getOptionKey={(option) => option.id}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id == value?.id}
                        onChange={(_, newValue) => setSelectedPlayer(newValue)}
                        options={playersInfo}
                        renderInput={(params) => <TextField {...params} label="Choose a player" />}
                        sx={{ width: '12rem' }}
                        value={selectedPlayer}
                    />
                </Stack>
                <Button sx={{ width: '5rem' }} variant={'outlined'}>
                    RUN
                </Button>
            </Stack>
        </Stack>
    )
}
