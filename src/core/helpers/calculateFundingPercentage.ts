
// Calculate funding percentage

export const calculateFundingPercentage = (received: number, goal: number) => {
    const percentage = (received / goal) * 100
    return Math.min(percentage, 100) // Cap at 100%
}