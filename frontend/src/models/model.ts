export type Model = 'arima' | 'lstm'

export interface ArimaOptions {
    autoarima: boolean
    d: number
    p: number
    q: number
}

export interface LSTMOptions {
    nSteps: number
    epochs: number
    u1: number
    u2: number
}
