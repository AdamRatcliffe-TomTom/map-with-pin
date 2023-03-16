export default function formatDuration(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0 && minutes === 0 && seconds > 0) {
    minutes = 1;
  }

  let duration = "";

  if (hours > 0) {
    duration += `${hours} hr`;
  }

  duration += hours > 0 && minutes < 10 ? `0${minutes} min` : `${minutes} min`;

  return duration;
}
