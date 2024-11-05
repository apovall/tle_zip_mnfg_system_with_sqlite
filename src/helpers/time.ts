
export function parseDatetimeString(dateString: string) {
  const [datePart, timePart] = dateString.split(", ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  const dateObject = new Date(year, month - 1, day, hours, minutes, seconds);

  return dateObject
}