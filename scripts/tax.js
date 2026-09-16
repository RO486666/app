/* ============================================================
   🏛️ ALPHAOS ADVANCED TAX ENGINE (§ 20, § 37 EStG + ARCHIV)
   ============================================================ */

let taxDevOverrideTrades = null;

function getTradesForTax() {
  let trades = [];

  if (taxDevOverrideTrades !== null) {
    trades = taxDevOverrideTrades;
  } else if (typeof journalTrades !== "undefined" && Array.isArray(journalTrades) && journalTrades.length > 0) {
    trades = [...journalTrades];
  } else if (window.ALPHAOS_MT5_FEED && Array.isArray(window.ALPHAOS_MT5_FEED)) {
    trades = [...window.ALPHAOS_MT5_FEED];
  } else {
    const stored = localStorage.getItem("alphaos_journal_trades");
    trades = stored ? JSON.parse(stored) : [];
  }

  // Manuelle Jahres-Reports (HTML Import) als Pseudo-Trades einspeisen
  const manualReports = JSON.parse(localStorage.getItem("alphaos_manual_tax_reports") || "{}");
  Object.values(manualReports).forEach(rep => {
    const midOfYear = new Date(rep.year, 5, 15).getTime();
    if (rep.grossProfits > 0) {
      trades.push({ id: `manual_${rep.year}_win`, timestamp: midOfYear, pnl: rep.grossProfits });
    }
    if (rep.grossLosses > 0) {
      trades.push({ id: `manual_${rep.year}_loss`, timestamp: midOfYear + 1000, pnl: -rep.grossLosses });
    }
  });

  return trades;
}

function getChronologicalYears(allTrades) {
  const yearsSet = new Set();
  allTrades.forEach(t => {
    if (!t.timestamp) return;
    yearsSet.add(new Date(t.timestamp).getFullYear());
  });
  if (yearsSet.size === 0) yearsSet.add(new Date().getFullYear());
  return Array.from(yearsSet).sort((a, b) => a - b);
}

function updateTaxYearDropdown(allTrades) {
  const select = document.getElementById("taxYearSelect");
  if (!select) return;

  const currentSelection = select.value;
  const sortedYearsDesc = [...getChronologicalYears(allTrades)].sort((a, b) => b - a);

  select.innerHTML = "";
  sortedYearsDesc.forEach(y => {
    const opt = document.createElement("option");
    opt.value = y.toString();
    opt.textContent = `Steuerjahr ${y}`;
    select.appendChild(opt);
  });

  const optAll = document.createElement("option");
  optAll.value = "all";
  optAll.textContent = "Gesamte Historie";
  select.appendChild(optAll);

  if (currentSelection && (sortedYearsDesc.includes(Number(currentSelection)) || currentSelection === "all")) {
    select.value = currentSelection;
  } else {
    select.value = sortedYearsDesc[0].toString();
  }
}

/* ============================================================
   🧮 JAHRESWEISE DURCHRECHNUNG (EA-TRADES + HTML-REPORTS VEREINT)
   ============================================================ */
