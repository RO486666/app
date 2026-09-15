// ============================================================
// 📊 ALPHAOS APEX TRADING JOURNAL ENGINE – MODAL EDITION
// ============================================================

let journalTrades = [];
let chartInstances = {};
let currentCalendarDate = new Date(2026, 6, 1); // Startet im Juli 2026
let selectedFilterDateStr = null;
let activeTimezone = 'local'; // 'local', 'EST', 'UTC'

// Temporärer Speicher für Base64-Strings während des Formular-Ausfüllens
let currentUploadedImages = [];

const APEX_COLORS = {
  primary: "#6d28d9",
  primaryGlow: "rgba(109, 40, 217, 0.4)",
  win: "#10b981",
  winGlow: "rgba(16, 185, 129, 0.5)",
  loss: "#f43f5e",
  lossGlow: "rgba(244, 63, 94, 0.5)",
  bg: "#0d0d12",
  textMuted: "#94a3b8",
  grid: "rgba(255, 255, 255, 0.05)"
};

document.addEventListener("DOMContentLoaded", () => {
  loadJournalData();
  initCalendar();
  updateYearHeatmap();
  initJournalPairsAutocomplete();
});

/* ============================================================
   ⏱️ ERWEITERTE SESSION-ERKENNUNG (INKL. OVERLAP-PHASE)
   ============================================================ */
function detectSessionFromTimestamp(timestamp) {
  const d = new Date(timestamp);
  const hour = d.getHours();
  const minute = d.getMinutes();
  const timeVal = hour + minute / 60;

  // 14:30 bis 17:00 Uhr -> Overlap: Frankfurt/London & New York gleichzeitig
  if (timeVal >= 14.5 && timeVal < 17.0) {
    return "Frankfurt/London & New York";
  }
  // 08:00 bis 14:30 Uhr -> Frankfurt / London
  else if (timeVal >= 8.0 && timeVal < 14.5) {
    return "Frankfurt/London";
  }
  // 17:00 bis 22:00 Uhr -> Nur New York (nach London-Schluss)
  else if (timeVal >= 17.0 && timeVal < 22.0) {
    return "New York";
  }
  // Restliche Zeit -> Asien / Tokyo
  return "Asien/Tokyo";
}

// Repariert bestehende Trades im Speicher automatisch
function autoFixJournalSessions() {
  let changed = false;
  journalTrades.forEach(t => {
    if (!t.timestamp) return;
    const realSession = detectSessionFromTimestamp(t.timestamp);
    if (t.session !== realSession) {
      t.session = realSession;
      changed = true;
    }
  });

  if (changed) {
    localStorage.setItem("alphaos_journal_trades", JSON.stringify(journalTrades));
    console.log("✅ Sessions für alle bestehenden Trades erfolgreich korrigiert!");
  }
}

/* ============================================================
   💾 CORE DATA MANAGEMENT
   ============================================================ */
function loadJournalData() {
  const stored = localStorage.getItem("alphaos_journal_trades");
  if (stored) {
    try { 
      journalTrades = JSON.parse(stored); 
      autoFixJournalSessions();
    } catch (e) { 
      console.error("Fehler beim Laden des Journals:", e);
      journalTrades = []; 
    }
  }
  updateJournalUI();
}

function saveJournalData() {
  try {
    localStorage.setItem("alphaos_journal_trades", JSON.stringify(journalTrades));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert("⚠️ Speicherlimit im Browser erreicht! Bitte erstelle Screenshots in kleinerer Auflösung oder lösche alte Trades.");
    } else {
      console.error("Fehler beim Speichern:", e);
    }
  }
  updateJournalUI();
  initCalendar(); 
}

/* ============================================================
   📸 SCREENSHOT & IMAGE HANDLING (BASE64 CONVERSION)
   ============================================================ */
function handleImageUpload(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  let pendingReads = files.length;

  files.forEach(file => {
    if (file.size > 3 * 1024 * 1024) {
      alert(`Das Bild "${file.name}" ist größer als 3MB. Für optimale Performance wird eine Komprimierung empfohlen.`);
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const base64Data = e.target.result;
      currentUploadedImages.push(base64Data);
      
      pendingReads--;
      if (pendingReads === 0) {
        renderFormImagePreview();
      }
    };
    reader.readAsDataURL(file);
  });

  event.target.value = "";
}

function renderFormImagePreview() {
  const previewGrid = document.getElementById("formImagePreview");
  if (!previewGrid) return;

  previewGrid.innerHTML = "";

  currentUploadedImages.forEach((imgSrc, index) => {
    const card = document.createElement("div");
    card.className = "preview-card";
    card.style.cssText = "position: relative; display: inline-block; width: 80px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.15); background: #000;";

    card.innerHTML = `
      <img src="${imgSrc}" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" onclick="openLightbox('${imgSrc}')" />
      <button type="button" onclick="removeFormImage(${index})" style="position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.75); color: #f43f5e; border: none; border-radius: 50%; width: 18px; height: 18px; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1;">✕</button>
    `;
    previewGrid.appendChild(card);
  });
}

function removeFormImage(index) {
  currentUploadedImages.splice(index, 1);
  renderFormImagePreview();
}

function openLightbox(imgSrc) {
  let lightbox = document.getElementById("globalLightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "globalLightbox";
    lightbox.style.cssText = "position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 10000; cursor: pointer;";
    lightbox.onclick = () => lightbox.remove();
    document.body.appendChild(lightbox);
  }
  lightbox.innerHTML = `<img src="${imgSrc}" style="max-width: 90vw; max-height: 90vh; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.8);" />`;
}

/* ============================================================
   ⏱️ FORMATTING & TIMEZONES
   ============================================================ */
function formatCurrency(value) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

function formatTradeTime(timestamp) {
  const date = new Date(timestamp);
  const options = { 
    day: "2-digit", month: "2-digit", year: "numeric", 
    hour: "2-digit", minute: "2-digit", hour12: false
  };

  if (activeTimezone === 'UTC') {
    options.timeZone = 'UTC';
    return date.toLocaleDateString("de-DE", options) + " UTC";
  } else if (activeTimezone === 'EST') {
    options.timeZone = 'America/New_York';
    return date.toLocaleDateString("de-DE", options) + " EST";
  }
  return date.toLocaleDateString("de-DE", options); 
}

function switchJournalTimezone(tz) {
  activeTimezone = tz;
  document.querySelectorAll(".btn-tz").forEach(b => b.classList.remove("active"));
  const btnId = tz === 'EST' ? 'tz-ny' : tz === 'UTC' ? 'tz-utc' : 'tz-local';
  document.getElementById(btnId)?.classList.add("active");
  updateJournalUI();
}

/* ============================================================
   🔲 MODAL LOGIC & FORM CONTROL
   ============================================================ */
function openTradeModal() {
  const overlay = document.getElementById("tradeModalOverlay");
  const dateLabel = document.getElementById("modalDateLabel");
  
  if (selectedFilterDateStr && dateLabel) {
    dateLabel.innerText = selectedFilterDateStr;
  } else if (dateLabel) {
    const today = new Date();
    dateLabel.innerText = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
  }

  if (overlay) {
    overlay.classList.add("active");
  }
}

