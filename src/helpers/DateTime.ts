function timePad(time: number): string {
  return String(time).padStart(2, '0');
}

export function msToTime(s: number, showSeconds: boolean = true) {
  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;

  if (showSeconds) {
    return `${timePad(hrs)}:${timePad(mins)}:${timePad(secs)}`;
  }
  return `${timePad(hrs)}:${timePad(mins)}`;
}
