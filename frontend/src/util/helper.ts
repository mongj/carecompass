export const getRatingColor = (rating: number | undefined) => {
  if (!rating) return "#7D7D7D"; // Default to gray for N/A
  if (rating > 2.5) return "#4CAF50"; // green
  if (rating > 1) return "#F9AF22"; // orange
  return "#DE4B4B"; // red
};
