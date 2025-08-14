export function FormatPrice(value) {
  if (value >= 10000000) {
    return (value / 10000000).toFixed(1).replace(/\.0$/, "") + "Cr";
  } else if (value >= 100000) {
    return (value / 100000).toFixed(1).replace(/\.0$/, "") + "Lac";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return value.toString();
  }
}
