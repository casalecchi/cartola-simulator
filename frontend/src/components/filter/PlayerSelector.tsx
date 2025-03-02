import { Autocomplete, Avatar, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { FC, useEffect } from 'react'
import { FilterState } from '../../hooks/useFilterStatemanager'
import { useGetPlayersFromYear } from '../../hooks/useGetPlayersFromYear'

interface PlayerSelectorProps {
    filterStateManager: FilterState
}

export const PlayerSelector: FC<PlayerSelectorProps> = ({ filterStateManager }) => {
    const { selectedPlayer, selectedYear, setSelectedPlayer } = filterStateManager
    const { fetchPlayersInfo, playersInfo } = useGetPlayersFromYear()

    useEffect(() => {
        if (selectedYear != '') fetchPlayersInfo(Number(selectedYear))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear])

    return (
        <Autocomplete
            getOptionKey={(option) => option.id}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id == value?.id}
            onChange={(_, newValue) => setSelectedPlayer(newValue ?? undefined)}
            options={playersInfo.toSorted((a, b) => (a.name > b.name ? 1 : -1))}
            sx={{ width: '20rem' }}
            value={selectedPlayer}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={'Choose a player'}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            startAdornment: selectedPlayer ? (
                                <InputAdornment position="start">
                                    <Avatar
                                        alt={selectedPlayer.name}
                                        src={selectedPlayer.photoUrl}
                                        sx={{ width: 24, height: 24 }}
                                    />
                                </InputAdornment>
                            ) : null,
                        },
                    }}
                />
            )}
            renderOption={(props, option) => (
                <Stack component="li" {...props} direction={'row'} key={option.id} spacing={2}>
                    <Avatar alt={option.name} src={option.photoUrl} />
                    <Typography>{option.name}</Typography>
                </Stack>
            )}
        />
    )
}
