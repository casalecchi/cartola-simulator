import { IconButton, IconButtonProps, SvgIconProps } from '@mui/material'
import { FC } from 'react'
import colors from '../../styles/colors.module.scss'

interface CustomIconButtonProps extends IconButtonProps {
    Icon: FC<SvgIconProps>
    iconColor?: string
    disabled?: boolean
}

export const CustomIconButton: FC<CustomIconButtonProps> = ({
    Icon,
    iconColor,
    disabled,
    ...props
}) => {
    return (
        <IconButton {...props} disabled={disabled}>
            <Icon sx={{ color: iconColor ?? colors.blueBlack, opacity: disabled ? 0.3 : 1 }} />
        </IconButton>
    )
}
