import { Check, Healing, QuestionMark } from '@mui/icons-material'
import { FC } from 'react'
import redCard from '../../assets/red-card.svg'
import { Status } from '../../models'

interface StatusIconProps {
    status: Status
}

const StatusIcon: FC<StatusIconProps> = ({ status }) => {
    switch (status) {
        case 'doubt':
            return <QuestionMark sx={{ color: 'orange' }} />
        case 'suspended':
            return <img src={redCard} />
        case 'injury':
            return <Healing sx={{ color: 'red' }} />
        case 'null':
            return <></>
        case 'probable':
            return <Check sx={{ color: 'green' }} />
    }
}

export default StatusIcon
