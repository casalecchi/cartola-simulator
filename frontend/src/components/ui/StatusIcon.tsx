import { Check, Healing, QuestionMark } from '@mui/icons-material'
import { Box } from '@mui/material'
import { FC } from 'react'
import redCard from '../../assets/red-card.svg'
import { Status } from '../../models'

const sizeStyle = {
    height: 30,
    width: 30,
}

interface StatusIconProps {
    status: Status
}

export const StatusIcon: FC<StatusIconProps> = ({ status }) => {
    switch (status) {
        case 'doubt':
            return <QuestionMark sx={{ color: 'orange', ...sizeStyle }} />
        case 'suspended':
            return <img src={redCard} />
        case 'injury':
            return <Healing sx={{ color: 'red', ...sizeStyle }} />
        case 'null':
            return <Box sx={sizeStyle}></Box>
        case 'probable':
            return <Check sx={{ color: 'green', ...sizeStyle }} />
    }
}
