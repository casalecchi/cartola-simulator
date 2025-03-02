import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { t } from 'i18next'
import { FC, useEffect } from 'react'
import { FilterState } from '../../hooks/useFilterStateManager'
import { useGetDataYears } from '../../hooks/useGetYears'

interface YearSelectorProps {
    filterStateManager: FilterState
}

export const YearSelector: FC<YearSelectorProps> = ({ filterStateManager }) => {
    const { selectedYear, setSelectedYear } = filterStateManager
    const { getDataYears, years } = useGetDataYears()

    const handleYearChange = (event: SelectChangeEvent) => {
        setSelectedYear(event.target.value as string)
    }

    useEffect(() => {
        getDataYears()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
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
    )
}
