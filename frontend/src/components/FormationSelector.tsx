import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { FC } from 'react'
import { Formation } from '../models'

interface FormationSelectorProps {
    value: Formation
    setValue: (value: Formation) => void
}

export const FormationSelector: FC<FormationSelectorProps> = ({ value, setValue }) => {
    const handleChange = (event: SelectChangeEvent) => {
        setValue(event.target.value as Formation)
    }

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} variant="standard">
            <InputLabel id="demo-simple-select-standard-label">Age</InputLabel>
            <Select
                id="demo-simple-select-standard"
                label="Age"
                labelId="demo-simple-select-standard-label"
                onChange={handleChange}
                value={value}
            >
                <MenuItem value={'343'}>3-4-3</MenuItem>
                <MenuItem value={'352'}>3-5-2</MenuItem>
                <MenuItem value={'433'}>4-3-3</MenuItem>
                <MenuItem value={'442'}>4-4-2</MenuItem>
                <MenuItem value={'451'}>4-5-1</MenuItem>
                <MenuItem value={'532'}>5-3-2</MenuItem>
                <MenuItem value={'541'}>5-4-1</MenuItem>
            </Select>
        </FormControl>
    )
}
