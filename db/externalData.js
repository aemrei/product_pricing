export async function getExchangeRates() {
  const res = await fetch("http://www.floatrates.com/daily/eur.json");
  const json = await res.json();
  return Object.values(json).map(v => ({
    ...v,
    date: v.date.replace(/ \d+:\d+:\d+.*/,""),
  }));
}