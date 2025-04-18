import { BuilderFormation, BuilderTeam, Formation } from '../models'

export const EMPTY_TEAM: BuilderTeam = {
    man: [],
    gk: [],
    cb: [],
    wb: [],
    mid: [],
    st: [],
}

export const formationSlots: Record<Formation, BuilderFormation> = {
    343: { man: 1, gk: 1, cb: 3, wb: 0, mid: 4, st: 3 },
    352: { man: 1, gk: 1, cb: 3, wb: 0, mid: 5, st: 2 },
    433: { man: 1, gk: 1, cb: 2, wb: 2, mid: 3, st: 3 },
    442: { man: 1, gk: 1, cb: 2, wb: 2, mid: 4, st: 2 },
    451: { man: 1, gk: 1, cb: 2, wb: 2, mid: 5, st: 1 },
    532: { man: 1, gk: 1, cb: 3, wb: 2, mid: 3, st: 2 },
    541: { man: 1, gk: 1, cb: 3, wb: 2, mid: 4, st: 1 },
}