function calculateAllTaxYearsData(allTrades, mitSoli, mitKirche) {
  const manualReports = JSON.parse(localStorage.getItem("alphaos_manual_tax_reports") || "{}");
  const yearsChronological = getChronologicalYears(allTrades);
  const yearsMap = {};
  
  let currentLossPot = 0.0;
  let previousYearPrepayment = 0.0;

  yearsChronological.forEach(year => {
    let grossProfits = 0;
    let grossLosses = 0;
    let tradeCount = 0;

    // 1. Automatische Trades vom EA / Journal / MT5-Feed für dieses Jahr auswerten
    // (Synthetische 'manual_'-Einträge filtern wir hier raus, damit nichts doppelt zählt)
    const liveTradesOfYear = allTrades.filter(t => 
      t.timestamp && 
      new Date(t.timestamp).getFullYear() === year &&
      (!t.id || !t.id.toString().startsWith("manual_"))
    );

    tradeCount += liveTradesOfYear.length;
    liveTradesOfYear.forEach(t => {
      const p = Number(t.pnl || 0);
      if (p > 0) grossProfits += p;
      else if (p < 0) grossLosses += Math.abs(p);
    });

    // 2. Falls für dieses Jahr zusätzlich manuelle/externe HTML-Reports vorliegen: DAZU ADDIEREN
    if (manualReports[year]) {
      const rep = manualReports[year];
      grossProfits += Number(rep.grossProfits || 0);
      grossLosses += Number(rep.grossLosses || 0);
      tradeCount += Number(rep.tradeCount || 0);
    }

    grossProfits = Math.round(grossProfits * 100) / 100;
    grossLosses = Math.round(grossLosses * 100) / 100;
    const netTradingPnL = Math.round((grossProfits - grossLosses) * 100) / 100;

    const lossPotStartOfYear = currentLossPot;
    let taxableBase = 0;
    let lossDeducted = 0;

    if (netTradingPnL > 0) {
      if (currentLossPot > 0) {
        lossDeducted = Math.min(netTradingPnL, currentLossPot);
        currentLossPot -= lossDeducted;
      }
      const pnlAfterLoss = netTradingPnL - lossDeducted;
      taxableBase = Math.max(0, pnlAfterLoss - 1000.00);
    } else {
      currentLossPot += Math.abs(netTradingPnL);
    }

    const kaufstSatz = 0.25;
    const soliSatz = mitSoli ? 0.055 : 0;
    const kistSatz = mitKirche ? 0.09 : 0;
    const divisor = 1 + (kistSatz * 0.25);

    const effKaufst = (taxableBase * kaufstSatz) / divisor;
    const effSoli = (taxableBase * kaufstSatz * soliSatz) / divisor;
    const effKirche = (taxableBase * kaufstSatz * kistSatz) / divisor;
    const actualYearTax = taxableBase > 0 ? (effKaufst + effSoli + effKirche) : 0;

    const taxDifferenceToPaid = actualYearTax - previousYearPrepayment;
    const nextYearAdvance = actualYearTax >= 400.00 ? actualYearTax : 0.00;
    const cashReserveRequired = Math.max(0, taxDifferenceToPaid) + nextYearAdvance;
    const trueFreeNetto = netTradingPnL - cashReserveRequired;

    yearsMap[year] = {
      year,
      tradeCount,
      grossProfits,
      grossLosses,
      netTradingPnL,
      lossPotStartOfYear,
      lossDeducted,
      lossPotEndOfYear: currentLossPot,
      taxableBase,
      effKaufst,
      effSoli,
      effKirche,
      actualYearTax,
      previousYearPrepayment,
      taxDifferenceToPaid,
      nextYearAdvance,
      cashReserveRequired,
      trueFreeNetto
    };

    previousYearPrepayment = nextYearAdvance;
  });

  return { yearsMap, endLossPot: currentLossPot };
}

/* ============================================================
   🖥️ RENDERING CORE: DASHBOARD & ARCHIV
   ============================================================ */
