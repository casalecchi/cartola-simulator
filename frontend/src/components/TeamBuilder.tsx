import {
    Stack,
    SxProps,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetPlayersFromYear } from '../hooks/useGetPlayersFromYear'
import { Formation } from '../models'
import { formationSlots } from '../utils'
import { FormationSelector } from './FormationSelector'

const numberCellStyles: SxProps = {
    px: 1,
}

interface TeamBuilderProps {
    year?: number
}

export const TeamBuilder: FC<TeamBuilderProps> = ({ year }) => {
    const { t } = useTranslation()
    const [formation, setFormation] = useState<Formation>('433')
    const { fetchPlayersInfo } = useGetPlayersFromYear()

    useEffect(() => {
        if (!year) return
        fetchPlayersInfo(year)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year])

    return (
        <Stack border={'1px solid red'} flex={1}>
            <FormationSelector setValue={setFormation} value={formation} />
            <TableContainer sx={{ display: 'inline-block' }}>
                <Table padding={'none'}>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell align={'right'} sx={{ ...numberCellStyles }}>
                                {t('common.prediction')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.from({ length: formationSlots[formation].man }).map((i) => (
                            <TableRow key={`${'man'}${i}`}>
                                <TableCell>{'man'.toUpperCase()}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))}
                        {Array.from({ length: formationSlots[formation].gk }).map((i) => (
                            <TableRow key={`${'gk'}${i}`}>
                                <TableCell>{'gk'.toUpperCase()}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))}
                        {Array.from({ length: formationSlots[formation].cb }).map((i) => (
                            <TableRow key={`${'cb'}${i}`}>
                                <TableCell>{'cb'.toUpperCase()}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))}
                        {Array.from({ length: formationSlots[formation].wb }).map((i) => (
                            <TableRow key={`${'wb'}${i}`}>
                                <TableCell>{'wb'.toUpperCase()}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))}
                        {Array.from({ length: formationSlots[formation].mid }).map((i) => (
                            <TableRow key={`${'mid'}${i}`}>
                                <TableCell>{'mid'.toUpperCase()}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))}
                        {Array.from({ length: formationSlots[formation].st }).map((i) => (
                            <TableRow key={`${'st'}${i}`}>
                                <TableCell>{'st'.toUpperCase()}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell>{t('common.total')}</TableCell>
                            <TableCell></TableCell>
                            <TableCell align={'right'} sx={{ py: 1, ...numberCellStyles }}>
                                {0}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    )
}
