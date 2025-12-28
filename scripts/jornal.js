
  // ---------- Tooltip singleton ----------
  let _barTip = null;
  function getBarTooltip(){
    if(_barTip) return _barTip;
    const t = document.createElement("div");
    t.className = "chart-tooltip";
    document.body.appendChild(t);
    _barTip = t;
    return t;
  }
  function showBarTooltip(x, y, color, text){
    const tip = getBarTooltip();
    tip.innerHTML = `<span class="dot" style="background:${color};"></span>${text}`;
    tip.style.left = (x + 14) + "px";
    tip.style.top  = (y + 14) + "px";
    tip.style.display = "block";
  }
  function hideBarTooltip(){
    const tip = getBarTooltip();
    tip.style.display = "none";
  }

  // ---------- Date helpers (falls nicht schon vorhanden) ----------
  function _fmtShortDate(d){
    const pad = (n)=>String(n).padStart(2,"0");
    return `${pad(d.getMonth()+1)}/${pad(d.getDate())}/${d.getFullYear()}`; // wie im Screenshot
  }

  // ---------- Build series from equityByDay ----------
  function buildDailyBarSeries(equityByDay){
    // equityByDay: [{date, dayPnl, cum, dateKey}]
    if(!equityByDay || equityByDay.length === 0) return [];
    return equityByDay.map(p => ({
      date: p.date,
      dateKey: p.dateKey,
      value: Number(p.dayPnl || 0)
    }));
  }

  // ---------- Canvas sizing (nutzt deine bestehende Funktion, fallback) ----------
  function _resizeCanvas(canvas, cssH=320){
    if(typeof resizeCanvasToDisplaySize === "function"){
      return resizeCanvasToDisplaySize(canvas, cssH);
    }
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const cssW = Math.max(200, Math.floor(rect.width));
    const cssH2 = Math.max(240, Math.floor(cssH));
    canvas.style.height = cssH2 + "px";
    const needW = Math.floor(cssW * dpr);
    const needH = Math.floor(cssH2 * dpr);
    if(canvas.width !== needW || canvas.height !== needH){
      canvas.width = needW; canvas.height = needH;
    }
    return { dpr, cssW, cssH: cssH2 };
  }

  // ---------- Draw bar chart ----------
  function drawDailyBarChart(canvas, equityByDay){
    const series = buildDailyBarSeries(equityByDay);

    const size = _resizeCanvas(canvas, 360);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(size.dpr || (window.devicePixelRatio||1), size.dpr || (window.devicePixelRatio||1));

    const w = size.cssW;
    const h = size.cssH;

    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = "#141414";
    ctx.fillRect(0,0,w,h);

    const padL=56, padR=18, padT=18, padB=44;
    const innerW = w - padL - padR;
    const innerH = h - padT - padB;

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;

    const yLines = 6;
    for(let i=0;i<=yLines;i++){
      const yy = padT + innerH * (i/yLines);
      ctx.beginPath();
      ctx.moveTo(padL, yy);
      ctx.lineTo(w-padR, yy);
      ctx.stroke();
    }

    if(series.length < 2){
      ctx.fillStyle = "rgba(255,255,255,0.70)";
      ctx.font = "14px -apple-system, Segoe UI, Roboto, Arial";
      ctx.fillText("Zu wenig Daten für Balken.", padL, padT + 30);
      return { hitRects: [] };
    }

    // Determine symmetric scale around 0
    let maxAbs = 1;
    for(const p of series) maxAbs = Math.max(maxAbs, Math.abs(p.value));
    const topVal = maxAbs;
    const botVal = -maxAbs;

    const yAt = (v)=>{
      const t = (v - botVal) / (topVal - botVal);
      return (h-padB) - innerH * t;
    };

    const yZero = yAt(0);

    // Labels left
    ctx.fillStyle = "rgba(255,255,255,0.60)";
    ctx.font = "12px -apple-system, Segoe UI, Roboto, Arial";

    // show a few ticks: +max, 0, -max
    ctx.fillText(fmtMoney(topVal), 10, padT + 12);
    ctx.fillText(fmtMoney(0), 10, yZero + 4);
    ctx.fillText(fmtMoney(botVal), 10, (h-padB));

    // Zero line
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.moveTo(padL, yZero);
    ctx.lineTo(w-padR, yZero);
    ctx.stroke();

    // Bars
    const n = series.length;
    const gap = 2; // tight like TradeZella
    const barW = Math.max(2, Math.floor(innerW / n) - gap);

    const hitRects = [];

    for(let i=0;i<n;i++){
      const p = series[i];
      const x = padL + i * (barW + gap);

      // center bars if rounding leaves slack
      // (optional – keep simple)
      const v = p.value;

      const yV = yAt(v);
      const yTop = Math.min(yV, yZero);
      const yBot = Math.max(yV, yZero);
      const bh = Math.max(1, yBot - yTop);

      const isPos = v >= 0;
      const col = isPos ? "rgba(0,230,118,0.85)" : "rgba(255,82,82,0.85)";

      ctx.fillStyle = col;
      ctx.fillRect(x, yTop, barW, bh);

      // store hit rect
      hitRects.push({
        x, y: yTop, w: barW, h: bh,
        date: p.date,
        value: v,
        color: isPos ? "#00e676" : "#ff5252"
      });
    }

    // X axis labels (sparse)
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "12px -apple-system, Segoe UI, Roboto, Arial";
    const labelCount = 4;
    for(let i=0;i<labelCount;i++){
      const idx = Math.round((n-1) * (i/(labelCount-1)));
      const d = series[idx].date;
      const txt = _fmtShortDate(d); // 09/11/25 style
      const tx = padL + idx * (barW + gap);
      const m = ctx.measureText(txt);
      const x = clamp(tx - m.width/2, padL, w-padR-m.width);
      ctx.fillText(txt, x, h-18);
    }

    return { hitRects };
  }

  // ---------- Hover interaction ----------
  let _dailyBarHover = { rects: [], bound: false };

  function wireDailyBarInteractions(canvas){
    if(_dailyBarHover.bound) return;
    _dailyBarHover.bound = true;

    const toCanvasXY = (ev)=>{
      const r = canvas.getBoundingClientRect();
      const x = ev.clientX - r.left;
      const y = ev.clientY - r.top;
      return { x, y, clientX: ev.clientX, clientY: ev.clientY };
    };

    canvas.addEventListener("mousemove", (ev)=>{
      if(!_dailyBarHover.rects || _dailyBarHover.rects.length === 0){
        hideBarTooltip();
        return;
      }
      const p = toCanvasXY(ev);

      // find rect
      let hit = null;
      for(const r of _dailyBarHover.rects){
        if(p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h){
          hit = r; break;
        }
      }

      if(hit){
        const txt = `${_fmtShortDate(hit.date)}: ${fmtMoney(hit.value)}`;
        showBarTooltip(p.clientX, p.clientY, hit.color, txt);
      } else {
        hideBarTooltip();
      }
    });

    canvas.addEventListener("mouseleave", ()=>{
      hideBarTooltip();
    });
  }

  // ---------- Public redraw hook ----------
  function drawDailyBarsFromMeta(meta){
    const c = document.getElementById("dailyBarCanvas");
    if(!c) return;
    const out = drawDailyBarChart(c, meta.stats.equityByDay);
    _dailyBarHover.rects = out.hitRects || [];
    wireDailyBarInteractions(c);
  }




  // =========================
  // Helpers
  // =========================
  const $ = (id) => document.getElementById(id);

  function showError(msg){
    const el = $("parseError");
    el.style.display = "block";
    el.innerHTML = msg;
  }
  function clearError(){
    const el = $("parseError");
    el.style.display = "none";
    el.innerHTML = "";
  }

  function normHeader(s){
    if(s === null || s === undefined) return "";
    return String(s)
      .toLowerCase()
      .trim()
      .replace(/\u00a0/g, " ")
      .replace(/[()\[\]{}:;,.\/\\|'"!?+=-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function toNum(v){
    if(v === null || v === undefined || v === "") return 0;
    if(typeof v === "number" && isFinite(v)) return v;
    const s = String(v).replace(/\s/g,"").replace(",",".");
    const n = Number(s);
    return isFinite(n) ? n : 0;
  }

  function excelDateToJSDate(excelSerial){
    const o = XLSX.SSF.parse_date_code(excelSerial);
    if(!o) return null;
    return new Date(Date.UTC(o.y, o.m - 1, o.d, o.H || 0, o.M || 0, Math.floor(o.S || 0)));
  }

  function parseDateTime(v){
    if(v === null || v === undefined || v === "") return null;

    if(v instanceof Date && !isNaN(v)) return v;

    if(typeof v === "number" && isFinite(v)){
      const d = excelDateToJSDate(v);
      if(d && !isNaN(d)) return d;
    }

    const s = String(v).trim();
    const m = s.match(/^(\d{4})[.\-\/](\d{2})[.\-\/](\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?/);
    if(m){
      const yy=+m[1], mm=+m[2]-1, dd=+m[3], hh=+m[4], mi=+m[5], ss=+(m[6]||0);
      const dt = new Date(yy,mm,dd,hh,mi,ss);
      if(!isNaN(dt)) return dt;
    }

    const cleaned = s.replace(/\./g, "-").replace(" ", "T");
    const d2 = new Date(cleaned);
    if(!isNaN(d2)) return d2;

    return null;
  }

  function fmtDateTime(d){
    if(!d) return "-";
    const pad = (n)=>String(n).padStart(2,"0");
    const yy=d.getFullYear();
    const mm=pad(d.getMonth()+1);
    const dd=pad(d.getDate());
    const hh=pad(d.getHours());
    const mi=pad(d.getMinutes());
    const ss=pad(d.getSeconds());
    return `${yy}.${mm}.${dd} ${hh}:${mi}:${ss}`;
  }

  function fmtMoney(n){
    const v = Number(n || 0);
    const sign = v < 0 ? "-" : "";
    const abs = Math.abs(v);
    return `${sign}${abs.toFixed(2)} €`;
  }

  function fmtPrice(p){
    if(p === null || p === undefined || !isFinite(p)) return "-";
    const v = Number(p);
    const decimals = v >= 100 ? 2 : 5;
    return v.toFixed(decimals);
  }

  function clamp(x, a, b){ return Math.max(a, Math.min(b, x)); }

  function dateKeyFromDate(d){
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function parseISODateOnly(s){
    if(!s) return null;
    const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(!m) return null;
    const d = new Date(+m[1], +m[2]-1, +m[3]);
    return isNaN(d) ? null : d;
  }

  function toISODateInput(d){
    if(!d) return "";
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  // =========================
  // Column synonyms
  // =========================
  const SYN = {
    time:       ["time","zeit","date","datum"],
    symbol:     ["symbol","instrument"],
    type:       ["type","typ","side","richtung","direction"],
    volume:     ["volume","volumen","lots","lot","size","menge"],
    price:      ["price","preis","open price","close price","kurs"],
    profit:     ["profit","gewinn","pnl"],
    commission: ["commission","kommission","fee","fees","gebuehr","gebühr"],
    swap:       ["swap","rollover"],
    entryFlag:  ["entry","eintrag","einstieg"],
    order:      ["order","auftrag"],
    deal:       ["deal","transaktion"],
    position:   ["position","pos"],
    ticket:     ["ticket","nr","nummer"],
    sl:         ["s l","s/l","sl","stop loss","stoploss"],
    tp:         ["t p","t/p","tp","take profit","takeprofit"]
  };

  function headerScore(row){
    const cells = row.map(normHeader);
    const has = (k) => SYN[k].some(s => cells.includes(s));
    let score = 0;
    if(has("profit")) score += 3;
    if(has("symbol")) score += 3;
    if(has("type")) score += 2;
    if(has("time")) score += 2;
    if(has("volume")) score += 1;
    if(has("price")) score += 1;
    if(has("position") || has("order") || has("ticket") || has("deal")) score += 1;
    return score;
  }

  function buildColMap(headerRow){
    const map = {};
    const cells = headerRow.map(normHeader);

    function findCol(keys){
      for(const k of keys){
        const idx = cells.indexOf(k);
        if(idx !== -1) return idx;
      }
      return -1;
    }

    for(const key of Object.keys(SYN)){
      const idx = findCol(SYN[key]);
      if(idx !== -1) map[key] = idx;
    }

    const timeIdxs = [];
    cells.forEach((c,i)=>{ if(SYN.time.includes(c)) timeIdxs.push(i); });
    if(timeIdxs.length >= 2){
      map.time = timeIdxs[0];
      map.time2 = timeIdxs[1];
    }

    const priceIdxs = [];
    cells.forEach((c,i)=>{ if(SYN.price.includes(c)) priceIdxs.push(i); });
    if(priceIdxs.length >= 2){
      map.price = priceIdxs[0];
      map.price2 = priceIdxs[1];
    }

    return map;
  }

  function isTradeType(t){
    if(!t) return false;
    const s = String(t).toLowerCase();
    return (
      s.includes("buy") || s.includes("sell") ||
      s.includes("kaufen") || s.includes("verkaufen")
    );
  }

  function normalizeSide(t){
    const s = String(t || "").toLowerCase();
    if(s.includes("buy") || s.includes("kaufen")) return "BUY";
    if(s.includes("sell") || s.includes("verkaufen")) return "SELL";
    return String(t || "").toUpperCase();
  }

  // =========================
  // Sheet detection + parsing
  // =========================
  function readBestSheet(workbook){
    let best = {name:null, headerIndex:-1, score:-1, colMap:null, rows:null};

    for(const name of workbook.SheetNames){
      const ws = workbook.Sheets[name];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: "" });

      let localBest = { idx:-1, score:-1 };
      const limit = Math.min(rows.length, 90);

      for(let i=0;i<limit;i++){
        const r = rows[i];
        if(!r || r.length < 4) continue;
        const sc = headerScore(r);
        if(sc > localBest.score){
          localBest = { idx:i, score:sc };
        }
      }

      if(localBest.score > best.score){
        const colMap = buildColMap(rows[localBest.idx] || []);
        best = { name, headerIndex: localBest.idx, score: localBest.score, colMap, rows };
      }
    }

    return best;
  }

  function buildDealsFromRows(rows, headerIndex, colMap){
    const deals = [];

    for(let i = headerIndex + 1; i < rows.length; i++){
      const r = rows[i];
      if(!r || r.length < 4) continue;

      const type = colMap.type !== undefined ? r[colMap.type] : "";
      const symbol = colMap.symbol !== undefined ? r[colMap.symbol] : "";
      if(!isTradeType(type)) continue;
      if(!symbol || String(symbol).trim() === "") continue;

      const profit = colMap.profit !== undefined ? r[colMap.profit] : 0;

      const time = colMap.time !== undefined ? parseDateTime(r[colMap.time]) : null;
      const time2 = colMap.time2 !== undefined ? parseDateTime(r[colMap.time2]) : null;

      const price = colMap.price !== undefined ? toNum(r[colMap.price]) : 0;
      const price2 = colMap.price2 !== undefined ? toNum(r[colMap.price2]) : 0;

      const volume = colMap.volume !== undefined ? toNum(r[colMap.volume]) : 0;

      const commission = colMap.commission !== undefined ? toNum(r[colMap.commission]) : 0;
      const swap = colMap.swap !== undefined ? toNum(r[colMap.swap]) : 0;

      const entryFlag = colMap.entryFlag !== undefined ? String(r[colMap.entryFlag] || "").toLowerCase().trim() : "";

      const order = colMap.order !== undefined ? String(r[colMap.order] || "").trim() : "";
      const deal = colMap.deal !== undefined ? String(r[colMap.deal] || "").trim() : "";
      const position = colMap.position !== undefined ? String(r[colMap.position] || "").trim() : "";
      const ticket = colMap.ticket !== undefined ? String(r[colMap.ticket] || "").trim() : "";

      deals.push({
        time: time || time2,
        time2,
        symbol: String(symbol).trim(),
        side: normalizeSide(type),
        volume,
        price: price || price2,
        price2,
        pnl: toNum(profit),
        commission,
        swap,
        entryFlag,
        order,
        deal,
        position,
        ticket,
        _rowIndex: i
      });
    }

    return deals;
  }

  function groupDealsToTrades(deals){
    const groups = new Map();

    function pickKey(d){
      if(d.position) return "P:" + d.position;
      if(d.order) return "O:" + d.order;
      if(d.ticket) return "T:" + d.ticket;
      if(d.deal) return "D:" + d.deal;
      return "R:" + d._rowIndex;
    }

    for(const d of deals){
      const k = pickKey(d);
      if(!groups.has(k)) groups.set(k, []);
      groups.get(k).push(d);
    }

    const tradesClosed = [];
    const tradesOpen = [];

    for(const [k, arr] of groups.entries()){
      arr.sort((a,b)=> (a.time?.getTime() || 0) - (b.time?.getTime() || 0));

      let entryDeal = null;
      let exitDeal = null;

      const hasEntryFlag = arr.some(x => x.entryFlag);

      if(hasEntryFlag){
        entryDeal = arr.find(x => x.entryFlag.includes("in") || x.entryFlag.includes("ein"));
        exitDeal  = [...arr].reverse().find(x => x.entryFlag.includes("out") || x.entryFlag.includes("aus"));

        if(!entryDeal) entryDeal = arr[0];
        if(!exitDeal) exitDeal = arr.length > 1 ? arr[arr.length-1] : null;
      } else {
        entryDeal = arr[0];
        exitDeal = arr.length > 1 ? arr[arr.length-1] : null;
      }

      const openTime = entryDeal?.time || null;
      const closeTime = exitDeal?.time || null;

      let net = 0, fees = 0;
      for(const d of arr){
        net += (d.pnl || 0) + (d.commission || 0) + (d.swap || 0);
        fees += (d.commission || 0) + (d.swap || 0);
      }

      const trade = {
        id: k,
        symbol: entryDeal?.symbol || arr[0]?.symbol || "-",
        side: entryDeal?.side || arr[0]?.side || "-",
        lot: entryDeal?.volume || arr[0]?.volume || 0,
        openTime,
        closeTime,
        entryPrice: entryDeal?.price || 0,
        exitPrice: exitDeal ? (exitDeal?.price || null) : null,
        net,
        fees,
        legs: arr.length
      };

      const isClosed = !!exitDeal && (arr.length >= 2);
      if(isClosed) tradesClosed.push(trade);
      else tradesOpen.push(trade);
    }

    tradesClosed.sort((a,b)=> (b.closeTime?.getTime()||0) - (a.closeTime?.getTime()||0));
    tradesOpen.sort((a,b)=> (b.openTime?.getTime()||0) - (a.openTime?.getTime()||0));

    return { tradesClosed, tradesOpen };
  }

  // =========================
  // Stats + equity
  // =========================
  function computeStats(tradesClosed){
    const stats = {
      totalTrades: tradesClosed.length,
      wins: 0,
      losses: 0,
      breakeven: 0,
      net: 0,
      grossWin: 0,
      grossLoss: 0,
      avgWin: 0,
      avgLoss: 0,
      winRate: 0,
      profitFactor: 0,
      avgWinLoss: 0,
      expectancy: 0,
      maxWinStreak: 0,
      maxLossStreak: 0,
      dayWinRate: 0,
      winDays: 0,
      lossDays: 0,
      beDays: 0,
      tradingDays: 0,
      ddAbs: 0,
      ddPct: 0,
      equityByDay: [],
      dailyMap: new Map()
    };

    const chrono = [...tradesClosed].sort((a,b)=>{
      const ta = (a.closeTime || a.openTime)?.getTime() || 0;
      const tb = (b.closeTime || b.openTime)?.getTime() || 0;
      return ta - tb;
    });

    let curW = 0, curL = 0;

    for(const t of chrono){
      const p = t.net || 0;
      stats.net += p;

      if(p > 0){
        stats.wins++;
        stats.grossWin += p;
        curW++;
        curL = 0;
        stats.maxWinStreak = Math.max(stats.maxWinStreak, curW);
      } else if(p < 0){
        stats.losses++;
        stats.grossLoss += Math.abs(p);
        curL++;
        curW = 0;
        stats.maxLossStreak = Math.max(stats.maxLossStreak, curL);
      } else {
        stats.breakeven++;
        curW = 0; curL = 0;
      }

      const d = t.closeTime || t.openTime;
      if(d){
        const key = dateKeyFromDate(d);
        stats.dailyMap.set(key, (stats.dailyMap.get(key) || 0) + p);
      }
    }

    const counted = stats.wins + stats.losses;
    stats.winRate = counted > 0 ? (stats.wins / counted) * 100 : 0;

    stats.avgWin = stats.wins > 0 ? (stats.grossWin / stats.wins) : 0;
    stats.avgLoss = stats.losses > 0 ? -(stats.grossLoss / stats.losses) : 0;

    stats.profitFactor = stats.grossLoss > 0 ? (stats.grossWin / stats.grossLoss) : (stats.grossWin > 0 ? Infinity : 0);
    stats.avgWinLoss = Math.abs(stats.avgLoss) > 0 ? (stats.avgWin / Math.abs(stats.avgLoss)) : (stats.avgWin > 0 ? Infinity : 0);
    stats.expectancy = counted > 0 ? (stats.net / counted) : 0;

    const keys = [...stats.dailyMap.keys()].sort();
    stats.tradingDays = keys.length;

    let cum = 0;
    let peak = 0;
    let maxDD = 0;

    for(const k of keys){
      const dayPnl = stats.dailyMap.get(k) || 0;
      cum += dayPnl;

      const parts = k.split("-");
      const dt = new Date(+parts[0], +parts[1]-1, +parts[2]);

      stats.equityByDay.push({ dateKey: k, date: dt, dayPnl, cum });

      peak = Math.max(peak, cum);
      maxDD = Math.max(maxDD, (peak - cum));

      if(dayPnl > 0) stats.winDays++;
      else if(dayPnl < 0) stats.lossDays++;
      else stats.beDays++;
    }

    stats.ddAbs = maxDD;
    stats.ddPct = peak > 0 ? (maxDD / peak) * 100 : 0;

    const dayCounted = stats.winDays + stats.lossDays;
    stats.dayWinRate = dayCounted > 0 ? (stats.winDays / dayCounted) * 100 : 0;

    return stats;
  }

  // =========================
  // Canvas sizing + chart
  // =========================
  function resizeCanvasToDisplaySize(canvas, targetCssHeight=320){
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const cssW = Math.max(200, Math.floor(rect.width));
    const cssH = Math.max(240, Math.floor(targetCssHeight));

    canvas.style.height = cssH + "px";

    const needW = Math.floor(cssW * dpr);
    const needH = Math.floor(cssH * dpr);

    if(canvas.width !== needW || canvas.height !== needH){
      canvas.width = needW;
      canvas.height = needH;
      return { dpr, w: needW, h: needH, cssW, cssH };
    }
    return { dpr, w: canvas.width, h: canvas.height, cssW, cssH };
  }

  function drawEquityChart(canvas, equityByDay){
    const size = resizeCanvasToDisplaySize(canvas, 320);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(size.dpr, size.dpr);

    const w = size.cssW;
    const h = size.cssH;

    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = "#141414";
    ctx.fillRect(0,0,w,h);

    const padL=56, padR=18, padT=18, padB=44;

    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    const gridY = 5;
    for(let i=0;i<=gridY;i++){
      const y = padT + (h-padT-padB)*(i/gridY);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w-padR, y);
      ctx.stroke();
    }

    if(!equityByDay || equityByDay.length < 2){
      ctx.fillStyle = "rgba(255,255,255,0.70)";
      ctx.font = "14px -apple-system, Segoe UI, Roboto, Arial";
      ctx.fillText("Zu wenig Daten für eine Kurve.", padL, padT + 30);
      return;
    }

    const ys = equityByDay.map(p => p.cum);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const span = (maxY - minY) || 1;

    function xAt(i){
      return padL + (w-padL-padR) * (i/(equityByDay.length-1));
    }
    function yAt(v){
      const t = (v - minY) / span;
      return (h-padB) - (h-padT-padB) * t;
    }

    ctx.fillStyle = "rgba(255,255,255,0.70)";
    ctx.font = "12px -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText(fmtMoney(maxY), 10, padT + 12);
    ctx.fillText(fmtMoney(minY), 10, (h-padB));

    ctx.strokeStyle = "rgba(0,230,118,0.85)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    for(let i=0;i<equityByDay.length;i++){
      const x = xAt(i);
      const y = yAt(equityByDay[i].cum);
      if(i===0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
    }
    ctx.stroke();

    ctx.lineTo(xAt(equityByDay.length-1), h-padB);
    ctx.lineTo(xAt(0), h-padB);
    ctx.closePath();
    ctx.fillStyle = "rgba(0,230,118,0.08)";
    ctx.fill();

    const start = equityByDay[0].date;
    const end = equityByDay[equityByDay.length-1].date;
    const fmt = (d)=>`${String(d.getDate()).padStart(2,"0")}.${String(d.getMonth()+1).padStart(2,"0")}.${d.getFullYear()}`;

    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillText(fmt(start), padL, h-18);

    const endTxt = fmt(end);
    const m = ctx.measureText(endTxt);
    ctx.fillText(endTxt, (w-padR) - m.width, h-18);
  }

  // =========================
  // Heatmap (last 14 days)
  // =========================
  function renderHeatmap(container, dailyMap){
    if(!container) return;
    container.innerHTML = "";

    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 13);

    const keys = [];
    for(let i=0;i<14;i++){
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      keys.push({ d, k: dateKeyFromDate(d) });
    }

    const rangeLabel = `${String(start.getDate()).padStart(2,"0")}.${String(start.getMonth()+1).padStart(2,"0")} – ${String(today.getDate()).padStart(2,"0")}.${String(today.getMonth()+1).padStart(2,"0")}`;
    const hr = $("heatRange");
    if(hr) hr.textContent = rangeLabel;

    let maxAbs = 1;
    for(const item of keys){
      const v = dailyMap.get(item.k) || 0;
      maxAbs = Math.max(maxAbs, Math.abs(v));
    }

    for(const item of keys){
      const pnl = dailyMap.get(item.k);
      const box = document.createElement("div");
      box.className = "daybox";

      if(pnl === undefined){
        box.style.background = "rgba(255,255,255,0.04)";
      } else {
        const a = 0.10 + 0.55 * (Math.abs(pnl)/maxAbs);
        const alpha = clamp(a, 0.10, 0.70);

        if(pnl > 0) box.style.background = `rgba(0,230,118,${alpha})`;
        else if(pnl < 0) box.style.background = `rgba(255,82,82,${alpha})`;
        else box.style.background = "rgba(255,255,255,0.06)";
      }

      const dd = item.d.getDate();
      const mm = item.d.getMonth()+1;

      const lbl = document.createElement("span");
      lbl.textContent = `${String(dd).padStart(2,"0")}.${String(mm).padStart(2,"0")}`;
      box.appendChild(lbl);

      const pnlEl = document.createElement("div");
      pnlEl.className = "pnl";
      pnlEl.textContent = (pnl === undefined) ? "" : fmtMoney(pnl);
      box.appendChild(pnlEl);

      container.appendChild(box);
    }
  }

  // =========================
  // Monthly Calendar (TradeZella-like)
  // =========================
  function buildDailyDetailsFromTrades(tradesClosed){
    const map = new Map();

    for(const t of tradesClosed){
      const d = t.closeTime || t.openTime;
      if(!d) continue;

      const key = dateKeyFromDate(d);

      if(!map.has(key)) map.set(key, { pnl:0, trades:0, wins:0, losses:0, be:0 });

      const obj = map.get(key);
      const p = Number(t.net || 0);

      obj.pnl += p;
      obj.trades += 1;

      if(p > 0) obj.wins += 1;
      else if(p < 0) obj.losses += 1;
      else obj.be += 1;
    }
    return map;
  }

  function renderMonthlyCalendar(monthDate, dailyDetails, selectedKey){
    const grid = $("tzCalGrid");
    if(!grid) return;

    const lbl = $("tzMonthLabel");
    const pnlEl = $("tzMonthPnl");
    const daysEl = $("tzMonthDays");

    const year = monthDate.getFullYear();
    const month = monthDate.getMonth(); // 0-11
    const first = new Date(year, month, 1);

    const monthName = first.toLocaleString("en-US", { month:"long", year:"numeric" });
    if(lbl) lbl.textContent = monthName;

    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());

    const cells = [];
    for(let i=0;i<42;i++){
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      cells.push(d);
    }

    let monthPnl = 0;
    let tradingDays = 0;
    let maxAbsDayPnl = 1;

    for(const [key, v] of dailyDetails.entries()){
      const parts = key.split("-").map(Number);
      const yy = parts[0], mm = parts[1]-1;
      if(yy === year && mm === month){
        monthPnl += v.pnl;
        if(v.trades > 0) tradingDays += 1;
        maxAbsDayPnl = Math.max(maxAbsDayPnl, Math.abs(v.pnl));
      }
    }

    if(pnlEl){
      pnlEl.textContent = fmtMoney(monthPnl);
      pnlEl.className = "tz-cal-pill-val " + (monthPnl >= 0 ? "text-green" : "text-red");
    }
    if(daysEl) daysEl.textContent = String(tradingDays);

    grid.innerHTML = "";

    for(const d of cells){
      const key = dateKeyFromDate(d);

      const isOutside = d.getMonth() !== month;
      const info = dailyDetails.get(key);

      const cell = document.createElement("div");
      cell.className = "tz-cal-cell" + (isOutside ? " is-outside" : "");
      cell.dataset.dateKey = key;

      if(selectedKey && selectedKey === key){
        cell.classList.add("tz-cal-selected");
      }

      if(!info || info.trades === 0){
        cell.classList.add("tz-cal-empty");
      } else {
        const pnl = info.pnl;
        const a = 0.10 + 0.55 * (Math.abs(pnl)/maxAbsDayPnl);
        const alpha = clamp(a, 0.10, 0.70);

        if(pnl > 0){
          cell.style.background = `rgba(0,230,118,${alpha})`;
          cell.style.borderColor = "rgba(0,230,118,0.35)";
        } else if(pnl < 0){
          cell.style.background = `rgba(255,82,82,${alpha})`;
          cell.style.borderColor = "rgba(255,82,82,0.35)";
        } else {
          cell.style.background = "rgba(255,255,255,0.06)";
        }
      }

      const day = document.createElement("div");
      day.className = "tz-cal-day";
      day.textContent = String(d.getDate());
      cell.appendChild(day);

      const pnlDiv = document.createElement("div");
      pnlDiv.className = "tz-cal-pnl";

      const sub = document.createElement("div");
      sub.className = "tz-cal-sub";

      if(!info || info.trades === 0){
        pnlDiv.textContent = "";
        sub.innerHTML = "";
      } else {
        pnlDiv.textContent = fmtMoney(info.pnl);

        const denom = (info.wins + info.losses);
        const winPct = denom > 0 ? (info.wins / denom) * 100 : 0;

        sub.innerHTML = `
          <div><b>${info.trades}</b> trades</div>
          <div><b>${winPct.toFixed(1)}%</b> win</div>
        `;
      }

      cell.appendChild(pnlDiv);
      cell.appendChild(sub);

      cell.addEventListener("click", ()=>{
        if(typeof onCalendarDayClick === "function"){
          onCalendarDayClick(key);
        }
      });

      grid.appendChild(cell);
    }
  }

  let tzMonthState = null;
  let tzDailyDetails = null;
  let tzCalendarWired = false;
  let selectedDayKey = null;

  function initMonthlyCalendar(tradesClosed){
    tzDailyDetails = buildDailyDetailsFromTrades(tradesClosed);

    let latest = null;
    for(const t of tradesClosed){
      const d = t.closeTime || t.openTime;
      if(d && (!latest || d.getTime() > latest.getTime())) latest = d;
    }
    const base = latest || new Date();
    tzMonthState = new Date(base.getFullYear(), base.getMonth(), 1);

    renderMonthlyCalendar(tzMonthState, tzDailyDetails, selectedDayKey);

    if(!tzCalendarWired){
      const prev = $("tzPrevMonth");
      const next = $("tzNextMonth");
      const now  = $("tzThisMonth");

      if(prev) prev.onclick = () => {
        tzMonthState = new Date(tzMonthState.getFullYear(), tzMonthState.getMonth()-1, 1);
        renderMonthlyCalendar(tzMonthState, tzDailyDetails, selectedDayKey);
      };
      if(next) next.onclick = () => {
        tzMonthState = new Date(tzMonthState.getFullYear(), tzMonthState.getMonth()+1, 1);
        renderMonthlyCalendar(tzMonthState, tzDailyDetails, selectedDayKey);
      };
      if(now) now.onclick = () => {
        const d = new Date();
        tzMonthState = new Date(d.getFullYear(), d.getMonth(), 1);
        renderMonthlyCalendar(tzMonthState, tzDailyDetails, selectedDayKey);
      };

      tzCalendarWired = true;
    }
  }

  // =========================
  // Table render
  // =========================
