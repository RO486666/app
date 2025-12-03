/* =====================================================
   🧠 PAIR PROFILE MODULE — FINAL FIXED VERSION
   ===================================================== */

window.livePrices = window.livePrices || {};
window.pipValues = window.pipValues || {};
window.basisWerte = window.basisWerte || {};
window.pairsData = window.pairsData || {};

/* -----------------------------------------------------
   AUTO-INIT
----------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(() => {
        const panel = document.getElementById("calc-pairProfile");
        if (panel && panel.style.display !== "none") {
            loadPairProfileDropdown();
        }
    });

    observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ["style"]
    });
});


/* -----------------------------------------------------
   🔥 DROPDOWN LADEN — nur aus pairsData.js
----------------------------------------------------- */
function loadPairProfileDropdown() {
    const select = document.getElementById("pairProfileSymbol");
    if (!select) return;

    if (select.dataset.loaded === "true") return;

    select.innerHTML = "";

    // Placeholder einfügen
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "– Bitte Paar wählen –";
    select.appendChild(placeholder);

    // 🔥 Alle Kategorien wie beim Rechner benutzen
    Object.entries(categories).forEach(([groupName, symbols]) => {

        const group = document.createElement("optgroup");
        group.label = groupName;

        symbols.forEach(symbol => {
            if (pipValues[symbol] !== undefined) {
                const opt = document.createElement("option");
                opt.value = symbol;
                opt.textContent = symbol;
                group.appendChild(opt);
            }
        });

        select.appendChild(group);
    });

    select.dataset.loaded = "true";

    select.addEventListener("change", () => showPairProfile(select.value));
}



/* -----------------------------------------------------
   PROFIL ANZEIGEN
----------------------------------------------------- */
function showPairProfile(symbol) {

    const price    = livePrices[symbol] ?? "-";
    const pip      = pipValues[symbol] ?? "-";
    const contract = basisWerte[symbol] ?? "-";

    document.getElementById("pairProfileSymbolLabel").textContent = symbol || "-";
    document.getElementById("pairProfilePrice").textContent = price;
    document.getElementById("pairProfilePip").textContent = pip;
    document.getElementById("pairProfileContract").textContent = contract;

    const info = pairProfileDB[symbol];

    document.getElementById("pairProfileText").textContent =
        info?.behavior ?? "Keine Beschreibung in der Datenbank.";

    // Extrafelder resetten
    const basicsBox = document.getElementById("pairProfileBasics");
    basicsBox.querySelector(".extraInfo")?.remove();

    if (info) {
        const extra = document.createElement("div");
        extra.className = "extraInfo";
        extra.style.marginTop = "12px";
        extra.innerHTML = `
            <div>🔥 Beste Sessions: <strong>${(info.bestSessions || []).join(", ")}</strong></div>
            <div>📅 Beste Tage: <strong>${(info.bestDays || []).join(", ")}</strong></div>
            <div>⚡ Volatilität: <strong>${info.volatility ?? "-"}</strong></div>
            <div>🚨 Risiko-Level: <strong>${info.riskLevel ?? "-"}</strong></div>
        `;
        basicsBox.appendChild(extra);
    }

    loadPairNotes(symbol);
}


/* -----------------------------------------------------
   NOTIZEN LADEN
----------------------------------------------------- */
function loadPairNotes(symbol) {
    const ul = document.getElementById("pairProfileNotesList");
    ul.innerHTML = "";

    const info = pairProfileDB[symbol];

    if (!info || !info.notes) {
        ul.innerHTML = "<li>Keine Notizen vorhanden.</li>";
        return;
    }

    info.notes.forEach(text => {
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
    document.getElementById("pairProfileText").textContent = "Bitte ein Trading-Paar wählen.";
    document.getElementById("pairProfileNotesList").innerHTML = "<li>Keine Notizen vorhanden.</li>";
}
