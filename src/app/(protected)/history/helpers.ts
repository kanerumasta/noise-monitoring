
// Function to determine noise level color coding based on tier system
export const getNoiseLevelStyle = (noiseLevel: string) => {
  switch (noiseLevel) {
    case "Tier 3":
      return { bg: "bg-red-100 border border-red-800", text: "text-red-800" };
    case "Tier 2":
      return {
        bg: "bg-orange-100 border border-orange-800",
        text: "text-orange-800",
      };
    case "Tier 1":
      return {
        bg: "bg-yellow-100 border border-yellow-800",
        text: "text-yellow-800",
      };
    default:
      return {
        bg: "bg-green-100 border border-green-800",
        text: "text-green-800",
      };
  }
};


export const formatDuration = (milliseconds: number) => {
    const seconds = milliseconds / 1000
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.ceil(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  if (minutes > 0) {
    return remainingSeconds > 2 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  return `${remainingSeconds}s`;
};