function renderTableToBody(tbody, trades, mode) {
  tbody.innerHTML = "";

  for (const t of trades) {
    const tr = document.createElement("tr");
    
    // Bestimmung der Farbe für den Gewinn/Verlust
    const pnlClass = t.net > 0 ? "text-green" : (t.net < 0 ? "text-red" : "");
    
    // Datum formatieren (nur das Datum ohne Uhrzeit für die kompakte Ansicht)
    const d = t.closeTime || t.openTime;
    const dateStr = d ? `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}` : "-";

    tr.innerHTML = `
      <td style="color: var(--muted); font-size: 12px;">${dateStr}</td>
      <td style="font-weight: 800; letter-spacing: 0.5px;">${t.symbol}</td>
      <td class="${pnlClass}" style="font-weight: 900; text-align: right;">
        ${fmtMoney(t.net)}
      </td>
    `;
    tbody.appendChild(tr);
  }
}

  function renderTable(trades, mode){
    const tbody = $("tableBody");
    renderTableToBody(tbody, trades, mode);
  }

  // =========================
  // Tabs
  // =========================
  function setActiveTab(which, meta){
    const recent = $("tabRecent");
    const open = $("tabOpen");

    if(which === "open"){
      open.classList.add("active");
      recent.classList.remove("active");
      renderTable(meta.open, "open");
    } else {
      recent.classList.add("active");
      open.classList.remove("active");
      renderTable(meta.closed, "recent");
    }
  }

  // =========================
  // Filters
  // =========================
  function getFilters(){
    const from = parseISODateOnly($("filterFrom")?.value);
    const to = parseISODateOnly($("filterTo")?.value);
    const symbol = ($("filterSymbol")?.value || "").trim();
    const side = ($("filterSide")?.value || "").trim();
    const outcome = ($("filterOutcome")?.value || "").trim();
    return { from, to, symbol, side, outcome };
  }

  function tradeMatchesFilters(t, f){
    if(f.symbol && t.symbol !== f.symbol) return false;
    if(f.side && t.side !== f.side) return false;

    if(f.outcome){
      if(f.outcome === "WIN" && !(t.net > 0)) return false;
      if(f.outcome === "LOSS" && !(t.net < 0)) return false;
      if(f.outcome === "BE" && !(t.net === 0)) return false;
    }

    if(f.from || f.to){
      const d = t.closeTime || t.openTime;
      if(!d) return false;

      const dayOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());

      if(f.from){
        const fromDay = new Date(f.from.getFullYear(), f.from.getMonth(), f.from.getDate());
        if(dayOnly < fromDay) return false;
      }
      if(f.to){
        const toDay = new Date(f.to.getFullYear(), f.to.getMonth(), f.to.getDate());
        if(dayOnly > toDay) return false;
      }
    }

    return true;
  }

  function openTradeMatchesFilters(t, f){
    if(f.symbol && t.symbol !== f.symbol) return false;
    if(f.side && t.side !== f.side) return false;
    return true;
  }

  function populateSymbolSelect(allTradesClosed, allTradesOpen){
    const sel = $("filterSymbol");
    if(!sel) return;

    const current = sel.value || "";
    const set = new Set();

    for(const t of allTradesClosed) if(t.symbol) set.add(t.symbol);
    for(const t of allTradesOpen) if(t.symbol) set.add(t.symbol);

    const arr = [...set].sort((a,b)=>a.localeCompare(b));
    sel.innerHTML = `<option value="">All</option>` + arr.map(s=>`<option value="${s}">${s}</option>`).join("");

    if(arr.includes(current)) sel.value = current;
  }

  function resetAllFilters(){
    if($("filterFrom")) $("filterFrom").value = "";
    if($("filterTo")) $("filterTo").value = "";
    if($("filterSymbol")) $("filterSymbol").value = "";
    if($("filterSide")) $("filterSide").value = "";
    if($("filterOutcome")) $("filterOutcome").value = "";
    selectedDayKey = null;
  }

  function clearDateFilters(){
    if($("filterFrom")) $("filterFrom").value = "";
    if($("filterTo")) $("filterTo").value = "";
    selectedDayKey = null;
  }

  function setDayFilterByKey(key){
    const parts = key.split("-").map(Number);
    if(parts.length !== 3) return;
    const d = new Date(parts[0], parts[1]-1, parts[2]);
    const iso = toISODateInput(d);
    if($("filterFrom")) $("filterFrom").value = iso;
    if($("filterTo")) $("filterTo").value = iso;
    selectedDayKey = key;

    if(tzMonthState){
      tzMonthState = new Date(d.getFullYear(), d.getMonth(), 1);
    }
  }

  // =========================
  // Day drilldown
  // =========================
  function showDayDetails(dayKey, trades){
    const wrap = $("dayDetails");
    if(!wrap) return;

    if(!dayKey){
      wrap.style.display = "none";
      return;
    }

    const list = trades.filter(t=>{
      const d = t.closeTime || t.openTime;
      if(!d) return false;
      return dateKeyFromDate(d) === dayKey;
    });

    if(list.length === 0){
      wrap.style.display = "none";
      return;
    }

    const net = list.reduce((a,t)=>a+(t.net||0),0);
    let w=0,l=0;
    for(const t of list){
      if(t.net>0) w++;
      else if(t.net<0) l++;
    }
    const denom = w+l;
    const winPct = denom>0 ? (w/denom)*100 : 0;

    $("dayDetailsLabel").textContent = dayKey;
    $("dayDetailsNet").textContent = fmtMoney(net);
    $("dayDetailsNet").className = (net>=0 ? "text-green" : "text-red");
    $("dayDetailsTrades").textContent = String(list.length);
    $("dayDetailsWin").textContent = `${winPct.toFixed(1)}%`;

    renderTableToBody($("dayTableBody"), list.sort((a,b)=>(b.closeTime?.getTime()||0)-(a.closeTime?.getTime()||0)), "recent");
    wrap.style.display = "block";
  }

  // Calendar click hook
  function onCalendarDayClick(key){
    if(!lastMetaOriginal) return;
    setDayFilterByKey(key);
    rebuildFromFilters();
    const el = $("dayDetails");
    if(el){
      el.scrollIntoView({ behavior:"smooth", block:"start" });
    }
  }

  // =========================
  // UI update
  // =========================
  function updateUI(meta){
    $("dashboard").style.display = "block";

    $("sourceInfo").innerText = `${meta.sheetName} (Header-Zeile: ${meta.headerIndex+1}, Score: ${meta.score})`;

    $("closedCount").innerText = meta.closed.length;
    $("openCount").innerText = meta.open.length;
    $("daysCount").innerText = meta.stats.tradingDays;

    const netEl = $("netProfit");
    netEl.innerText = fmtMoney(meta.stats.net);
    netEl.className = "stat-value " + (meta.stats.net >= 0 ? "text-green" : "text-red");

    $("grossWin").innerText = fmtMoney(meta.stats.grossWin);
    $("grossLoss").innerText = fmtMoney(meta.stats.grossLoss).replace("-", "");

    $("ddChip").innerText = `DD: ${fmtMoney(meta.stats.ddAbs).replace("-", "")} (${meta.stats.ddPct.toFixed(1)}%)`;

    $("winRate").innerText = `${meta.stats.winRate.toFixed(2)}%`;
    $("wins").innerText = meta.stats.wins;
    $("losses").innerText = meta.stats.losses;
    $("breakeven").innerText = meta.stats.breakeven;

    $("streakChip").innerText = `Max W/L: ${meta.stats.maxWinStreak} / ${meta.stats.maxLossStreak}`;

    $("profitFactor").innerText = (meta.stats.profitFactor === Infinity) ? "∞" : meta.stats.profitFactor.toFixed(2);
    $("expectancy").innerText = fmtMoney(meta.stats.expectancy);

    $("avgWin").innerText = fmtMoney(meta.stats.avgWin);
    $("avgLoss").innerText = fmtMoney(meta.stats.avgLoss);
    $("avgWinLoss").innerText = (meta.stats.avgWinLoss === Infinity) ? "∞" : meta.stats.avgWinLoss.toFixed(2);

    $("dayWinRate").innerText = `${meta.stats.dayWinRate.toFixed(2)}%`;
    $("winDays").innerText = meta.stats.winDays;
    $("lossDays").innerText = meta.stats.lossDays;
    $("beDays").innerText = meta.stats.beDays;

    drawEquityChart($("equityCanvas"), meta.stats.equityByDay);
    renderHeatmap($("heatmap"), meta.stats.dailyMap);
    initMonthlyCalendar(meta.closed);

    if(selectedDayKey){
      renderMonthlyCalendar(tzMonthState || new Date(), tzDailyDetails || new Map(), selectedDayKey);
    }

    showDayDetails(selectedDayKey, meta.closed);
// ✅ HIER rein
  drawDailyBarsFromMeta(meta);
    setActiveTab(activeTab, meta);
  }

  // =========================
  // Meta state
  // =========================
  let lastMetaOriginal = null;
  let lastMeta = null;
  let activeTab = "recent";

  function rebuildFromFilters(){
    if(!lastMetaOriginal) return;

    const f = getFilters();

    const closed = lastMetaOriginal.closed.filter(t => tradeMatchesFilters(t, f));
    const open = lastMetaOriginal.open.filter(t => openTradeMatchesFilters(t, f));
    const stats = computeStats(closed);

    lastMeta = {
      sheetName: lastMetaOriginal.sheetName,
      headerIndex: lastMetaOriginal.headerIndex,
      score: lastMetaOriginal.score,
      closed,
      open,
      stats
    };

    updateUI(lastMeta);
  }
  
  


  // =========================
  // Tabs
  // =========================
  $("tabRecent").addEventListener("click", ()=>{
    activeTab = "recent";
    if(lastMeta) setActiveTab("recent", lastMeta);
  });
  $("tabOpen").addEventListener("click", ()=>{
    activeTab = "open";
    if(lastMeta) setActiveTab("open", lastMeta);
  });

  // =========================
  // Filter events
  // =========================
  function wireFilterEvents(){
    const ids = ["filterFrom","filterTo","filterSymbol","filterSide","filterOutcome"];
    for(const id of ids){
      const el = $(id);
      if(!el) continue;
      el.addEventListener("change", ()=>{
        if(id === "filterFrom" || id === "filterTo"){
          const f = getFilters();
          if(f.from && f.to && toISODateInput(f.from) === toISODateInput(f.to)){
            selectedDayKey = toISODateInput(f.from);
          } else {
            selectedDayKey = null;
          }
        } else {
          selectedDayKey = null;
        }
        rebuildFromFilters();
      });
    }

    const btnReset = $("btnResetFilters");
    if(btnReset) btnReset.addEventListener("click", ()=>{
      resetAllFilters();
      rebuildFromFilters();
    });

    const btnClearDates = $("btnClearDates");
    if(btnClearDates) btnClearDates.addEventListener("click", ()=>{
      clearDateFilters();
      rebuildFromFilters();
    });

    const btnClearDay = $("btnClearDay");
    if(btnClearDay) btnClearDay.addEventListener("click", ()=>{
      clearDateFilters();
      rebuildFromFilters();
    });
  }
  wireFilterEvents();

  // =========================
  // Resize redraw
  // =========================
  window.addEventListener("resize", ()=>{
    if(lastMeta){
      drawEquityChart($("equityCanvas"), lastMeta.stats.equityByDay);
	  
	    // ✅ HIER rein
    drawDailyBarsFromMeta(lastMeta);
    }
  });
  
