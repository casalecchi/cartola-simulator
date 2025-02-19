import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useDataContext } from '../contexts/DataContext'

export const Api: FC = () => {
    const { t } = useTranslation()
    const { apiStateManager } = useDataContext()
    const { selectedYear, setSelectedYear, years } = apiStateManager

    const handleYearChange = (event: SelectChangeEvent) => {
        setSelectedYear(event.target.value as string)
    }

    return (
        <Stack alignItems={'center'} height={'100dvh'} justifyContent={'center'} width={'100%'}>
            <Stack alignItems={'center'} direction={'row'}>
                <Stack
                    alignItems={'center'}
                    border={'1px solid lightgray'}
                    borderRadius={'1rem'}
                    p={2}
                    width={'12rem'}
                >
                    <FormControl fullWidth>
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
                </Stack>
            </Stack>
        </Stack>
    )
}
