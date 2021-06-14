const AN_HOUR = 60 * 60 * 1000;

export async function getExchanges() {
  if (
    !global.exchange ||
    !global.exchange.lastUpdate ||
    global.exchange.lastUpdate - Date.now() > AN_HOUR
  ) {
    console.log("Fetching rates");

    const res = await fetch("http://www.floatrates.com/daily/eur.json");
    const json = await res.json();
    if (json.usd && json.usd.rate) {
      global.exchange = {
        usd: { ...json.usd, date: json.usd.date.replace(/ \d+:\d+:\d+.*/, "") },
        lastUpdate: Date.now(),
      };
    }
    console.log("Current USD rate is:", global.exchange.usd.rate);
  }
  return global.exchange;
}
