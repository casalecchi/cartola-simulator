import { Home } from '@mui/icons-material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import colors from '../../styles/colors.module.scss'
import { CustomIconButton } from './CustomIconButton'

interface HomeButtonProps {
    topLeft?: boolean
}

export const HomeButton: FC<HomeButtonProps> = ({ topLeft }) => {
    const to = useNavigate()

    return (
        <CustomIconButton
            Icon={Home}
            iconColor={colors.darkGreen}
            onClick={() => to('/')}
            {...(topLeft && { sx: { position: 'absolute', top: 30, left: 20 } })}
        />
    )
}
