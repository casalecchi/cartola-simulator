import { FC, useEffect } from 'react'
import { FilterState } from '../../hooks/useFilterStateManager'
import { useGetTeams } from '../../hooks/useGetTeams'
import { CustomAutocomplete } from '../ui/CustomAutocomplete'

interface TeamSelectorProps {
    filterStateManager: FilterState
}

export const TeamSelector: FC<TeamSelectorProps> = ({ filterStateManager }) => {
    const { selectedTeam, selectedYear, setSelectedTeam } = filterStateManager
    const { getTeamsInfo, teamsInfo } = useGetTeams()

    useEffect(() => {
        if (selectedYear != '') getTeamsInfo(Number(selectedYear))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear])

    return (
        <CustomAutocomplete
            avatarProps={{ variant: 'square' }}
            optionImgUrl={'photoUrl'}
            optionKey={'id'}
            optionLabel={'name'}
            options={teamsInfo}
            selectedOption={selectedTeam}
            setSelectedOption={setSelectedTeam}
            textFieldLabel={'filter.teamTitle'}
            width={'14rem'}
        />
    )
}
