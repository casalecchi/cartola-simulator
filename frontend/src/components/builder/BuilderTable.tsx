import {
    Button,
    Paper,
    Stack,
    SxProps,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import { t } from 'i18next'
import { FC, PropsWithChildren } from 'react'
import { BuilderState } from '../../hooks/useBuilderStateManager'
import colors from '../../styles/colors.module.scss'
import { FormationSelector } from '../FormationSelector'

const numberCellStyles: SxProps = {
    alignContent: 'end',
    lineHeight: '1.2rem',
    pl: 2,
    width: '1rem',
}

export const cellStyles: SxProps = { borderColor: colors.coolGray }

interface BuilderTableProps extends PropsWithChildren {
    manager: BuilderState
}

export const BuilderTable: FC<BuilderTableProps> = ({ children, manager }) => {
    const { formation, changeFormation } = manager
    return (
        <TableContainer
            component={Paper}
            sx={{
                px: 1,
                opacity: 0.95,
            }}
        >
            <Table padding={'none'}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={cellStyles}></TableCell>
                        <TableCell sx={cellStyles}>
                            <Stack alignItems={'center'} direction={'row'} py={0.5} spacing={3}>
                                <Typography>{t('simulator.mySquad').toUpperCase()}</Typography>
                                <FormationSelector setValue={changeFormation} value={formation} />
                                <Button onClick={manager.resetTeam}>
                                    {t('simulator.sellAll')}
                                </Button>
                            </Stack>
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
