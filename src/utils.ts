export function areEqual(a: string, b: string, c: string) {
    return a === b && b === c && a !== '';
}

export function isPlayerX(player: string) {
    return player === 'X';
}
