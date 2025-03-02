export const generateTickPositions = (min: number, max: number) => {
    const ticks = []
    for (let i = min; i <= max; i++) {
        ticks.push(i)
    }
    return ticks
}