function closeTradeModal() {
  const overlay = document.getElementById("tradeModalOverlay");
  if (overlay) {
    overlay.classList.remove("active");
  }
  document.getElementById("journalForm")?.reset();
  document.getElementById("jFormId")?.remove();
  
  currentUploadedImages = [];
  renderFormImagePreview();

  const submitBtn = document.getElementById("btnSubmitForm");
  if (submitBtn) submitBtn.innerText = "💾 Trade speichern";
}

function closeTradeModalOnBackdrop(e) {
  if (e.target.id === "tradeModalOverlay") {
    closeTradeModal();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeTradeModal();
  }
});

/* ============================================================
   ➕ ACTION LOGIC (EXECUTION)
   ============================================================ */
function addJournalTrade(event) {
  if (event) event.preventDefault();

  const idInput = document.getElementById("jFormId")?.value;
  const pair = document.getElementById("jFormPair").value.toUpperCase().trim();
  const direction = document.getElementById("jFormDirection").value;
  const lots = parseFloat(document.getElementById("jFormLots").value) || 0;
  const pnl = parseFloat(document.getElementById("jFormPnL").value) || 0;
  const session = document.getElementById("jFormSession").value;
  const confluence = document.getElementById("jFormConfluence").value;
  const notes = document.getElementById("jFormNotes").value.trim();

  if (!pair || lots <= 0) {
    alert("Bitte ein gültiges Asset und eine Lotgröße größer als 0 angeben.");
    return;
  }

  let targetTimestamp = Date.now();
  if (selectedFilterDateStr) {
    const parts = selectedFilterDateStr.split('.');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const now = new Date();
    targetTimestamp = new Date(year, month, day, now.getHours(), now.getMinutes()).getTime();
  }

  if (idInput) {
    const index = journalTrades.findIndex(t => t.id === idInput);
    if (index !== -1) {
      Object.assign(journalTrades[index], {
        pair, direction, lots, pnl, session, 
        confluence: confluence ? parseInt(confluence, 10) : null, 
        notes: notes || "Keine Notizen.",
        images: [...currentUploadedImages]
      });
    }
  } else {
    journalTrades.push({
      id: "tr_" + Date.now(),
      timestamp: targetTimestamp,
      pair, direction, lots, pnl, session,
      confluence: confluence ? parseInt(confluence, 10) : null,
      notes: notes || "Keine Notizen.",
      images: [...currentUploadedImages]
    });
  }

  journalTrades.sort((a, b) => b.timestamp - a.timestamp);
  
  closeTradeModal();
  saveJournalData();

  if (selectedFilterDateStr) {
    showDayDetails(selectedFilterDateStr);
  }
}

function editTrade(id) {
  const trade = journalTrades.find(t => t.id === id);
  if (!trade) return;

  openTradeModal();

  document.getElementById("jFormPair").value = trade.pair;
  document.getElementById("jFormDirection").value = trade.direction;
  document.getElementById("jFormLots").value = trade.lots;
  document.getElementById("jFormPnL").value = trade.pnl;
  document.getElementById("jFormSession").value = trade.session;
  document.getElementById("jFormConfluence").value = trade.confluence || "";
  document.getElementById("jFormNotes").value = trade.notes;

  currentUploadedImages = trade.images ? [...trade.images] : [];
  renderFormImagePreview();

  let idInput = document.getElementById("jFormId");
  if (!idInput) {
    idInput = document.createElement("input");
    idInput.type = "hidden";
    idInput.id = "jFormId";
    document.getElementById("journalForm").appendChild(idInput);
  }
  idInput.value = trade.id;

  const submitBtn = document.getElementById("btnSubmitForm");
  if (submitBtn) submitBtn.innerText = "✏️ Änderungen übernehmen";
}

function deleteTrade(id) {
  if (confirm("Diesen Trade wirklich aus der Historie löschen?")) {
    journalTrades = journalTrades.filter(t => t.id !== id);
    saveJournalData();
    if (selectedFilterDateStr) {
      showDayDetails(selectedFilterDateStr);
    }
  }
}

function clearJournal() {
  if (confirm("SYSTEMWARNUNG: Gesamte Trade-Historie unwiderruflich löschen?")) {
    journalTrades = [];
    saveJournalData();
    resetCalendarFilter();
  }
}

/* ============================================================
   📅 CALENDAR MATRIX
   ============================================================ */
function buildDailyDetailsForJournal() {
  const map = new Map();

  for (const t of journalTrades) {
    if (!t.timestamp) continue;
    const d = new Date(t.timestamp);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    if (!map.has(key)) {
      map.set(key, { pnl: 0, trades: 0, wins: 0, losses: 0 });
    }

    const obj = map.get(key);
    const p = Number(t.pnl || 0);

    obj.pnl += p;
    obj.trades += 1;

    if (p > 0) obj.wins += 1;
    else if (p < 0) obj.losses += 1;
  }
  return map;
}

