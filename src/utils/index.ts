const formatDigits = (number: number, count = 2, zero = '0') => (zero + number).slice(-count);

export const msToTime = (s: number) => {
  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;
  const result = `${formatDigits(mins)}:${formatDigits(secs)}.${formatDigits(ms, 3)}`;

  if (hrs > 0) {
    return `${hrs}h ${result}`;
  }

  return result;
}

export const hashCode = (s: string) => {
  return s.split("").reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
}