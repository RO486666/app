
/* ============================================================
   🧠 Trading-Quiz Engine (cleaned)
   ============================================================ */
(function () {
  const LS_KEY = "quizStats_v1";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function loadStats() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
  }
  function saveStats(s) {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  }

  const shuffle = (arr) => arr.map(v => [Math.random(), v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
  const pickRandom = (arr, n) => n >= arr.length ? shuffle(arr) : shuffle(arr).slice(0, n);
  const getAllTopics = () => Object.keys(window.QUIZ_DB?.topics || {});
  function collectQuestionsByTopics(topics){
    const all = [];
    topics.forEach(t => (window.QUIZ_DB.topics[t] || []).forEach(q => all.push({...q,_topic:t})));
    return all;
  }

  // ===== State =====
  const state = {
    mode: "schnelltest",
    selectedTopics: [],
    questionCount: 15,
    deck: [],
    i: 0,
    score: 0,
    answered: false
  };

  // ===== UI Build =====
  function mount(container) {
    const host = typeof container === "string" ? $(container) : container;
    if (!host) return;

    host.innerHTML = `
      <div class="stats-box">
        <h3>📘 Trading-Theorieprüfung</h3>

        <div id="quizSetup">
          <label style="display:block; margin:8px 0 4px;">Modus:</label>
          <select id="quizMode" class="input" style="width:100%;">
            <option value="schnelltest">Schnelltest (Zufallsmix)</option>
            <option value="themen">Themen wählen</option>
          </select>

          <div id="topicChooser" style="display:none; margin-top:10px;">
            <label style="display:block; margin-bottom:6px;">Themen auswählen:</label>
            <div id="topicList" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
          </div>

          <div style="display:flex; gap:10px; margin-top:10px; align-items:center;">
            <label>Fragenanzahl:</label>
            <input id="questionCount" type="number" min="5" max="100" value="15" class="input" style="width:90px;">
          </div>

          <button id="startQuizBtn" style="margin-top:12px; background:#0077cc; color:white; padding:10px; border:none; border-radius:8px; font-weight:bold; width:100%;">🚀 Prüfung starten</button>
        </div>

        <div id="quizRun" style="display:none; margin-top:12px;">
          <div id="quizProgress" style="color:#aaa; margin-bottom:6px;"></div>
          <div id="quizQuestion" style="font-weight:bold; margin-bottom:8px;"></div>
          <div id="quizAnswers" style="display:flex; flex-direction:column; gap:8px;"></div>

          <div id="quizExplain" style="display:none; margin-top:10px; padding:10px; border-radius:8px; background:#222; color:#ccc;"></div>

          <div style="display:flex; gap:8px; margin-top:12px;">
            <button id="revealBtn" style="flex:1; background:#444; color:white; border:none; border-radius:6px; padding:8px;">🔎 Lösung anzeigen</button>
            <button id="nextBtn" style="flex:1; background:#00aa44; color:white; border:none; border-radius:6px; padding:8px;">Weiter ➡️</button>
          </div>
        </div>

        <div id="quizResult" style="display:none; margin-top:12px;">
          <div id="quizScore" style="font-size:18px; font-weight:bold;"></div>
          <div id="quizBadge" style="margin-top:6px;"></div>
          <button id="againBtn" style="margin-top:12px; background:#0077cc; color:white; padding:10px; border:none; border-radius:8px; font-weight:bold; width:100%;">🔁 Nochmal</button>
        </div>
      </div>
    `;

    // Topics rendern
    const topicListEl = $("#topicList", host);
    getAllTopics().forEach(t => {
      const id = "topic_" + t.replace(/\W+/g, "_");
      const wrap = document.createElement("label");
      wrap.style.display = "inline-flex";
      wrap.style.alignItems = "center";
      wrap.style.gap = "6px";
      wrap.innerHTML = `<input type="checkbox" id="${id}" value="${t}"> ${t}`;
      topicListEl.appendChild(wrap);
    });

    // Events
    $("#quizMode", host).addEventListener("change", (e) => {
      state.mode = e.target.value;
      $("#topicChooser", host).style.display = state.mode === "themen" ? "block" : "none";
    });
    $("#startQuizBtn", host).addEventListener("click", () => startQuiz(host));
    $("#revealBtn", host).addEventListener("click", () => reveal(host));
    $("#nextBtn", host).addEventListener("click", () => next(host));
    $("#againBtn", host).addEventListener("click", () => reset(host));
  }

  function startQuiz(host) {
    state.questionCount = Math.max(5, Math.min(100, parseInt($("#questionCount", host).value || "15", 10)));

    if (state.mode === "themen") {
      state.selectedTopics = $$(`#topicList input[type="checkbox"]:checked`, host).map(cb => cb.value);
      if (!state.selectedTopics.length) { alert("Bitte wähle mindestens ein Thema aus."); return; }
    } else {
      state.selectedTopics = getAllTopics();
    }

    const pool = collectQuestionsByTopics(state.selectedTopics);
    if (!pool.length) { alert("Keine Fragen im Pool. Fülle zuerst die Datenbank."); return; }

    state.deck = pickRandom(pool, state.questionCount);
    state.i = 0; state.score = 0; state.answered = false;

    $("#quizSetup", host).style.display = "none";
    $("#quizResult", host).style.display = "none";
    $("#quizRun", host).style.display = "block";
    renderQuestion(host);
  }

  function renderQuestion(host) {
    const q = state.deck[state.i];
    $("#quizProgress", host).textContent = `Frage ${state.i + 1} von ${state.deck.length} — Thema: ${q._topic || "–"}`;
    $("#quizQuestion", host).textContent = q.q;

    const answersEl = $("#quizAnswers", host);
    answersEl.innerHTML = "";
    q.a.forEach((txt, idx) => {
      const btn = document.createElement("button");
      Object.assign(btn.style, {
        background:"#333", color:"#fff", border:"1px solid #444",
        borderRadius:"8px", padding:"10px", textAlign:"left", cursor:"pointer"
      });
      btn.textContent = txt;
      btn.onclick = () => choose(host, idx);
      answersEl.appendChild(btn);
    });

    const exp = $("#quizExplain", host);
    exp.style.display = "none";
    exp.innerHTML = "";
    state.answered = false;
  }

  function choose(host, idx) {
    if (state.answered) return;
    state.answered = true;
    const q = state.deck[state.i];
    const buttons = $$("#quizAnswers button", host);

    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) {
        b.style.background = "#14532d"; b.style.borderColor = "#22c55e";
      } else if (i === idx && idx !== q.correct) {
        b.style.background = "#641e1e"; b.style.borderColor = "#ef4444";
      }
    });

    if (idx === q.correct) state.score++;

    const explain = q.explain ? `<div><strong>Warum?</strong><br>${q.explain}</div>` : "";
    const exp = $("#quizExplain", host);
    exp.innerHTML = explain;
    exp.style.display = explain ? "block" : "none";
  }

  function reveal(host) {
    if (state.answered) return;
    const q = state.deck[state.i];
    $$("#quizAnswers button", host).forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) { b.style.background = "#14532d"; b.style.borderColor = "#22c55e"; }
    });
    state.answered = true;
    const exp = $("#quizExplain", host);
    exp.innerHTML = q.explain ? `<div><strong>Warum?</strong><br>${q.explain}</div>` : "";
    exp.style.display = q.explain ? "block" : "none";
  }

  function next(host) {
    if (state.i < state.deck.length - 1) { state.i++; renderQuestion(host); return; }

    $("#quizRun", host).style.display = "none";
    $("#quizResult", host).style.display = "block";

    const total = state.deck.length;
    const pct = Math.round((state.score / total) * 100);
    $("#quizScore", host).textContent = `Ergebnis: ${state.score}/${total} (${pct}%)`;

    let badge = "👶 ICT Rookie";
    if (pct >= 85) badge = "🦾 SMC/ICT Master";
    else if (pct >= 70) badge = "🎯 Solid Trader";
    else if (pct >= 50) badge = "📈 Aufsteiger";
    $("#quizBadge", host).textContent = `Badge: ${badge}`;

    const stats = loadStats();
    stats.history = stats.history || [];
    stats.history.push({ at:new Date().toISOString(), score:state.score, total, pct, topics:state.selectedTopics });
    stats.last = { score: state.score, total, pct };
    saveStats(stats);
  }

  // Soft-Reset (zurück zum Setup)
  function reset(host) {
    $("#quizResult", host).style.display = "none";
    $("#quizSetup", host).style.display = "block";
  }

  // Hard-Reset (State + DOM leeren)
  function resetAll(host) {
    state.mode = "schnelltest";
    state.selectedTopics = [];
    state.questionCount = 15;
    state.deck = [];
    state.i = 0;
    state.score = 0;
    state.answered = false;
    if (host) host.innerHTML = "";
  }

  // ===== Overlay Open/Close (einmalig) =====
  const overlay = document.getElementById("quizOverlay");
  const content = document.getElementById("quizContent");
  const openBtn  = document.getElementById("btn-calc-quiz");

  // Öffnen
  openBtn.addEventListener("click", () => {
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
    resetAll(content);
    mount(content);
  });

  // Global close (für ✖ Button)
  window.closeQuiz = function () {
    overlay.style.display = "none";
    document.body.style.overflow = "";
    resetAll(content); // alles zurücksetzen
  };

  // Hintergrund-Klick => close
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) window.closeQuiz();
  });
  // ESC => close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") window.closeQuiz();
  });

  // Expose API (falls du später manuell triggern willst)
  window.TradingQuiz = { mount, resetAll };
})();

