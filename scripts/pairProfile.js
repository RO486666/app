/* =====================================================
   🧠 PAIR PROFILE MODULE — AUTO-INIT VERSION
   ===================================================== */

window.livePrices = window.livePrices || {};
window.pipValues = window.pipValues || {};
window.contractSizes = window.contractSizes || {};

/* -----------------------------------------------------
   AUTO-INIT: Wird ausgelöst sobald das Panel geöffnet wird
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
   DROPDOWN LADEN (nur 1×)
----------------------------------------------------- */
function loadPairProfileDropdown() {
    const select = document.getElementById("pairProfileSymbol");
    if (!select) return;
    if (select.dataset.loaded === "true") return;

    // Reset & Placeholder
    select.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "– Bitte Paar wählen –";
    select.appendChild(placeholder);

    // Paare laden
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

    document.getElementById("pairProfileSymbolLabel").textContent = symbol;
    document.getElementById("pairProfilePrice").textContent = livePrices[symbol] ?? "-";
    document.getElementById("pairProfilePip").textContent = pipValues[symbol] ?? "-";
    document.getElementById("pairProfileContract").textContent = contractSizes[symbol] ?? "-";

    document.getElementById("pairProfileText").textContent =
        data.behavior ?? "Keine Beschreibung vorhanden.";

    // Zusatzinfos entfernen
    const basicsBox = document.getElementById("pairProfileBasics");
    basicsBox.querySelector(".extraInfo")?.remove();

    // Neue Zusatzinfos
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
   RESET-UI
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
