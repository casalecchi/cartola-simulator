import { FC, useEffect } from 'react'
import { FilterState } from '../../hooks/useFilterStateManager'
import { useGetPlayersFromYear } from '../../hooks/useGetPlayersFromYear'
import { CustomAutocomplete } from '../ui/CustomAutocomplete'

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
        <CustomAutocomplete
            optionImgUrl={'photoUrl'}
            optionKey={'id'}
            optionLabel={'name'}
            options={playersInfo}
            selectedOption={selectedPlayer}
            setSelectedOption={setSelectedPlayer}
            textFieldLabel={'filter.teamTitle'}
        />
    )
}
