export function calculateTotalWei(amounts: number, decimals: number = 18 ) {
    return amounts / (10**decimals)
}