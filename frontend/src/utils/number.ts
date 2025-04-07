export const roundNumber = (value: number, decimalPlaces: number = 2) =>
    Math.round(value * 10 ** decimalPlaces) / 10 ** decimalPlaces
