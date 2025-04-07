import { IconButton, IconButtonProps, SvgIconProps } from '@mui/material'
import { FC } from 'react'
import colors from '../../styles/colors.module.scss'

interface CustomIconButtonProps extends IconButtonProps {
    Icon: FC<SvgIconProps>
    disabled?: boolean
}

export const CustomIconButton: FC<CustomIconButtonProps> = ({ Icon, disabled, ...props }) => {
    return (
        <IconButton {...props} disabled={disabled}>
            <Icon sx={{ color: colors.info, opacity: disabled ? 0.3 : 1 }} />
        </IconButton>
    )
}
