import {
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

const numberCellStyles: SxProps = {
    alignContent: 'end',
    lineHeight: '1.2rem',
    px: 1,
    textAlign: 'center',
    width: '1rem',
}

export const BuilderTable: FC<PropsWithChildren> = ({ children }) => {
    return (
        <TableContainer sx={{ display: 'inline-block' }}>
            <Table padding={'none'}>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell align={'right'} sx={{ ...numberCellStyles }}>
                            {t('simulator.price')}
                        </TableCell>
                        <TableCell align={'right'} sx={{ ...numberCellStyles, textWrap: 'wrap' }}>
                            {t('simulator.lastScore')}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{children}</TableBody>
            </Table>
        </TableContainer>
    )
}