function initCalendar() {
  const grid = document.getElementById("calendarGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

  let grossWin = 0;
  let grossLoss = 0;
  let tradeCount = 0;
  const tradingDaysSet = new Set();

  journalTrades.forEach(t => {
    if (!t.timestamp) return;
    const d = new Date(t.timestamp);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const p = Number(t.pnl || 0);
      if (p > 0) grossWin += p;
      else if (p < 0) grossLoss += Math.abs(p);
      tradeCount++;
      tradingDaysSet.add(d.toDateString());
    }
  });

  const netPnL = grossWin - grossLoss;
  const turnover = grossWin + grossLoss;
  const marginPct = turnover > 0 ? (netPnL / turnover) * 100 : 0;
  const activeTradingDays = tradingDaysSet.size;

  const isProfit = netPnL > 0;
  const isLoss = netPnL < 0;
  const sign = isProfit ? "+" : "";

  const badgeClass = isProfit ? "is-profit" : (isLoss ? "is-loss" : "is-neutral");
  const monthThemeClass = isProfit ? "month-profit" : (isLoss ? "month-loss" : "month-neutral");

  const calendarContainer = document.querySelector(".calendar-box") || grid.closest(".calendar-box");
  if (calendarContainer) {
    calendarContainer.classList.remove("month-profit", "month-loss", "month-neutral");
    calendarContainer.classList.add(monthThemeClass);
  }

  const headerEl = document.getElementById("calendarMonthYear");
  if (headerEl) {
    headerEl.innerHTML = `
      <div class="calendar-header-meta">
        <span class="cal-month-title">${monthNames[month]} ${year}</span>
        <span class="calendar-month-badge ${badgeClass}">${sign}${marginPct.toFixed(1)}%</span>
        <span class="calendar-stat-pill ${badgeClass}">${sign}${formatCurrency(netPnL)}</span>
        <span class="calendar-stat-pill is-days">${activeTradingDays} ${activeTradingDays === 1 ? 'Tag' : 'Tage'}</span>
      </div>
    `;
  }

  const firstDay = new Date(year, month, 1);
  const start = new Date(firstDay);
  const dayOfWeek = firstDay.getDay();
  const shift = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 
  start.setDate(firstDay.getDate() - shift);

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push(d);
  }

  const dailyDetails = buildDailyDetailsForJournal();

  let maxAbsDayPnl = 1;
  for (const [key, v] of dailyDetails.entries()) {
    const parts = key.split("-").map(Number);
    if (parts[0] === year && (parts[1] - 1) === month) {
      maxAbsDayPnl = Math.max(maxAbsDayPnl, Math.abs(v.pnl));
    }
  }

  const today = new Date();

  for (const d of cells) {
    const dYear = d.getFullYear();
    const dMonth = d.getMonth();
    const dDay = d.getDate();
    
    const currentString = `${dDay.toString().padStart(2, '0')}.${(dMonth + 1).toString().padStart(2, '0')}.${dYear}`;
    const key = `${dYear}-${String(dMonth + 1).padStart(2, "0")}-${String(dDay).padStart(2, "0")}`;

    const isOutside = dMonth !== month;
    const info = dailyDetails.get(key);

    const dayBox = document.createElement("div");
    dayBox.className = "calendar-day";
    dayBox.style.position = "relative";
    
    if (isOutside) {
      dayBox.classList.add("empty");
    }

    if (today.getDate() === dDay && today.getMonth() === dMonth && today.getFullYear() === dYear) {
      dayBox.classList.add("today");
    }

    if (selectedFilterDateStr === currentString) {
      dayBox.classList.add("selected");
    }

    dayBox.innerHTML = `<span class="cal-day-num" style="position:absolute; top:4px; right:6px; font-size:11px; font-weight:700; color:${isOutside ? 'var(--textMuted)' : '#fff'};">${dDay}</span>`;

    if (info && info.trades > 0) {
      const pnl = info.pnl;
      const alpha = Math.max(0.15, Math.min(0.75, 0.15 + 0.60 * (Math.abs(pnl) / maxAbsDayPnl)));

      if (pnl > 0) {
        dayBox.style.background = `rgba(16, 185, 129, ${alpha})`; 
        dayBox.style.border = "1px solid rgba(16, 185, 129, 0.35)";
      } else if (pnl < 0) {
        dayBox.style.background = `rgba(244, 63, 94, ${alpha})`;  
        dayBox.style.border = "1px solid rgba(244, 63, 94, 0.35)";
      } else {
        dayBox.style.background = "rgba(255, 255, 255, 0.06)";
      }

      const winPct = (info.wins / info.trades) * 100;
      
      const metaContainer = document.createElement("div");
      metaContainer.style = "display:flex; flex-direction:column; justify-content:flex-end; height:100%; font-size:10px; padding:16px 4px 2px; font-weight:600; text-align:left; line-height:1.25;";
      metaContainer.innerHTML = `
        <div style="font-weight:800; color:#fff;">${pnl >= 0 ? "+" : ""}${formatCurrency(pnl)}</div>
        <div style="color:rgba(255,255,255,0.6);">${info.trades} T | ${winPct.toFixed(0)}% W</div>
      `;
      dayBox.appendChild(metaContainer);
    }

    dayBox.onclick = () => filterByDate(currentString);
    grid.appendChild(dayBox);
  }
  updateYearHeatmap();
}

function changeMonth(direction) {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
  initCalendar();
  updateJournalUI();
}

