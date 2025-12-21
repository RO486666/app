


  const ticker = document.getElementById("tickerContent");
  const focusPairsByDay = {
    0: [ "BTC/USD", "ETH/USD", "SOL/USD", "XRP/USD", "LTC/USD", "ADA/USD", "BCH/USD", "XAU/USD", "XAG/USD", "XPT/USD", "XPD/USD", "COPPER/USD", "ALUMINIUM/USD", "US30", "NAS100", "SPX500", "GER40", "UK100" ],
    1: [ "EUR/USD", "GBP/USD", "AUD/USD", "NZD/USD", "USD/CHF", "USD/CAD", "EUR/JPY", "GBP/JPY", "CHF/JPY", "AUD/JPY", "CAD/JPY", "EUR/GBP", "XAU/USD", "XAG/USD", "BTC/USD", "ETH/USD" ],
    2: [ "USD/JPY", "EUR/JPY", "GBP/JPY", "CHF/JPY", "AUD/JPY", "NZD/JPY", "CAD/JPY", "BTC/USD", "ETH/USD", "SOL/USD", "XRP/USD" ],
    3: [ "US30", "NAS100", "SPX500", "GER40", "UK100", "EUR/GBP", "EUR/AUD", "EUR/CAD", "GBP/AUD", "GBP/CAD", "AUD/CAD" ],
    4: [ "GBP/USD", "GBP/JPY", "GBP/AUD", "GBP/CAD", "XAU/USD", "XAG/USD", "WTI/USD", "BRENT/USD", "NATGAS/USD" ],
    5: [ "XAU/USD", "XAG/USD", "BTC/USD", "ETH/USD", "US30", "NAS100", "SPX500" ],
    6: [ "ETH/USD", "SOL/USD", "XRP/USD", "BTC/USD", "LTC/USD", "ADA/USD" ]
  };

  // Zeiten in ms
  const enterDuration = 5000; // 5 Sekunden reinfahren
  const stayDuration = 40000; // 40 Sekunden Pause
  const exitDuration = 5000;  // 5 Sekunden rausfahren

  function animateTicker() {
    const now = new Date();
    const day = now.getDay();
    const pairs = focusPairsByDay[day] || [];
    ticker.textContent = pairs.join("  |  ") + "  |  ";

    // 1. Starte rechts außerhalb (left: 100%)
    ticker.style.transition = "none";
    ticker.style.left = "100%";

    // 2. Nach kurzem Timeout reinfahren (left: 0%) mit Transition
    setTimeout(() => {
      ticker.style.transition = `left ${enterDuration}ms linear`;
      ticker.style.left = "0%";
    }, 50);

    // 3. Nach reinfahren die Transition ausschalten für Pause (damit bleibt es an 0%)
    setTimeout(() => {
      ticker.style.transition = "none";
      ticker.style.left = "0%";
    }, enterDuration + 60); // kleine Verzögerung nach Ende reinfahren

    // 4. Nach Pause rausfahren
    setTimeout(() => {
      // Jetzt wieder Transition an, um rauszufahren
      // WICHTIG: Transition nur aktivieren, wenn left anders als -100% ist (sonst springt er evtl)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ticker.style.transition = `left ${exitDuration}ms linear`;
          ticker.style.left = "-100%";
        });
      });
    }, enterDuration + stayDuration + 60);

    // 5. Loop restart
    setTimeout(() => {
      animateTicker();
    }, enterDuration + stayDuration + exitDuration + 150);
  }

  document.addEventListener("DOMContentLoaded", animateTicker);