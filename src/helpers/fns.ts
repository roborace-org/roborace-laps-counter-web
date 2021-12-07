export const msToTime = (s: number): string => {
  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;

  const result = `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}.${ms.toString().substring(0, 1).padStart(1, "0")}`;

  if (hrs > 0) {
    return `${hrs}h ${result}`;
  }

  return result;
};

export const getColorsByPlace = (place: number) => {
  let color = "#9D9D9D";
  let bgColor = "#F3F3F3";

  switch (place) {
    case 1: {
      color = "#AC8E33";
      bgColor = "#F6DB7B";
      break;
    }
    case 2: {
      color = "#727477";
      bgColor = "#B3B6BA";
      break;
    }
    case 3: {
      color = "#8A622E";
      bgColor = "#BD9763";
      break;
    }
  }
  return { color, bgColor };
};

export const hashCode = (s: string) => {
  return s.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
};