function jumpToExactDate(dateString) {
  if (!dateString) return;
  const [year, month, day] = dateString.split('-');
  currentCalendarDate = new Date(year, parseInt(month) - 1, day);
  initCalendar();
  updateJournalUI();
  const formattedDate = `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
  filterByDate(formattedDate);
}

function filterByDate(dateStr) {
  if (selectedFilterDateStr === dateStr) {
    resetCalendarFilter();
  } else {
    selectedFilterDateStr = dateStr;
    
    const statusEl = document.getElementById("selectedDayStatus");
    if (statusEl) statusEl.innerText = `📅 Filter aktiv: ${dateStr}`;
    
    const btnReset = document.getElementById("resetCalendarFilterBtn");
    if (btnReset) btnReset.style.display = "block";
    
    initCalendar();
    updateJournalUI();
    
    setTimeout(() => {
      showDayDetails(dateStr);
    }, 50);
  }
}

function resetCalendarFilter() {
  selectedFilterDateStr = null;
  
  const statusEl = document.getElementById("selectedDayStatus");
  if (statusEl) statusEl.innerText = `🟢 Zeige alle Trades`;
  
  const btnReset = document.getElementById("resetCalendarFilterBtn");
  if (btnReset) btnReset.style.display = "none";
  
  const wrap = document.getElementById("journalDayDetails");
  if (wrap) wrap.style.display = "none";

  closeTradeModal();
  initCalendar();
  updateJournalUI();
}

function showDayDetails(dateStr) {
  const wrap = document.getElementById("journalDayDetails");
  const tbody = document.getElementById("dayTableBody");
  if (!wrap || !tbody) return;

  const dayTrades = journalTrades.filter(t => {
    const d = new Date(t.timestamp);
    const tString = `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
    return tString === dateStr;
  });

  let netPnL = 0;
  let wins = 0;
  let losses = 0;

  tbody.innerHTML = "";

  dayTrades.forEach(t => {
    netPnL += t.pnl;
    if (t.pnl > 0) wins++;
    else if (t.pnl < 0) losses++;

    const isWin = t.pnl >= 0;
    const pnlClass = isWin ? "pnl-profit" : "pnl-loss";
    const dirClass = t.direction === "BUY" ? "dir-buy" : "dir-sell";
    
    let imageThumbnailsHTML = "";
    if (t.images && t.images.length > 0) {
      imageThumbnailsHTML = `<div style="display: flex; gap: 4px; margin-top: 6px; flex-wrap: wrap;">`;
      t.images.forEach(imgData => {
        imageThumbnailsHTML += `
          <img src="${imgData}" 
               style="width: 32px; height: 32px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); cursor: pointer;" 
               onclick="openLightbox('${imgData}')" 
               title="Chart-Screenshot anzeigen" />
        `;
      });
      imageThumbnailsHTML += `</div>`;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatTradeTime(t.timestamp)}</td>
      <td style="font-weight: 800;">${t.pair}</td>
      <td class="${dirClass}" style="font-weight: 700;">${t.direction}</td>
      <td>${t.lots.toFixed(2)}</td>
      <td class="${pnlClass}">${isWin ? "+" : ""}${formatCurrency(t.pnl)}</td>
      <td><span class="session-tag">${t.session}</span></td>
      <td>${t.confluence ? t.confluence + "%" : "–"}</td>
      <td style="max-width: 220px; overflow: hidden; text-overflow: ellipsis;" title="${t.notes}">
        ${t.notes}
        ${imageThumbnailsHTML}
      </td>
      <td class="col-actions">
        <button class="btn-edit-trade" onclick="editTrade('${t.id}')" title="Bearbeiten">✏️</button>
        <button class="btn-del-trade" onclick="deleteTrade('${t.id}')" title="Löschen">✕</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const totalCount = wins + losses;
  const winPct = totalCount > 0 ? (wins / totalCount) * 100 : 0;

  document.getElementById("dayDetailsLabel").textContent = dateStr;
  
  const netEl = document.getElementById("dayDetailsNet");
  netEl.textContent = formatCurrency(netPnL);
  netEl.className = netPnL >= 0 ? "pnl-profit" : "pnl-loss";
  
  document.getElementById("dayDetailsTrades").textContent = dayTrades.length;
  document.getElementById("dayDetailsWin").textContent = `${winPct.toFixed(0)}%`;

  wrap.style.display = "block";
  wrap.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ============================================================
   🗓️ JAHRES-ÜBERSICHT: MINI-HEATMAP & JAHRES-% (RESPONSIVE FIX)
   ============================================================ */
function updateYearHeatmap() {
  const currentYear = currentCalendarDate.getFullYear();
  const activeMonth = currentCalendarDate.getMonth();
  const shortMonths = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

  let box = document.getElementById("yearHeatmapBox");
  if (!box) {
    const calBox = document.querySelector(".calendar-box");
    if (!calBox) return;
    box = document.createElement("div");
    box.id = "yearHeatmapBox";
    box.className = "year-heatmap-box";
    box.innerHTML = `
      <div class="year-heatmap-left">
        <span id="yearSummaryLabel" class="year-title"></span>
        <span id="yearPerformanceBadge" class="year-badge is-neutral">0.0%</span>
      </div>
      <div id="yearMonthsBar" class="year-months-grid"></div>
    `;
    calBox.parentNode.insertBefore(box, calBox);
  }

  const titleEl = document.getElementById("yearSummaryLabel");
  const badgeEl = document.getElementById("yearPerformanceBadge");
  const barEl = document.getElementById("yearMonthsBar");

  if (titleEl) titleEl.innerText = `${currentYear}`;

  const monthsData = Array.from({ length: 12 }, () => ({ win: 0, loss: 0, count: 0 }));
  let yearWin = 0;
  let yearLoss = 0;

  journalTrades.forEach(t => {
    if (!t.timestamp) return;
    const d = new Date(t.timestamp);
    if (d.getFullYear() === currentYear) {
      const m = d.getMonth();
      const p = Number(t.pnl || 0);
      if (p > 0) {
        monthsData[m].win += p;
        yearWin += p;
      } else if (p < 0) {
        monthsData[m].loss += Math.abs(p);
        yearLoss += Math.abs(p);
      }
      monthsData[m].count++;
    }
  });

  const yearNet = yearWin - yearLoss;
  const yearTurnover = yearWin + yearLoss;
  const yearMarginPct = yearTurnover > 0 ? (yearNet / yearTurnover) * 100 : 0;
  const isYearProfit = yearNet > 0;
  const isYearLoss = yearNet < 0;
  const yearSign = isYearProfit ? "+" : "";
  const yearBadgeClass = isYearProfit ? "is-profit" : (isYearLoss ? "is-loss" : "is-neutral");

  if (badgeEl) {
    badgeEl.className = `year-badge ${yearBadgeClass}`;
    badgeEl.innerText = `${yearSign}${yearMarginPct.toFixed(1)}%`;
  }

  let chipsHTML = "";
  monthsData.forEach((m, idx) => {
    const net = m.win - m.loss;
    let colorClass = "chip-neutral";
    if (m.count > 0) {
      colorClass = net > 0 ? "chip-profit" : (net < 0 ? "chip-loss" : "chip-neutral");
    }
    const isActive = idx === activeMonth ? "is-active-month" : "";
    const titleText = `${shortMonths[idx]}: ${m.count} Trades (${net >= 0 ? '+' : ''}${formatCurrency(net)})`;

    chipsHTML += `
      <div class="year-month-chip ${colorClass} ${isActive}" 
           title="${titleText}" 
           onclick="selectMonthFromHeatmap(${idx})">
        ${shortMonths[idx]}
      </div>
    `;
  });

  if (barEl) {
    barEl.innerHTML = chipsHTML;
  }

  const applyResponsiveHeatmap = () => {
    const containerWidth = box.clientWidth || window.innerWidth;
    if (containerWidth < 980) {
      box.style.flexDirection = "column";
      box.style.alignItems = "stretch";
      box.style.gap = "10px";
      
      const leftPart = box.querySelector(".year-heatmap-left");
      if (leftPart) {
        leftPart.style.display = "flex";
        leftPart.style.justifyContent = "space-between";
        leftPart.style.width = "100%";
      }

      if (barEl) {
        barEl.style.display = "grid";
        barEl.style.gridTemplateColumns = "repeat(6, 1fr)";
        barEl.style.gap = "6px";
        barEl.style.width = "100%";
      }
    } else {
      box.style.flexDirection = "row";
      box.style.alignItems = "center";
      box.style.gap = "16px";
      
      const leftPart = box.querySelector(".year-heatmap-left");
      if (leftPart) {
        leftPart.style.display = "flex";
        leftPart.style.justifyContent = "flex-start";
        leftPart.style.width = "auto";
      }

      if (barEl) {
        barEl.style.display = "grid";
        barEl.style.gridTemplateColumns = "repeat(12, 1fr)";
        barEl.style.gap = "6px";
      }
    }
  };

  applyResponsiveHeatmap();
  window.removeEventListener("resize", applyResponsiveHeatmap);
  window.addEventListener("resize", applyResponsiveHeatmap);
}

window.selectMonthFromHeatmap = function(monthIndex) {
  currentCalendarDate.setMonth(monthIndex);
  initCalendar();
  updateJournalUI();
};

/* ============================================================
   🔗 EXTERNAL BRIDGES
   ============================================================ */
window.assignConfluenceToTrade = function ({ symbol, score }) {
  if (!symbol) return;
  if (document.getElementById("jFormPair")) document.getElementById("jFormPair").value = symbol.toUpperCase();
  if (document.getElementById("jFormConfluence")) document.getElementById("jFormConfluence").value = score;
};

function initJournalPairsAutocomplete() {
  const datalist = document.getElementById("journalPairsDatalist");
  if (!datalist || typeof livePrices === "undefined") return;
  datalist.innerHTML = Object.keys(livePrices).map(sym => `<option value="${sym}"></option>`).join("");
}

/* ============================================================
   🖥️ RENDERING CORE: UI & PREMIUM CHARTS
   ============================================================ */
function updateJournalUI() {
  calculateJournalKPIs();
  renderJournalCharts();
}

function calculateJournalKPIs() {
  const total = journalTrades.length;
  const countEl = document.getElementById("journalTradeCount");
  if (countEl) countEl.innerText = `${total} Trades gesamt`;

  if (total === 0) {
    const winRateEl = document.getElementById("journalWinRate");
    if (winRateEl) winRateEl.innerText = "0%";

    const pnlEl = document.getElementById("journalTotalPnL");
    if (pnlEl) {
      pnlEl.innerText = formatCurrency(0);
      pnlEl.className = "kpi-value";
    }

    const pfEl = document.getElementById("journalProfitFactor");
    if (pfEl) pfEl.innerText = "Profit Factor: 0.00";

    const avgEl = document.getElementById("journalAvgMetrics");
    if (avgEl) avgEl.innerHTML = `<span class="pnl-profit">+${formatCurrency(0)}</span> / <span class="pnl-loss">-${formatCurrency(0)}</span>`;

    const ratioValEl = document.getElementById("jAvgRatioVal");
    if (ratioValEl) ratioValEl.innerText = "0.00";

    const winBar = document.getElementById("jAvgRatioBarWin");
    const lossBar = document.getElementById("jAvgRatioBarLoss");
    if (winBar && lossBar) {
      winBar.style.width = "50%";
      lossBar.style.width = "50%";
    }

    const winValEl = document.getElementById("jAvgWinVal");
    const lossValEl = document.getElementById("jAvgLossVal");
    if (winValEl) winValEl.innerText = `+${formatCurrency(0)}`;
    if (lossValEl) lossValEl.innerText = `-${formatCurrency(0)}`;

    const expEl = document.getElementById("journalExpectancy");
    if (expEl) {
      expEl.innerText = `${formatCurrency(0)} / Trade`;
      expEl.className = "kpi-value";
    }

    const payoffEl = document.getElementById("journalPayoffRatio");
    if (payoffEl) payoffEl.innerText = "R:R Ratio: 1 : 0.00";

    const streakEl = document.getElementById("journalMaxStreak");
    if (streakEl) streakEl.innerText = "Max Win Streak: 0";

    return;
  }

  let wins = 0;
  let losses = 0;
  let grossProfits = 0;
  let grossLosses = 0;
  let currentStreak = 0;
  let maxWinStreak = 0;
  let totalPnL = 0;

  [...journalTrades].reverse().forEach(t => {
    totalPnL += t.pnl;

    if (t.pnl > 0) {
      wins++;
      grossProfits += t.pnl;
      currentStreak++;
      if (currentStreak > maxWinStreak) maxWinStreak = currentStreak;
    } else if (t.pnl < 0) {
      losses++;
      grossLosses += Math.abs(t.pnl);
      currentStreak = 0;
    } else {
      currentStreak = 0;
    }
  });

  const winRate = ((wins / total) * 100).toFixed(1);
  const winRateEl = document.getElementById("journalWinRate");
  if (winRateEl) winRateEl.innerText = `${winRate}%`;

  const pnlEl = document.getElementById("journalTotalPnL");
  if (pnlEl) {
    pnlEl.innerText = `${totalPnL >= 0 ? "+" : ""}${formatCurrency(totalPnL)}`;
    pnlEl.className = `kpi-value ${totalPnL >= 0 ? 'pnl-profit' : 'pnl-loss'}`;
  }

  const profitFactor = grossLosses === 0 ? grossProfits.toFixed(2) : (grossProfits / grossLosses).toFixed(2);
  const pfEl = document.getElementById("journalProfitFactor");
  if (pfEl) pfEl.innerText = `Profit Factor: ${profitFactor}`;

  const avgWin = wins > 0 ? grossProfits / wins : 0;
  const avgLoss = losses > 0 ? grossLosses / losses : 0;
  const ratio = avgLoss > 0 ? (avgWin / avgLoss) : (avgWin > 0 ? avgWin : 0);

  const avgEl = document.getElementById("journalAvgMetrics");
  if (avgEl) {
    avgEl.innerHTML = `<span class="pnl-profit">+${formatCurrency(avgWin)}</span> / <span class="pnl-loss">-${formatCurrency(avgLoss)}</span>`;
  }

  const ratioValEl = document.getElementById("jAvgRatioVal");
  if (ratioValEl) ratioValEl.innerText = ratio.toFixed(2);

  const totalAvg = avgWin + avgLoss;
  let winPercent = 50;
  let lossPercent = 50;

  if (totalAvg > 0) {
    winPercent = (avgWin / totalAvg) * 100;
    lossPercent = (avgLoss / totalAvg) * 100;
  }

  const winBar = document.getElementById("jAvgRatioBarWin");
  const lossBar = document.getElementById("jAvgRatioBarLoss");
  if (winBar && lossBar) {
    winBar.style.width = `${winPercent}%`;
    lossBar.style.width = `${lossPercent}%`;
  }

  const winValEl = document.getElementById("jAvgWinVal");
  const lossValEl = document.getElementById("jAvgLossVal");
  if (winValEl) winValEl.innerText = `+${formatCurrency(avgWin)}`;
  if (lossValEl) lossValEl.innerText = `-${formatCurrency(avgLoss)}`;

  const winProb = wins / total;
  const lossProb = losses / total;
  const expectancy = (winProb * avgWin) - (lossProb * avgLoss);

  const expEl = document.getElementById("journalExpectancy");
  if (expEl) {
    expEl.innerText = `${expectancy >= 0 ? "+" : ""}${formatCurrency(expectancy)} / Trade`;
    expEl.className = `kpi-value ${expectancy >= 0 ? 'pnl-profit' : 'pnl-loss'}`;
  }

  const payoffEl = document.getElementById("journalPayoffRatio");
  if (payoffEl) {
    payoffEl.innerText = `R:R Ratio: 1 : ${ratio.toFixed(2)}`;
  }

  const streakEl = document.getElementById("journalMaxStreak");
  if (streakEl) streakEl.innerText = `Max Win Streak: ${maxWinStreak}`;
}

const apexChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false }, 
    tooltip: { 
      backgroundColor: APEX_COLORS.bg, 
      titleColor: '#fff', 
      bodyColor: APEX_COLORS.textMuted, 
      borderColor: APEX_COLORS.grid, 
      borderWidth: 1, 
      padding: 10, 
      displayColors: false, 
      cornerRadius: 8 
    } 
  },
  scales: { 
    x: { grid: { display: false }, ticks: { color: APEX_COLORS.textMuted, font: { size: 10 } } }, 
    y: { grid: { color: APEX_COLORS.grid }, border: { display: false }, ticks: { color: APEX_COLORS.textMuted, font: { size: 10 } } } 
  }
};