// =========================
// Speichern & Laden (LocalStorage)
// =========================

function saveToLocalStorage(meta) {
  try {
    localStorage.setItem("tradezellaLastMeta", JSON.stringify(meta));
  } catch (e) {
    console.error("Speichern fehlgeschlagen:", e);
  }
}

// Diese Funktion stellt sicher, dass Strings wieder zu Date-Objekten werden
function restoreDates(trades) {
  return trades.map(t => {
    if (t.openTime) t.openTime = new Date(t.openTime);
    if (t.closeTime) t.closeTime = new Date(t.closeTime);
    return t;
  });
}

// =========================
// File input handler (Update mit Auto-Save)
// =========================
$("fileInput").addEventListener("change", function(e) {
  clearError();
  const file = e.target.files[0];
  if (!file) return;
  $("fileName").innerText = file.name;

  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const data = new Uint8Array(ev.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const best = readBestSheet(workbook);

      if (!best || !best.rows || best.headerIndex < 0 || best.score < 6) {
        showError("Tabelle nicht erkannt. Bitte MT5 Open-XML Report nutzen.");
        return;
      }

      const deals = buildDealsFromRows(best.rows, best.headerIndex, best.colMap);
      const grouped = groupDealsToTrades(deals);

      lastMetaOriginal = {
        sheetName: best.name,
        headerIndex: best.headerIndex,
        score: best.score,
        closed: grouped.tradesClosed,
        open: grouped.tradesOpen
      };

      // SPEICHERN
      saveToLocalStorage(lastMetaOriginal);

      populateSymbolSelect(lastMetaOriginal.closed, lastMetaOriginal.open);
      selectedDayKey = null;
      rebuildFromFilters();

    } catch (err) {
      showError(`Fehler: ${err.message}`);
    }
  };
  reader.readAsArrayBuffer(file);
});

// =========================
// DOMContentLoaded Restore (Repariert)
// =========================
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("tradezellaLastMeta");
  if (!saved) return;

  try {
    const rawMeta = JSON.parse(saved);
    if (rawMeta && rawMeta.closed) {
      // WICHTIG: Datums-Strings zurück in Date-Objekte wandeln
      lastMetaOriginal = {
        ...rawMeta,
        closed: restoreDates(rawMeta.closed),
        open: restoreDates(rawMeta.open || [])
      };

      populateSymbolSelect(lastMetaOriginal.closed, lastMetaOriginal.open);
      rebuildFromFilters();
      console.log("✅ Daten erfolgreich wiederhergestellt");
    }
  } catch (err) {
    console.warn("Fehler beim Wiederherstellen aus Storage:", err);
  }
});

// Reset Button
document.getElementById("btnClearStorage").addEventListener("click", () => {
  if (confirm("Möchtest du wirklich alle Daten löschen?")) {
    localStorage.removeItem("tradezellaLastMeta");
    location.reload();
  }
});

