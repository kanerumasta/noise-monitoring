export const getTierLevel = (soundLevel: number) => {
  return soundLevel >= 101
    ? "Tier 3"
    : soundLevel >= 86
    ? "Tier 2"
    : soundLevel >= 71
    ? "Tier 1"
    : "Normal";
};

export const getFormattedTime = (rawTimestamp: number) => {
  const timestamp = new Date(rawTimestamp);
  const timeString = timestamp.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return timeString;
};
export const getFormattedDate = (rawTimestamp: number) => {
  const timestamp = new Date(rawTimestamp);
  const dateString = timestamp.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short", // e.g. "Jun"
    day: "numeric",
  });
  return dateString;
};

export const isOlderThan5Minutes = (timestamp: number) => {
  const now = Date.now(); // current time in milliseconds
  const diff = now - timestamp; // time difference in ms
  return diff > 5 * 60 * 1000; // 30 minutes in ms
};

export const timeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp; // difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "yesterday";
  return `${days} days ago`;
};

// Node mapping from node_id to node_name
const NODE_MAPPING: Record<string, string> = {
  node_1: "Filter Site Node 1",
  node_2: "Filter Site Node 2",
  node_3: "Filter Site Node 3",
  node_4: "Sitio Tahna Node 1",
  node_5: "Sitio Tahna Node 2",
  node_6: "Sitio Tahna Node 3",
  node_7: "San Miguel Node 1",
  node_8: "San Miguel Node 2",
  node_9: "San Miguel Node 3",
};

// Function to get node name from node ID
export function getNodeName(nodeId: string): string {
  return NODE_MAPPING[nodeId] || nodeId;
}