function renderLiveTaxDashboard() {
  const container = document.getElementById("liveTaxReportCard");
  const archiveContainer = document.getElementById("taxHistoryArchiveTable");
  const lossPotValEl = document.getElementById("taxLossPotVal");
  if (!container) return;

  const allTrades = getTradesForTax();
  const yearSelect = document.getElementById("taxYearSelect");

  if (yearSelect && yearSelect.children.length === 0) {
    updateTaxYearDropdown(allTrades);
  }

  const selectedYear = yearSelect ? yearSelect.value : new Date().getFullYear().toString();
  const mitSoli = document.getElementById("taxSoli") ? document.getElementById("taxSoli").checked : true;
  const mitKirche = document.getElementById("taxKirche") ? document.getElementById("taxKirche").checked : false;

  const { yearsMap, endLossPot } = calculateAllTaxYearsData(allTrades, mitSoli, mitKirche);

  const fmt = (v) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v);
  if (lossPotValEl) {
    lossPotValEl.textContent = fmt(endLossPot);
  }

  let d = null;
  if (selectedYear === "all") {
    const allYearsDataValues = Object.values(yearsMap);
    
    let grossProfits = 0;
    let grossLosses = 0;
    let netTradingPnL = 0;
    let tradeCount = 0;
    let totalActualTax = 0;
    let totalTaxableBase = 0;
    let totalLossDeducted = 0;
    let effKaufstSum = 0;
    let effSoliSum = 0;
    let effKircheSum = 0;

    allYearsDataValues.forEach(y => {
      grossProfits += y.grossProfits;
      grossLosses += y.grossLosses;
      netTradingPnL += y.netTradingPnL;
      tradeCount += y.tradeCount;
      totalActualTax += y.actualYearTax;
      totalTaxableBase += y.taxableBase;
      totalLossDeducted += y.lossDeducted;
      effKaufstSum += y.effKaufst;
      effSoliSum += y.effSoli;
      effKircheSum += y.effKirche;
    });

    const trueFreeNettoAll = netTradingPnL - totalActualTax;

    d = {
      year: "Gesamte Historie (Summe aller Jahre)",
      tradeCount,
      grossProfits,
      grossLosses,
      netTradingPnL,
      lossPotStartOfYear: 0,
      lossDeducted: totalLossDeducted,
      lossPotEndOfYear: endLossPot,
      taxableBase: totalTaxableBase,
      effKaufst: effKaufstSum,
      effSoli: effSoliSum,
      effKirche: effKircheSum,
      actualYearTax: totalActualTax,
      previousYearPrepayment: 0,
      taxDifferenceToPaid: 0,
      nextYearAdvance: 0,
      cashReserveRequired: 0,
      trueFreeNetto: trueFreeNettoAll,
      isAllTimeSummary: true
    };
  } else {
    d = yearsMap[selectedYear] || {
      year: selectedYear, tradeCount: 0, grossProfits: 0, grossLosses: 0, netTradingPnL: 0,
      lossPotStartOfYear: 0, lossDeducted: 0, lossPotEndOfYear: 0, taxableBase: 0,
      effKaufst: 0, effSoli: 0, effKirche: 0, actualYearTax: 0,
      previousYearPrepayment: 0, taxDifferenceToPaid: 0, nextYearAdvance: 0, cashReserveRequired: 0, trueFreeNetto: 0
    };
  }

  const devNotice = taxDevOverrideTrades !== null 
    ? `<div class="tax-dev-badge">⚠️ DEV-TEST-MODUS AKTIV (MOCK-DATEN)</div>` 
    : '';

  container.innerHTML = `
    <div class="tax-card">
      ${devNotice}
      
      <div class="tax-kpi-grid">
        <div class="tax-kpi-card">
          <div class="tax-kpi-label">Brutto-Gewinne</div>
          <div class="tax-kpi-val tax-val-win">+${fmt(d.grossProfits)}</div>
        </div>
        <div class="tax-kpi-card">
          <div class="tax-kpi-label">Brutto-Verluste</div>
          <div class="tax-kpi-val tax-val-loss">-${fmt(d.grossLosses)}</div>
        </div>
        <div class="tax-kpi-card">
          <div class="tax-kpi-label">Trading P/L</div>
          <div class="tax-kpi-val ${d.netTradingPnL >= 0 ? 'tax-val-win' : 'tax-val-loss'}">
            ${d.netTradingPnL >= 0 ? '+' : ''}${fmt(d.netTradingPnL)}
          </div>
        </div>
      </div>

      <div class="tax-details-section">
        <div class="tax-detail-row">
          <span class="tax-label-muted">Ausgewertete Positionen:</span>
          <strong>${d.tradeCount} Deals</strong>
        </div>
        ${d.lossDeducted > 0 ? `
        <div class="tax-detail-row tax-val-blue">
          <span>Angerechneter Verlusttopf (§ 20 Abs. 6):</span>
          <strong>-${fmt(d.lossDeducted)}</strong>
        </div>` : ""}
        <div class="tax-detail-row">
          <span class="tax-label-muted">Sparer-Pauschbetrag (§ 20 Abs. 9):</span>
          <span>${d.isAllTimeSummary ? '1.000,00 € pro Jahr (kumuliert)' : '1.000,00 € (steuerfrei)'}</span>
        </div>
        <div class="tax-detail-row">
          <span class="tax-label-muted">Zu versteuernde Basis:</span>
          <strong>${fmt(d.taxableBase)}</strong>
        </div>

        <div class="tax-separator"></div>

        <div class="tax-detail-row">
          <span class="tax-label-muted">Kapitalertragsteuer (25 %):</span>
          <span class="tax-val-loss">${fmt(d.effKaufst)}</span>
        </div>
        ${mitSoli ? `
        <div class="tax-detail-row">
          <span class="tax-label-muted">Solidaritätszuschlag (5.5 %):</span>
          <span class="tax-val-loss">${fmt(d.effSoli)}</span>
        </div>` : ""}
        ${mitKirche ? `
        <div class="tax-detail-row">
          <span class="tax-label-muted">Kirchensteuer:</span>
          <span class="tax-val-loss">${fmt(d.effKirche)}</span>
        </div>` : ""}

        <div class="tax-total-row">
          <strong>Reale Steuerlast für ${d.year}:</strong>
          <strong class="tax-total-val">${fmt(d.actualYearTax)}</strong>
        </div>
      </div>

      ${d.isAllTimeSummary ? `
        <div class="tax-ok-box" style="background: rgba(56, 189, 248, 0.08); border-color: rgba(56, 189, 248, 0.3);">
          <div style="color: #38bdf8; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; font-size: 11px;">
            📊 Historische Gesamt-Zusammenfassung
          </div>
          <div style="color: #cbd5e1; font-size: 11px;">
            Summe aller berechneten Steuerlasten aus allen abgeschlossenen Jahren. Jeder Jahresfreibetrag wurde individuell berücksichtigt.
          </div>
        </div>
      ` : (d.actualYearTax >= 400 ? `
        <div class="tax-warning-box">
          <div class="tax-warning-title">
            <span>⚠️</span> INTELLIGENTE VORAUSZAHLUNG (§ 37 EStG)
          </div>
          <div class="tax-warning-body">
            ${d.previousYearPrepayment > 0 ? `
              • Bereits im Vorjahr angezahlt: <strong class="tax-val-win">${fmt(d.previousYearPrepayment)}</strong><br>
              • Tatsächliche Nachzahlung an FA: <strong class="tax-val-loss">${fmt(Math.max(0, d.taxDifferenceToPaid))}</strong><br>
            ` : ""}
            • <strong>Neue Jahres-Vorauszahlung Folgejahr:</strong> <span class="tax-highlight-orange">${fmt(d.nextYearAdvance)}</span> (4x je ${fmt(d.nextYearAdvance / 4)})<br>
            <div class="tax-buffer-box">
              🛡️ <strong>Sicherheits-Puffer:</strong> Reserviere <strong class="tax-val-loss">${fmt(d.cashReserveRequired)}</strong> auf deinem Bankkonto, um Steuernachzahlung und Folgejahr abzusichern.
            </div>
          </div>
        </div>
      ` : `
        <div class="tax-ok-box">
          🟢 <strong>Keine Vorauszahlungspflicht:</strong> Steuerlast liegt unter der gesetzlichen Schwelle von 400 € (§ 37 Abs. 1 EStG).
        </div>
      `)}

      <div class="tax-net-badge">
        <div>
          <div class="tax-banner-title" style="color: #10b981;">Echtes freies Netto</div>
          <div class="tax-banner-sub">Nach Steuer & Vorauszahlungspuffer</div>
        </div>
        <div class="tax-net-val ${d.trueFreeNetto >= 0 ? 'tax-val-win' : 'tax-val-loss'}">
          ${d.trueFreeNetto >= 0 ? '+' : ''}${fmt(d.trueFreeNetto)}
        </div>
      </div>

    </div>
  `;

  if (archiveContainer) {
    const sortedYearsDesc = [...getChronologicalYears(allTrades)].sort((a, b) => b - a);
    
    let tableHtml = `
      <div class="tax-archive-table-container">
        <table class="tax-archive-table tax-archive-table-desktop">
          <thead>
            <tr>
              <th style="text-align: left;">Jahr</th>
              <th>Trades</th>
              <th>Gewinn (P/L)</th>
              <th>Steuerlast</th>
              <th>Vorauszahlung</th>
              <th>Freies Netto</th>
              <th style="text-align: center;">Aktion</th>
            </tr>
          </thead>
          <tbody>
    `;

    sortedYearsDesc.forEach(yr => {
      const yData = yearsMap[yr];
      if (!yData) return;
      const isSelected = selectedYear === yr.toString();
      tableHtml += `
        <tr class="${isSelected ? 'tax-archive-row-active' : ''}">
          <td style="text-align: left; font-weight: 800; color: #fff;">${yr}</td>
          <td class="tax-label-muted">${yData.tradeCount}</td>
          <td style="font-weight: 700;" class="${yData.netTradingPnL >= 0 ? 'tax-val-win' : 'tax-val-loss'}">
            ${yData.netTradingPnL >= 0 ? '+' : ''}${fmt(yData.netTradingPnL)}
          </td>
          <td class="tax-val-loss">${fmt(yData.actualYearTax)}</td>
          <td class="tax-highlight-orange">${fmt(yData.nextYearAdvance)}</td>
          <td style="font-weight: 800;" class="${yData.trueFreeNetto >= 0 ? 'tax-val-win' : 'tax-val-loss'}">
            ${fmt(yData.trueFreeNetto)}
          </td>
          <td style="text-align: center;">
            <button type="button" onclick="selectYearFromArchive('${yr}')" class="tax-btn-view">
              ${isSelected ? 'Aktiv' : 'Ansehen'}
            </button>
          </td>
        </tr>
      `;
    });
    tableHtml += `</tbody></table></div>`;

    let activeYearData = yearsMap[selectedYear] || yearsMap[sortedYearsDesc[0]];
    let libraryHtml = `<div class="tax-library-mobile"><div class="tax-lib-grid">`;

    sortedYearsDesc.forEach(yr => {
      const yData = yearsMap[yr];
      if (!yData) return;
      const isSelected = selectedYear === yr.toString();
      
      const pnlFormatted = (yData.netTradingPnL >= 0 ? '+' : '') + fmt(yData.netTradingPnL);
      const pnlColorClass = yData.netTradingPnL >= 0 ? 'tax-val-win' : 'tax-val-loss';

      libraryHtml += `
        <div class="tax-lib-item ${isSelected ? 'active' : ''}" onclick="selectYearFromArchive('${yr}')">
          <div class="tax-lib-year">📁 ${yr}</div>
          <div class="tax-lib-sub">${yData.tradeCount} Deals</div>
          <div class="tax-lib-pnl ${pnlColorClass}">${pnlFormatted}</div>
        </div>
      `;
    });

    libraryHtml += `</div>`;

    if (activeYearData) {
      libraryHtml += `
        <div class="tax-lib-details-box">
          <div class="tax-lib-details-header">
            <span>📋 Bescheid-Details Steuerjahr ${activeYearData.year}</span>
            <button type="button" onclick="selectYearFromArchive('${activeYearData.year}')" class="tax-btn-view">Details</button>
          </div>
          <div class="tax-lib-details-row">
            <span class="tax-label-muted">Ausgewertete Deals:</span>
            <strong>${activeYearData.tradeCount}</strong>
          </div>
          <div class="tax-lib-details-row">
            <span class="tax-label-muted">Gewinn (P/L):</span>
            <strong class="${activeYearData.netTradingPnL >= 0 ? 'tax-val-win' : 'tax-val-loss'}">${activeYearData.netTradingPnL >= 0 ? '+' : ''}${fmt(activeYearData.netTradingPnL)}</strong>
          </div>
          <div class="tax-lib-details-row">
            <span class="tax-label-muted">Reale Steuerlast:</span>
            <strong class="tax-val-loss">${fmt(activeYearData.actualYearTax)}</strong>
          </div>
          <div class="tax-lib-details-row">
            <span class="tax-label-muted">Vorauszahlung Folgejahr:</span>
            <strong class="tax-highlight-orange">${fmt(activeYearData.nextYearAdvance)}</strong>
          </div>
          <div class="tax-lib-details-row" style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 6px; padding-top: 6px;">
            <span class="tax-label-muted">Echtes freies Netto:</span>
            <strong class="${activeYearData.trueFreeNetto >= 0 ? 'tax-val-win' : 'tax-val-loss'}">${fmt(activeYearData.trueFreeNetto)}</strong>
          </div>
        </div>
      `;
    }

    libraryHtml += `</div>`;
    archiveContainer.innerHTML = tableHtml + libraryHtml;
  }

  if (typeof updateDevLiveTracker === "function") {
    updateDevLiveTracker(d, selectedYear);
  }
}

