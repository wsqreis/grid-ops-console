export const formatKw = (value: number) =>
  new Intl.NumberFormat("en-IE", {
    maximumFractionDigits: 0,
  }).format(value);

export const formatTimeAgo = (isoDate: string, now = new Date()) => {
  const elapsedSeconds = Math.max(
    0,
    Math.round((now.getTime() - new Date(isoDate).getTime()) / 1000),
  );

  if (elapsedSeconds < 60) {
    return `${elapsedSeconds}s ago`;
  }

  const elapsedMinutes = Math.round(elapsedSeconds / 60);
  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}m ago`;
  }

  return `${Math.round(elapsedMinutes / 60)}h ago`;
};

