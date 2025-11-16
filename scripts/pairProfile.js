/* =====================================================
   🧠 PAIR PROFILE MODULE — FINAL VERSION (SAFE BUILD)
   ===================================================== */

// Schutz: Falls eine Variable nicht existiert → leere Objekte
window.livePrices = window.livePrices || {};
window.pipValues = window.pipValues || {};
window.contractSizes = window.contractSizes || {};

/* -----------------------------------------------------
   TAB ÖFFNEN
----------------------------------------------------- */
function openPairProfile() {
    document.querySelectorAll(".calc-box").forEach(box => box.style.display = "none");
    document.querySelectorAll(".tab-buttons button").forEach(btn => btn.classList.remove("active"));

    document.getElementById("calc-pairProfile").style.display = "block";
    document.getElementById("btn-calc-pairprofile").classList.add("active");

    loadPairProfileDropdown();
}

/* -----------------------------------------------------
   DROPDOWN LADEN
----------------------------------------------------- */
function loadPairProfileDropdown() {
    const select = document.getElementById("pairProfileSymbol");
    if (!select) return;
    if (select.dataset.loaded === "true") return;

    select.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "– Bitte Paar wählen –";
    select.appendChild(placeholder);

    Object.keys(pairProfileDB).forEach(symbol => {
        const opt = document.createElement("option");
        opt.value = symbol;
        opt.textContent = symbol;
        select.appendChild(opt);
    });

    select.dataset.loaded = "true";
    select.addEventListener("change", () => showPairProfile(select.value));
}

/* -----------------------------------------------------
   PROFIL ANZEIGEN
----------------------------------------------------- */
function showPairProfile(symbol) {

    const data = pairProfileDB[symbol];

    if (!data) {
        resetPairProfileUI();
        return;
    }

    // === BASISDATEN ===
    document.getElementById("pairProfileSymbolLabel").textContent = symbol;
    document.getElementById("pairProfilePrice").textContent = livePrices[symbol] ?? "-";
    document.getElementById("pairProfilePip").textContent = pipValues[symbol] ?? "-";
    document.getElementById("pairProfileContract").textContent = contractSizes[symbol] ?? "-";

    // === Verhalten / Charakteristik ===
    document.getElementById("pairProfileText").textContent = data.behavior ?? "Keine Beschreibung vorhanden.";

    // === Extra Infos ===
    const basicsBox = document.getElementById("pairProfileBasics");
    basicsBox.querySelector(".extraInfo")?.remove();

    const extra = document.createElement("div");
    extra.className = "extraInfo";
    extra.style.marginTop = "12px";
    extra.innerHTML = `
        <div>🔥 Beste Sessions: <strong>${(data.bestSessions || []).join(", ")}</strong></div>
        <div>📅 Beste Tage: <strong>${(data.bestDays || []).join(", ")}</strong></div>
        <div>⚡ Volatilität: <strong>${data.volatility ?? "-"}</strong></div>
        <div>🚨 Risiko-Level: <strong>${data.riskLevel ?? "-"}</strong></div>
    `;
    basicsBox.appendChild(extra);

    // === Notizen ===
    loadPairNotes(symbol);
}

/* -----------------------------------------------------
   NOTIZEN LADEN
----------------------------------------------------- */
function loadPairNotes(symbol) {
    const ul = document.getElementById("pairProfileNotesList");
    ul.innerHTML = "";

    const data = pairProfileDB[symbol];

    if (!data || !data.notes || data.notes.length === 0) {
        ul.innerHTML = "<li>Keine Notizen vorhanden.</li>";
        return;
    }

    data.notes.forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
        ul.appendChild(li);
    });
}

/* -----------------------------------------------------
   RESET
----------------------------------------------------- */
function resetPairProfileUI() {
    document.getElementById("pairProfileSymbolLabel").textContent = "–";
    document.getElementById("pairProfilePrice").textContent = "–";
    document.getElementById("pairProfilePip").textContent = "–";
    document.getElementById("pairProfileContract").textContent = "–";

    document.getElementById("pairProfileText").textContent =
        "Bitte ein Trading-Paar wählen.";

    document.getElementById("pairProfileNotesList").innerHTML =
        "<li>Keine Notizen vorhanden.</li>";

    document.getElementById("pairProfileBasics")
        .querySelector(".extraInfo")?.remove();
}
