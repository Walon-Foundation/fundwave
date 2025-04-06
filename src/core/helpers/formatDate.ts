import { formatDistanceToNow } from "date-fns"

// Format date
export const formatDate = (dateString: string) => {
    try {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (e) {
        console.error(e)
        return dateString
    }
}