function renderJournalCharts() {
  Object.values(chartInstances).forEach(chart => chart?.destroy());
  if (journalTrades.length === 0) return;
  Chart.defaults.color = APEX_COLORS.textMuted;
  Chart.defaults.font.family = "'Inter', sans-serif";

  const cronTrades = [...journalTrades].reverse();

  // 1. Equity-Kurve
  const canvasEquity = document.getElementById("chartEquity");
  if (canvasEquity) {
    const ctx = canvasEquity.getContext("2d");

    let runningPnL = 0;
    const equityData = cronTrades.map(t => { runningPnL += t.pnl; return runningPnL; });
    const dynamicPointRadius = equityData.length > 80 ? 0 : 2;

    chartInstances.equity = new Chart(ctx, {
      type: "line",
      data: {
        labels: cronTrades.map((_, i) => `T${i + 1}`),
        datasets: [{
          data: equityData,
          borderWidth: 2,
          pointRadius: dynamicPointRadius,
          pointHoverRadius: 4,
          fill: 'origin',
          tension: 0.1,
          borderColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea, scales } = chart;
            
            if (!chartArea || !scales.y) {
              const dummy = ctx.createLinearGradient(0, 0, 0, 1);
              dummy.addColorStop(0, APEX_COLORS.win);
              dummy.addColorStop(1, APEX_COLORS.win);
              return dummy;
            }

            const yZero = scales.y.getPixelForValue(0);
            const top = chartArea.top;
            const bottom = chartArea.bottom;
            const range = bottom - top;

            let zeroRatio = range > 0 ? (yZero - top) / range : 0.5;
            zeroRatio = Math.max(0, Math.min(1, zeroRatio));

            const gradientLine = ctx.createLinearGradient(0, top, 0, bottom);
            gradientLine.addColorStop(0, APEX_COLORS.win);
            gradientLine.addColorStop(zeroRatio, APEX_COLORS.win);
            gradientLine.addColorStop(zeroRatio, APEX_COLORS.loss);
            gradientLine.addColorStop(1, APEX_COLORS.loss);
            return gradientLine;
          },
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea, scales } = chart;
            
            if (!chartArea || !scales.y) {
              const dummy = ctx.createLinearGradient(0, 0, 0, 1);
              dummy.addColorStop(0, "rgba(16, 185, 129, 0.50)");
              dummy.addColorStop(1, "rgba(16, 185, 129, 0.10)");
              return dummy;
            }

            const yZero = scales.y.getPixelForValue(0);
            const top = chartArea.top;
            const bottom = chartArea.bottom;
            const range = bottom - top;

            let zeroRatio = range > 0 ? (yZero - top) / range : 0.5;
            zeroRatio = Math.max(0, Math.min(1, zeroRatio));

            const gradientFill = ctx.createLinearGradient(0, top, 0, bottom);
            gradientFill.addColorStop(0, "rgba(16, 185, 129, 0.60)");
            gradientFill.addColorStop(zeroRatio, "rgba(16, 185, 129, 0.15)");
            gradientFill.addColorStop(zeroRatio, "rgba(244, 63, 94, 0.15)");
            gradientFill.addColorStop(1, "rgba(244, 63, 94, 0.60)");
            return gradientFill;
          },
          pointBackgroundColor: (context) => {
            const val = context.raw;
            return val >= 0 ? APEX_COLORS.win : APEX_COLORS.loss;
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { 
          legend: { display: false }, 
          tooltip: { 
            backgroundColor: APEX_COLORS.bg, 
            titleColor: '#fff', 
            bodyColor: APEX_COLORS.textMuted, 
            borderColor: APEX_COLORS.grid, 
            borderWidth: 1, 
            padding: 10, 
            displayColors: false, 
            cornerRadius: 8 
          } 
        },
        scales: { 
          x: { display: false }, 
          y: { 
            grid: { color: APEX_COLORS.grid }, 
            border: { display: false }, 
            ticks: { color: APEX_COLORS.textMuted, font: { size: 10 } } 
          } 
        }
      }
    });
  }

  // 2. Win/Loss & Direction-Dominance Donuts (GESAMT-JOURNAL STATISTIK)
  const canvasWinLoss = document.getElementById("chartWinLoss");
  const canvasLongShort = document.getElementById("chartLongShort");
  const targetDataSet = journalTrades;

  if (canvasWinLoss) {
    const wins = targetDataSet.filter(t => t.pnl > 0).length;
    const losses = targetDataSet.filter(t => t.pnl <= 0).length;
    const totalWL = wins + losses;
    const winRatePct = totalWL > 0 ? ((wins / totalWL) * 100).toFixed(1) : "0.0";

    const centerWinEl = document.getElementById("centerWinRateVal");
    if (centerWinEl) {
      centerWinEl.innerText = `${winRatePct}%`;
      centerWinEl.style.color = Number(winRatePct) >= 50 ? "#00e676" : "#ff5252";
    }

    chartInstances.winloss = new Chart(canvasWinLoss.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: [`Wins (${wins})`, `Loss (${losses})`],
        datasets: [{
          data: totalWL === 0 ? [1] : [wins, losses],
          backgroundColor: totalWL === 0 ? ["rgba(255,255,255,0.06)"] : ["#00e676", "#ff5252"],
          borderWidth: 2,
          borderColor: "#0d0d12",
          hoverBorderColor: "#fff",
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "76%",
        animation: { animateRotate: true, animateScale: true, duration: 900, easing: "easeOutQuart" },
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: { boxWidth: 8, font: { size: 9, weight: "700" }, padding: 6, color: "#94a3b8" }
          },
          tooltip: {
            enabled: totalWL > 0,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw} (${totalWL > 0 ? ((ctx.raw / totalWL) * 100).toFixed(1) : 0}%)`
            }
          }
        }
      }
    });
  }

  // Chart 2: Gesamt Profit nach Richtung (Long = Grün, Short = Rot)
  if (canvasLongShort) {
    const longWins = targetDataSet.filter(t => (t.direction || "").toUpperCase() === "BUY" && t.pnl > 0).length;
    const shortWins = targetDataSet.filter(t => (t.direction || "").toUpperCase() === "SELL" && t.pnl > 0).length;
    const totalDirectionWins = longWins + shortWins;

    const isLongDominant = longWins >= shortWins;
    const domPct = totalDirectionWins > 0 
      ? Math.round(((isLongDominant ? longWins : shortWins) / totalDirectionWins) * 100) 
      : 0;

    const centerDomValEl = document.getElementById("centerDominanceVal");
    const centerDomSubEl = document.getElementById("centerDominanceSub");

    if (centerDomValEl && centerDomSubEl) {
      if (totalDirectionWins === 0) {
        centerDomValEl.innerText = "0%";
        centerDomValEl.style.color = "#94a3b8";
        centerDomSubEl.innerText = "Kein Profit";
      } else {
        centerDomValEl.innerText = `${domPct}%`;
        centerDomValEl.style.color = isLongDominant ? "#00e676" : "#ff5252";
        centerDomSubEl.innerText = isLongDominant ? "Long Win" : "Short Win";
      }
    }

    chartInstances.longshort = new Chart(canvasLongShort.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: [`Long (${longWins})`, `Short (${shortWins})`],
        datasets: [{
          data: totalDirectionWins === 0 ? [1] : [longWins, shortWins],
          backgroundColor: totalDirectionWins === 0 ? ["rgba(255,255,255,0.06)"] : ["#00e676", "#ff5252"],
          borderWidth: 2,
          borderColor: "#0d0d12",
          hoverBorderColor: "#fff",
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "76%",
        animation: { animateRotate: true, animateScale: true, duration: 900, easing: "easeOutQuart" },
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: { boxWidth: 8, font: { size: 9, weight: "700" }, padding: 6, color: "#94a3b8" }
          },
          tooltip: {
            enabled: totalDirectionWins > 0,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw} (${totalDirectionWins > 0 ? ((ctx.raw / totalDirectionWins) * 100).toFixed(1) : 0}%)`
            }
          }
        }
      }
    });
  }