window.selectYearFromArchive = function(yearStr) {
  const select = document.getElementById("taxYearSelect");
  if (select) {
    select.value = yearStr;
    renderLiveTaxDashboard();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const allTrades = getTradesForTax();
  updateTaxYearDropdown(allTrades);
  renderLiveTaxDashboard();
  if (typeof injectTaxDevPanel === "function") {
    injectTaxDevPanel();
  }
});


/* ============================================================
   📥 MULTI-ACCOUNT REPORT PARSER (STRIKTE TRENNUNG & AGGREGATION)
   ============================================================ */

window.processUploadedTaxReport = function() {
  const fileInput = document.getElementById("importFileField");
  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Bitte wähle zuerst eine HTML-Report-Datei aus.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const htmlContent = e.target.result;
    parseAndStoreAccountReport(htmlContent, file.name);
  };

  reader.readAsText(file);
};

function parseAndStoreAccountReport(html, fileName) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // 1. Eindeutige Account-Kennung auslesen (damit Konten nicht kollidieren)
  let accountId = fileName;
  const metaStrip = doc.querySelector(".meta-strip");
  if (metaStrip) {
    const match = metaStrip.textContent.match(/Account:\s*([^\s(]+)/i);
    if (match) accountId = match[1].trim();
  }

  const yearSections = doc.querySelectorAll(".year-section");
  if (yearSections.length === 0) {
    alert("⚠️ Konnte keine Jahres-Sektionen in dieser HTML-Datei finden.");
    return;
  }

  const parseGermanFloat = (str) => {
    if (!str) return 0;
    let clean = str.replace(/[^\d,\.-]/g, "").trim();
    if (clean.includes(",") && clean.includes(".")) {
      clean = clean.replace(/\./g, "").replace(",", ".");
    } else if (clean.includes(",")) {
      clean = clean.replace(",", ".");
    }
    return parseFloat(clean) || 0;
  };

  const storedAccounts = JSON.parse(localStorage.getItem("alphaos_multi_accounts") || "{}");
  const accountData = { accountId, years: {} };

  yearSections.forEach(section => {
    const heading = section.querySelector("h2");
    if (!heading) return;

    const yearMatch = heading.textContent.match(/\b(20\d{2})\b/);
    if (!yearMatch) return;

    const year = parseInt(yearMatch[1], 10);
    let grossProfit = 0;
    let grossLoss = 0;
    let netPnL = 0;

    // Echte Deals des Jahres zählen
    const rows = section.querySelectorAll("tbody tr");
    const tradeCount = rows.length;

    // Werte aus der KAP Box lesen
    const summaryDiv = section.querySelector("div[style*='background']");
    if (summaryDiv) {
      const text = summaryDiv.textContent;
      
      const winMatch = text.match(/Brutto-Gewinne:\s*\+?([-\d\.,]+)/i);
      if (winMatch) grossProfit = parseGermanFloat(winMatch[1]);

      const lossMatch = text.match(/Brutto-Verluste:\s*([-\d\.,]+)/i);
      if (lossMatch) grossLoss = Math.abs(parseGermanFloat(lossMatch[1]));

      const netMatch = text.match(/Netto Jahr:\s*([-\d\.,]+)/i);
      if (netMatch) netPnL = parseGermanFloat(netMatch[1]);
    }

    // Fallback auf Footer falls KAP-Box fehlt
    if (netPnL === 0) {
      const tfootCell = section.querySelector("tfoot tr td:last-child");
      if (tfootCell) {
        netPnL = parseGermanFloat(tfootCell.textContent);
      }
    }

    // Der Clou: Brutto-Verluste so anpassen, dass (Brutto-Gewinn - Brutto-Verlust) 
    // exakt auf den Cent dem Nettoergebnis inklusive Kosten/Swap entspricht!
    if (netPnL !== 0) {
      grossLoss = Math.round((grossProfit - netPnL) * 100) / 100;
    }

    accountData.years[year] = {
      grossProfits: Math.round(grossProfit * 100) / 100,
      grossLosses: Math.round(grossLoss * 100) / 100,
      tradeCount: tradeCount
    };
  });

  // Account eindeutig speichern (überschreibt bestehende Daten dieses Kontos, anstatt sie zu verdoppeln)
  storedAccounts[accountId] = accountData;
  localStorage.setItem("alphaos_multi_accounts", JSON.stringify(storedAccounts));

  // Alle Konten aggregieren
  rebuildManualReportsFromMultiAccounts();

  const allTrades = getTradesForTax();
  if (typeof updateTaxYearDropdown === "function") {
    updateTaxYearDropdown(allTrades);
  }

  alert(`✅ Account [${accountId}] erfolgreich synchronisiert!`);
  closeTaxImportModal();
  
  if (typeof renderLiveTaxDashboard === "function") {
    renderLiveTaxDashboard();
  }
}

