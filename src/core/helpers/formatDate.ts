import { formatDistanceToNow } from "date-fns";

// Format date safely
export const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error("Invalid date:", dateString);
    return "Invalid date";
  }

  return formatDistanceToNow(date, { addSuffix: true });
};
