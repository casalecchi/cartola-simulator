import {
    Autocomplete,
    Avatar,
    AvatarProps,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { TranslationKey } from '../../@types/i18n'

interface CustomAutocompleteProps<T> {
    avatarProps?: AvatarProps
    options: T[]
    optionImgUrl: keyof T
    optionKey: keyof T
    optionLabel: keyof T
    selectedOption?: T
    textFieldLabel: TranslationKey
    width?: number | string
    setSelectedOption: (value?: T) => void
}

export const CustomAutocomplete = <T,>({
    avatarProps,
    options,
    optionImgUrl,
    optionKey,
    optionLabel,
    selectedOption,
    textFieldLabel,
    width = '18rem',
    setSelectedOption,
}: CustomAutocompleteProps<T>) => {
    const { t } = useTranslation()

    return (
        <Autocomplete
            getOptionKey={(option) => option[optionKey] as string | number}
            getOptionLabel={(option) => option[optionLabel] as string}
            isOptionEqualToValue={(option, value) => option[optionKey] == value[optionKey]}
            onChange={(_, newValue) => setSelectedOption(newValue ?? undefined)}
            options={options.toSorted((a, b) => (a[optionLabel] > b[optionLabel] ? 1 : -1))}
            sx={{ width }}
            value={selectedOption}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={t(textFieldLabel)}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            startAdornment: selectedOption && (
                                <InputAdornment position="start">
                                    <Avatar
                                        {...avatarProps}
                                        alt={selectedOption[optionLabel] as string}
                                        src={selectedOption[optionImgUrl] as string}
                                        sx={{ ...avatarProps?.sx, width: 24, height: 24 }}
                                    />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            )}
            renderOption={(props, option) => (
                <Stack
                    component="li"
                    {...props}
                    direction={'row'}
                    key={option[optionKey] as string | number}
                    spacing={2}
                >
                    <Avatar
                        {...avatarProps}
                        alt={option[optionLabel] as string}
                        src={option[optionImgUrl] as string}
                    />
                    <Typography>{option[optionLabel] as string}</Typography>
                </Stack>
            )}
        />
    )
}
