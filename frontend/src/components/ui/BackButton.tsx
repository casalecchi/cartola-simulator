import { ArrowBack } from '@mui/icons-material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomIconButton } from './CustomIconButton'

export const BackButton: FC = () => {
    const to = useNavigate()

    return (
        <CustomIconButton
            Icon={ArrowBack}
            onClick={() => to('/')}
            sx={{ position: 'absolute', top: 30, left: 20 }}
        />
    )
}
