import {
    Paper,
    SxProps,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import { t } from 'i18next'
import { FC, PropsWithChildren } from 'react'
import colors from '../../styles/colors.module.scss'

const numberCellStyles: SxProps = {
    alignContent: 'end',
    lineHeight: '1.2rem',
    pl: 2,
    width: '1rem',
}

export const cellStyles: SxProps = { borderColor: colors.coolGray }

export const BuilderTable: FC<PropsWithChildren> = ({ children }) => {
    return (
        <TableContainer
            component={Paper}
            sx={{
                border: `1px solid ${colors.coolGray}`,
                p: 1,
                opacity: 0.95,
                width: { sm: '100%', md: '33%' },
            }}
        >
            <Table padding={'none'}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={cellStyles}></TableCell>
                        <TableCell sx={cellStyles}>
                            {t('simulator.mySquad').toUpperCase()}
                        </TableCell>
                        <TableCell align={'right'} sx={{ ...numberCellStyles, ...cellStyles }}>
                            {t('simulator.price')}
                        </TableCell>
                        <TableCell
                            align={'right'}
                            sx={{ ...numberCellStyles, textWrap: 'wrap', ...cellStyles }}
                        >
                            {t('simulator.lastScore')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{children}</TableBody>
            </Table>
        </TableContainer>
    )
}