function rebuildManualReportsFromMultiAccounts() {
  const storedAccounts = JSON.parse(localStorage.getItem("alphaos_multi_accounts") || "{}");
  const aggregatedYears = {};

  Object.values(storedAccounts).forEach(acc => {
    Object.keys(acc.years).forEach(yr => {
      const yData = acc.years[yr];
      if (!aggregatedYears[yr]) {
        aggregatedYears[yr] = {
          year: Number(yr),
          grossProfits: 0,
          grossLosses: 0,
          tradeCount: 0,
          isManualReport: true
        };
      }
      aggregatedYears[yr].grossProfits = Math.round((aggregatedYears[yr].grossProfits + yData.grossProfits) * 100) / 100;
      aggregatedYears[yr].grossLosses = Math.round((aggregatedYears[yr].grossLosses + yData.grossLosses) * 100) / 100;
      aggregatedYears[yr].tradeCount += yData.tradeCount;
    });
  });

  localStorage.setItem("alphaos_manual_tax_reports", JSON.stringify(aggregatedYears));
}

window.clearManualTaxReports = function() {
  localStorage.removeItem("alphaos_multi_accounts");
  localStorage.removeItem("alphaos_manual_tax_reports");
  
  if (typeof taxDevOverrideTrades !== "undefined") {
    taxDevOverrideTrades = null;
  }
  
  const select = document.getElementById("taxYearSelect");
  if (select) {
    select.value = new Date().getFullYear().toString();
  }

  closeTaxImportModal();

  const allTrades = getTradesForTax();
  if (typeof updateTaxYearDropdown === "function") {
    updateTaxYearDropdown(allTrades);
  }
  if (typeof renderLiveTaxDashboard === "function") {
    renderLiveTaxDashboard();
  }

  alert("☢️ Hard Reset erfolgreich! Alle Reports wurden restlos gelöscht.");
};

