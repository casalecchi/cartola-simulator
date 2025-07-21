import { FC, useEffect, useMemo } from 'react'
import { useDataContext } from '../../contexts/DataContext'
import { FilterState } from '../../hooks/useFilterManager'
import { useGetPlayersFromYear } from '../../hooks/useGetPlayersFromYear'
import { Model } from '../../models'
import { CustomAutocomplete } from '../ui/CustomAutocomplete'

interface PlayerFieldProps {
    filterStateManager: FilterState
    model: Model
}

export const PlayerField: FC<PlayerFieldProps> = ({ filterStateManager, model }) => {
    const { timeseriesManager } = useDataContext()
    const { resetAllTimeseries } = timeseriesManager
    const { selectedPlayer, selectedTeam, selectedYear, setSelectedPlayer } = filterStateManager
    const { fetchPlayersInfo, playersInfo } = useGetPlayersFromYear()

    const players = useMemo(() => {
        if (model == 'lstm') {
            return playersInfo.filter((p) => p.validLSTMValues > 10)
        }
        return playersInfo
    }, [model, playersInfo])

    useEffect(() => {
        if (selectedYear != '') fetchPlayersInfo(Number(selectedYear))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear])

    useEffect(() => {
        if (!selectedPlayer) resetAllTimeseries()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPlayer])

    return (
        <CustomAutocomplete
            optionImgUrl={'photoUrl'}
            optionKey={'id'}
            optionLabel={'name'}
            options={selectedTeam ? players.filter((p) => p.teamId === selectedTeam.id) : players}
            selectedOption={selectedPlayer}
            setSelectedOption={setSelectedPlayer}
            textFieldLabel={'filter.playerField'}
        />
    )
}
