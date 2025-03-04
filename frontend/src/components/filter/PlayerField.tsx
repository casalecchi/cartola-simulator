import { FC, useEffect } from 'react'
import { FilterState } from '../../hooks/useFilterStateManager'
import { useGetPlayersFromYear } from '../../hooks/useGetPlayersFromYear'
import { CustomAutocomplete } from '../ui/CustomAutocomplete'

interface PlayerFieldProps {
    filterStateManager: FilterState
}

export const PlayerField: FC<PlayerFieldProps> = ({ filterStateManager }) => {
    const { selectedPlayer, selectedTeam, selectedYear, setSelectedPlayer } = filterStateManager
    const { fetchPlayersInfo, playersInfo } = useGetPlayersFromYear()

    useEffect(() => {
        if (selectedYear != '') fetchPlayersInfo(Number(selectedYear))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear])

    return (
        <CustomAutocomplete
            optionImgUrl={'photoUrl'}
            optionKey={'id'}
            optionLabel={'name'}
            selectedOption={selectedPlayer}
            setSelectedOption={setSelectedPlayer}
            textFieldLabel={'filter.playerField'}
            options={
                selectedTeam ? playersInfo.filter((p) => p.teamId === selectedTeam.id) : playersInfo
            }
        />
    )
}