/* ============================================================
   🔄 AUTOMATISCHER SERVER-SYNC FÜR SMARTPHONE & BUTTON
   ============================================================ */

// 1. Holt die vom EA hochgeladene Datei vom Server ab
async function syncEADataFromServer() {
  try {
    // Hier den Namen der JSON-Datei eintragen, die der EA auf den Server lädt:
    const response = await fetch("journal_import.json?nocache=" + Date.now());
    if (!response.ok) return;

    const data = await response.json();
    const trades = Array.isArray(data) ? data : (data.trades || []);

    if (trades.length > 0) {
      localStorage.setItem("alphaos_journal_trades", JSON.stringify(trades));
      window.ALPHAOS_MT5_FEED = trades;
      console.log(`✅ ${trades.length} Trades automatisch vom Server synchronisiert.`);
    }
  } catch (err) {
    console.log("Server-Sync übersprungen oder keine Datei gefunden:", err);
  }
}

// 2. Erweitert deine renderLiveTaxDashboard-Funktion, sodass sie auch auf dem Handy lädt
const originalRenderDashboard = window.renderLiveTaxDashboard;

window.renderLiveTaxDashboard = async function() {
  // Versuche zuerst die neuen EA-Trades vom Server zu holen
  await syncEADataFromServer();

  // Führe dann die ganz normale Berechnung aus
  if (typeof originalRenderDashboard === "function") {
    originalRenderDashboard();
  }
};

