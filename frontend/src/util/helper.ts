export const getRatingColor = (rating: number | undefined) => {
  if (!rating) return "#7D7D7D"; // Default to gray for N/A
  if (rating > 3) return "green"; // green
  if (rating > 2) return "orange"; // orange
  return "red"; // red
};