// 3. Tages-Performance (CYBER NEON EDITION MIT GRADIENT & ANIMATION)
  const canvasPairs = document.getElementById("chartPairs");
  if (canvasPairs) {
    const ctx = canvasPairs.getContext("2d");
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dailyPerf = {};
    const labels = [];
    for (let i = 1; i <= daysInMonth; i++) {
      dailyPerf[i] = 0;
      labels.push(i);
    }

    journalTrades.forEach(t => {
      if (!t.timestamp) return;
      const d = new Date(t.timestamp);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (dailyPerf[day] !== undefined) {
          dailyPerf[day] += Number(t.pnl || 0);
        }
      }
    });

    const dataValues = labels.map(day => dailyPerf[day]);

    // Canvas-Farbverläufe für satte Neon-Balken
    const createBarGradients = (chartArea) => {
      const top = chartArea ? chartArea.top : 0;
      const bottom = chartArea ? chartArea.bottom : 160;

      const greenGrad = ctx.createLinearGradient(0, top, 0, bottom);
      greenGrad.addColorStop(0, "rgba(0, 230, 118, 0.85)");
      greenGrad.addColorStop(1, "rgba(0, 230, 118, 0.20)");

      const redGrad = ctx.createLinearGradient(0, top, 0, bottom);
      redGrad.addColorStop(0, "rgba(255, 82, 82, 0.20)");
      redGrad.addColorStop(1, "rgba(255, 82, 82, 0.85)");

      return { greenGrad, redGrad };
    };

    chartInstances.pairs = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { chartArea } = chart;
            const val = context.raw;
            if (val === 0) return "rgba(255, 255, 255, 0.02)";
            if (!chartArea) return val > 0 ? "#00e676" : "#ff5252";

            const { greenGrad, redGrad } = createBarGradients(chartArea);
            return val > 0 ? greenGrad : redGrad;
          },
          borderColor: dataValues.map(v => 
            v > 0 ? "#00e676" : (v < 0 ? "#ff5252" : "transparent")
          ),
          borderWidth: 1.5,
          borderRadius: 4,
          borderSkipped: false,
          hoverBorderColor: "#ffffff",
          hoverBorderWidth: 2,
          barPercentage: 0.9,
          categoryPercentage: 0.95
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 750,
          easing: "easeOutQuart"
        },
        interaction: {
          mode: "index",
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0d0d12",
            titleColor: "#ffffff",
            titleFont: { size: 11, weight: "800" },
            bodyColor: "#94a3b8",
            borderColor: "rgba(153, 51, 255, 0.4)",
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            cornerRadius: 8,
            callbacks: {
              title: (ctx) => `Tag ${ctx[0].label} (${currentCalendarDate.toLocaleDateString("de-DE", { month: "long", year: "numeric" })})`,
              label: (ctx) => {
                const val = ctx.raw;
                if (val === 0) return "Keine Trades";
                return ` ${val > 0 ? '+' : ''}${formatCurrency(val)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: "#94a3b8",
              font: { size: 10, weight: "800" },
              callback: function(val, index) {
                const dayNum = index + 1;
                if (dayNum === 1 || dayNum % 5 === 0 || dayNum === daysInMonth) {
                  return dayNum;
                }
                return "";
              },
              maxRotation: 0,
              autoSkip: false
            }
          },
          y: {
            grid: {
              color: (context) => context.tick.value === 0 ? "rgba(153, 51, 255, 0.45)" : "rgba(255, 255, 255, 0.05)",
              lineWidth: (context) => context.tick.value === 0 ? 1.5 : 1
            },
            border: { display: false },
            ticks: {
              color: "#94a3b8",
              font: { size: 10, weight: "700" },
              callback: (val) => `${val} €`
            }
          }
        }
      }
    });
  }
 }
/* ============================================================
   📥 AUTOMATIC MT5 IMPORT ENGINE
   ============================================================ */
function openMT5ImportModal() {
  const overlay = document.getElementById("mt5ImportModalOverlay");
  if (overlay) {
    overlay.classList.add("active");
    document.getElementById("mt5ImportCodeInput").value = "";
  }
}

function closeMT5ImportModal() {
  const overlay = document.getElementById("mt5ImportModalOverlay");
  if (overlay) {
    overlay.classList.remove("active");
  }
}

function executeMT5Import() {
  const rawInput = document.getElementById("mt5ImportCodeInput").value.trim();
  if (!rawInput) {
    alert("⚠️ Bitte füge zuerst den Code ein!");
    return;
  }

  try {
    const importedTrades = JSON.parse(rawInput);
    if (!Array.isArray(importedTrades)) {
      throw new Error("Format ungültig, es muss ein Array sein.");
    }

    let addedCount = 0;
    importedTrades.forEach(newTrade => {
      const exists = journalTrades.some(t => t.id === newTrade.id);
      if (!exists) {
        const tradeTime = newTrade.timestamp || Date.now();
        if (!newTrade.session || newTrade.session === "New York") {
          newTrade.session = detectSessionFromTimestamp(tradeTime);
        }
        journalTrades.push(newTrade);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      journalTrades.sort((a, b) => b.timestamp - a.timestamp);
      saveJournalData();
      closeMT5ImportModal();
      alert(`✅ Erfolgreich ${addedCount} neue Trades in dein Journal importiert!`);
    } else {
      alert("ℹ️ Keine neuen Trades gefunden. Alle Trades in diesem Code sind bereits in deinem Journal vorhanden.");
      closeMT5ImportModal();
    }
  } catch (e) {
    alert("❌ Fehler beim Einlesen des Codes. Details: " + e.message);
  }
}

/* ============================================================
   📂 DIRECT JSON FILE IMPORT
   ============================================================ */
function importMT5JsonFile(event) {
  const file = event.target?.files?.[0];
  if (!file) {
    alert("⚠️ Keine Datei ausgewählt.");
    return;
  }

  const reader = new FileReader();
  reader.onerror = function(evt) {
    alert("❌ Fehler beim Lesen der Datei auf dem Mobilgerät! Code: " + evt.target.error.code);
  };

  reader.onload = function(e) {
    try {
      const textContent = e.target.result;
      if (!textContent || textContent.trim() === "") {
        alert("⚠️ Die gewählte Datei ist leer.");
        return;
      }

      const importedData = JSON.parse(textContent);
      const rawTrades = Array.isArray(importedData) ? importedData : (importedData.trades || []);

      if (!rawTrades.length) {
        alert("⚠️ Keine gültigen Trades in der Datei gefunden.");
        return;
      }

      let newCount = 0;
      rawTrades.forEach(item => {
        const tradeId = item.id || ("tr_mt5_" + (item.timestamp || Date.now()));
        const exists = journalTrades.some(t => t.id === tradeId);
        
        if (!exists) {
          const tradeTime = typeof item.timestamp === "number" ? item.timestamp : Date.now();
          
          const recognizedSession = (item.session && item.session !== "New York") 
            ? item.session 
            : detectSessionFromTimestamp(tradeTime);

          journalTrades.push({
            id: tradeId,
            timestamp: tradeTime,
            pair: (item.pair || item.symbol || "XAUUSD").toUpperCase(),
            direction: (item.direction || item.type || "BUY").toUpperCase().includes("BUY") ? "BUY" : "SELL",
            lots: parseFloat(item.lots || item.volume || 0.10),
            pnl: parseFloat(item.pnl || item.profit || 0.0),
            session: recognizedSession,
            confluence: item.confluence || 75,
            notes: item.notes || "MT5 Import",
            images: item.images || []
          });
          newCount++;
        }
      });

      if (newCount > 0) {
        journalTrades.sort((a, b) => b.timestamp - a.timestamp);
        saveJournalData();
        alert(`✅ Erfolgreich ${newCount} Trades aus '${file.name}' importiert!`);
      } else {
        alert("ℹ️ Diese Trades befinden sich bereits im Journal.");
      }
    } catch (err) {
      console.error("Mobil Import Fehler:", err);
      alert("❌ Format-Fehler! Details: " + err.message);
    } finally {
      event.target.value = "";
    }
  };

  reader.readAsText(file, "UTF-8");
}

/* ============================================================
   🛠️ DEV TOOLS: RANDOM TRADE GENERATOR
   ============================================================ */
let currentDevBias = 'positive'; 

function injectDevTools() {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 768px) {
      #alphaosDevTools { display: none !important; }
    }
  `;
  document.head.appendChild(style);

  const devContainer = document.createElement('div');
  devContainer.id = "alphaosDevTools";
  devContainer.style.cssText = "position: fixed; bottom: 20px; left: 20px; background: rgba(13, 13, 18, 0.95); border: 1px solid #f43f5e; padding: 12px; border-radius: 8px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 4px 12px rgba(244, 63, 94, 0.2); backdrop-filter: blur(4px);";

  devContainer.innerHTML = `
    <div style="display: flex; gap: 10px; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
      <strong style="color: #94a3b8; font-size: 11px; font-family: sans-serif; width: 65px;">📉 TREND:</strong>
      <button id="devBtnNeg" onclick="setDevBias('negative')" style="background: #110f16; border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 4px 8px; cursor: pointer; border-radius: 4px; font-size: 11px; transition: 0.2s;">Negativ</button>
      <button id="devBtnNeu" onclick="setDevBias('neutral')" style="background: #110f16; border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 4px 8px; cursor: pointer; border-radius: 4px; font-size: 11px; transition: 0.2s;">Mittig</button>
      <button id="devBtnPos" onclick="setDevBias('positive')" style="background: #110f16; border: 1px solid #10b981; color: #10b981; padding: 4px 8px; cursor: pointer; border-radius: 4px; font-size: 11px; transition: 0.2s;">Positiv</button>
    </div>
    <div style="display: flex; gap: 10px; align-items: center;">
      <strong style="color: #f43f5e; font-size: 11px; font-family: sans-serif; width: 65px;">⚙️ ACTION:</strong>
      <button onclick="generateRandomTrades(50)" style="background: #110f16; border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 4px 10px; cursor: pointer; border-radius: 4px; font-size: 11px; transition: 0.2s;">+ 50</button>
      <button onclick="generateRandomTrades(100)" style="background: #110f16; border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 4px 10px; cursor: pointer; border-radius: 4px; font-size: 11px; transition: 0.2s;">+ 100</button>
      <button onclick="generateRandomTrades(500)" style="background: #110f16; border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 4px 10px; cursor: pointer; border-radius: 4px; font-size: 11px; transition: 0.2s;">+ 500</button>
      <div style="width: 1px; height: 16px; background: rgba(255,255,255,0.2); margin: 0 4px;"></div>
      <button onclick="clearJournal()" style="background: rgba(244, 63, 94, 0.1); border: 1px solid #f43f5e; color: #f43f5e; padding: 4px 10px; cursor: pointer; border-radius: 4px; font-size: 11px; transition: 0.2s;" title="Gesamtes Journal löschen">🗑️</button>
    </div>
  `;
  document.body.appendChild(devContainer);
}

window.setDevBias = function(bias) {
  currentDevBias = bias;
  const bNeg = document.getElementById('devBtnNeg');
  const bNeu = document.getElementById('devBtnNeu');
  const bPos = document.getElementById('devBtnPos');
  
  [bNeg, bNeu, bPos].forEach(b => {
    if(b) {
      b.style.borderColor = "rgba(255,255,255,0.2)";
      b.style.color = "#fff";
    }
  });

  if (bias === 'negative' && bNeg) {
    bNeg.style.borderColor = "#f43f5e"; bNeg.style.color = "#f43f5e";
  } else if (bias === 'neutral' && bNeu) {
    bNeu.style.borderColor = "#94a3b8"; bNeu.style.color = "#94a3b8";
  } else if (bias === 'positive' && bPos) {
    bPos.style.borderColor = "#10b981"; bPos.style.color = "#10b981";
  }
};

function generateRandomTrades(count) {
  const pairs = ["EURUSD", "GBPUSD", "XAUUSD", "BTCUSD", "NAS100", "US30", "GER40"];
  const directions = ["BUY", "SELL"];

  let lastTimestamp = Date.now() - (count * 8 * 60 * 60 * 1000); 
  if (journalTrades.length > 0) {
    lastTimestamp = journalTrades[0].timestamp; 
  }

  for (let i = 0; i < count; i++) {
    lastTimestamp += (8 * 60 * 60 * 1000) + Math.floor(Math.random() * 1000 * 60 * 45);

    let isWin;
    let randomPnL = 0;

    if (currentDevBias === 'positive') {
      isWin = Math.random() > 0.35; 
      randomPnL = isWin ? (Math.random() * 600 + 50) : (Math.random() * -300 - 20);
    } else if (currentDevBias === 'negative') {
      isWin = Math.random() > 0.65; 
      randomPnL = isWin ? (Math.random() * 300 + 20) : (Math.random() * -600 - 50); 
    } else {
      isWin = Math.random() > 0.50; 
      randomPnL = isWin ? (Math.random() * 400 + 20) : (Math.random() * -400 - 20); 
    }

    journalTrades.push({
      id: "dev_" + lastTimestamp + "_" + Math.floor(Math.random() * 10000),
      timestamp: lastTimestamp,
      pair: pairs[Math.floor(Math.random() * pairs.length)],
      direction: directions[Math.floor(Math.random() * directions.length)],
      lots: parseFloat((Math.random() * 4.9 + 0.1).toFixed(2)),
      pnl: parseFloat(randomPnL.toFixed(2)),
      session: detectSessionFromTimestamp(lastTimestamp),
      confluence: Math.floor(Math.random() * 40 + 60),
      notes: `Test-Trade (${currentDevBias})`,
      images: []
    });
  }

  journalTrades.sort((a, b) => b.timestamp - a.timestamp);
  saveJournalData(); 
  console.log(`[DEV] ${count} Trades generiert. Trend: ${currentDevBias.toUpperCase()}`);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("alphaosDevTools")) {
    injectDevTools();
  }
});