export default function formatDateTimeToIndo(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return "-";

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${formattedDate}, ${formattedTime}`;
}
