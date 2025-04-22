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
    pl: 2,
    width: '1rem',
}

export const BuilderTable: FC<PropsWithChildren> = ({ children }) => {
    return (
        <TableContainer
            sx={{
                border: '1px solid lightgray',
                borderRadius: '1rem',
                p: 1,
                width: { sm: '100%', md: '30%' },
            }}
        >
            <Table padding={'none'}>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>{t('simulator.mySquad').toUpperCase()}</TableCell>
                        <TableCell align={'right'} sx={{ ...numberCellStyles }}>
                            {t('simulator.price')}
                        </TableCell>
                        <TableCell align={'right'} sx={{ ...numberCellStyles, textWrap: 'wrap' }}>
                            {t('simulator.lastScore')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{children}</TableBody>
            </Table>
        </TableContainer>
    )
}
