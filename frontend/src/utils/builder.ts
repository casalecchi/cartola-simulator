import { BuilderFormation, BuilderTeam, Formation, Status } from '../models'
import colors from '../styles/colors.module.scss'

export const getEmptyTeam = (): BuilderTeam => ({
    man: [],
    gk: [],
    cb: [],
    wb: [],
    mid: [],
    st: [],
})

export const formationSlots: Record<Formation, BuilderFormation> = {
    343: { man: 1, gk: 1, cb: 3, wb: 0, mid: 4, st: 3 },
    352: { man: 1, gk: 1, cb: 3, wb: 0, mid: 5, st: 2 },
    433: { man: 1, gk: 1, cb: 2, wb: 2, mid: 3, st: 3 },
    442: { man: 1, gk: 1, cb: 2, wb: 2, mid: 4, st: 2 },
    451: { man: 1, gk: 1, cb: 2, wb: 2, mid: 5, st: 1 },
    532: { man: 1, gk: 1, cb: 3, wb: 2, mid: 3, st: 2 },
    541: { man: 1, gk: 1, cb: 3, wb: 2, mid: 4, st: 1 },
}

export const statusColors: Record<Status, string> = {
    doubt: 'yellow',
    suspended: 'red',
    injury: 'red',
    null: 'gray',
    probable: colors.lightGreen,
}
