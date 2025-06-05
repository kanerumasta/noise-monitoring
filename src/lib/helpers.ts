export const getTierLevel = (soundLevel:number) => {
   return soundLevel > 101 ? "Tier 3" : soundLevel > 86 ? "Tier 2" : soundLevel > 70 ? "Tier 1" : "Normal"
}

export const getFormattedTime = (rawTimestamp:number) => {
const timestamp = new Date(rawTimestamp)
  const timeString = timestamp.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  return timeString
}
export const getFormattedDate = (rawTimestamp:number) => {
const timestamp = new Date(rawTimestamp)
const dateString = timestamp.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short', // e.g. "Jun"
  day: 'numeric'
});
return dateString
}

export const isOlderThan30Minutes = (timestamp: number) => {
  const now = Date.now(); // current time in milliseconds
  const diff = now - timestamp; // time difference in ms
  return diff > 30 * 60 * 1000; // 30 minutes in ms
}

export const timeAgo = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp // difference in milliseconds

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}