// 3. Beim Starten der Seite auf dem Smartphone sofort einmal abrufen
document.addEventListener("DOMContentLoaded", () => {
  syncEADataFromServer().then(() => {
    if (typeof originalRenderDashboard === "function") {
      originalRenderDashboard();
    }
  });
});

/* ============================================================
   📥 UI-ERWEITERUNG: IMPORT-BUTTON & MODAL
   ============================================================ */

function injectTaxImportUI() {
  const headerControls = document.querySelector(".tax-header-controls");
  if (!headerControls || document.getElementById("taxImportBtn")) return;

  const btn = document.createElement("button");
  btn.id = "taxImportBtn";
  btn.type = "button";
  btn.className = "tax-btn-import-trigger";
  btn.innerHTML = `📥 Report einfügen`;
  btn.onclick = openTaxImportModal;

  headerControls.prepend(btn);
}

function openTaxImportModal() {
  if (document.getElementById("taxImportModal")) return;

  const overlay = document.createElement("div");
  overlay.id = "taxImportModal";
  overlay.className = "tax-modal-overlay";

  overlay.innerHTML = `
    <div class="tax-modal-card" style="max-width: 450px;">
      <div class="tax-modal-header">
        <span>📄 Account-Report (HTML) importieren</span>
        <button type="button" class="tax-modal-close" onclick="closeTaxImportModal()">&times;</button>
      </div>
      <div style="font-size: 11px; color: #8c95a1; margin-bottom: 14px; line-height: 1.5;">
        Wähle die exportierte HTML-Report-Datei deines Accounts aus. Das System erkennt das Konto automatisch und summiert es fehlerfrei über alle Jahre.
      </div>
      <div class="tax-modal-input-group">
        <label>HTML-Report Datei wählen:</label>
        <input type="file" id="importFileField" accept=".html,.htm" class="tax-modal-input" style="padding: 6px; cursor: pointer;" />
      </div>
      <div style="display: flex; gap: 8px; margin-top: 18px;">
        <button type="button" class="tax-dev-btn-gen" onclick="processUploadedTaxReport()" style="flex: 1; padding: 10px;">⚡ Einlesen & Einpflegen</button>
        <button type="button" class="tax-dev-btn-reset" onclick="clearManualTaxReports()" style="padding: 10px;">☢️ Hard Reset & Löschen</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

window.closeTaxImportModal = function() {
  const modal = document.getElementById("taxImportModal");
  if (modal) modal.remove();
};

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(injectTaxImportUI, 200);
});

// Globaler Klick-Handler für den Aktualisieren-Button
window.recalculateTaxDashboard = function() {
  const allTrades = getTradesForTax();
  if (typeof updateTaxYearDropdown === "function") {
    updateTaxYearDropdown(allTrades);
  }
  if (typeof renderLiveTaxDashboard === "function") {
    renderLiveTaxDashboard();
  }
};

// Falls der Button im HTML eine ID hat (z. B. "taxRecalcBtn"):
document.addEventListener("DOMContentLoaded", () => {
  const recalcBtn = document.getElementById("taxRecalcBtn") || 
                    document.querySelector("button[onclick*='STEUERBERECHNUNG']");
  if (recalcBtn) {
    recalcBtn.onclick = window.recalculateTaxDashboard;
  }
});