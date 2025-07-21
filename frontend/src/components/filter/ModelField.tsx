import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { t } from 'i18next'
import { FC, useEffect } from 'react'
import { FilterState } from '../../hooks/useFilterManager'
import { useGetOptimal } from '../../hooks/useGetOptimal'

interface ModelFieldProps {
    filterStateManager: FilterState
}

export const ModelField: FC<ModelFieldProps> = ({ filterStateManager }) => {
    const { selectedModel, setSelectedModel } = filterStateManager
    const { getOtmOptions, otmOptions } = useGetOptimal()

    const handleModelChange = (event: SelectChangeEvent) => {
        setSelectedModel(event.target.value as string)
    }

    useEffect(() => {
        getOtmOptions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <FormControl fullWidth sx={{ width: '14rem' }}>
            <InputLabel id="model-select-label">{t('model.model')}</InputLabel>
            <Select
                disabled={!filterStateManager.selectedYear}
                label="Model"
                labelId="model-select-label"
                onChange={handleModelChange}
                value={selectedModel}
            >
                {otmOptions.map((y) => (
                    <MenuItem key={y} value={y}>
                        {y}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
