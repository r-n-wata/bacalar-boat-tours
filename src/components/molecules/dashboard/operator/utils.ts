export function calculateEndTime(
  startTime: string,
  durationHours: number
): string {
  const [startHour, startMinute] = startTime.split(":").map(Number);

  const startDate = new Date();
  startDate.setHours(startHour);
  startDate.setMinutes(startMinute);

  const endDate = new Date(
    startDate.getTime() + durationHours * 60 * 60 * 1000
  );

  const endHours = String(endDate.getHours()).padStart(2, "0");
  const endMinutes = String(endDate.getMinutes()).padStart(2, "0");

  return `${endHours}:${endMinutes}`;
}
