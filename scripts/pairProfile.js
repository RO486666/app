/* =====================================================
   🧠 PAIR PROFILE MODULE — SINGLE SOURCE VERSION
   ===================================================== */

// 🔹 DEINE KATEGORIEN-KONFIGURATION
// Hier kannst du die Reihenfolge und Gruppen exakt steuern.
const CATEGORY_CONFIG = {
    "🌍 Forex (Majors)": ["EUR/USD", "GBP/USD", "AUD/USD", "NZD/USD", "USD/CHF", "USD/CAD", "USD/JPY"],
    "🔀 Forex (Crosses)": [
        "EUR/JPY", "GBP/JPY", "AUD/JPY", "CAD/JPY", "NZD/JPY",
        "EUR/GBP", "EUR/AUD", "AUD/CAD", "GBP/CAD", "GBP/CHF",
        "NZD/CAD", "AUD/NZD", "GBP/AUD", "AUD/CHF", "GBP/NZD"
    ],
    "📊 Indizes": ["US30", "NAS100", "SPX500", "GER30", "GER40", "UK100"], // GER40 sicherheitshalber dazu
    "🥇 Metalle": ["XAU/USD", "XAG/USD"],
    "🛢️ Energie": ["BRENT", "WTI", "USOIL"],
    "🪙 Krypto": ["BTC/USD", "ETH/USD", "XRP/USD"]
};

/**
 * Hilfsfunktion: Versucht Variablen sicher zu finden
 */
function getDataSafe(varName) {
    try {
        if (varName === 'pairProfileDB') return pairProfileDB;
        if (varName === 'livePrices') return livePrices;
        if (varName === 'pipValues') return pipValues;
        if (varName === 'basisWerte') return basisWerte;
    } catch (e) {
        if (window[varName]) return window[varName];
        return {};
    }
    return {};
}

/* -----------------------------------------------------
   AUTO-INIT
----------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    createSessionFilterUI();
    loadPairProfileDropdown();

    const observer = new MutationObserver(() => {
        const panel = document.getElementById("calc-pairProfile");
        if (panel && panel.style.display !== "none") {
            if (!document.getElementById("sessionFilterSelect")) {
                createSessionFilterUI();
            }
            const select = document.getElementById("pairProfileSymbol");
            if (select && select.dataset.loaded !== "true") {
                loadPairProfileDropdown();
            }
        }
    });

    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["style"] });
});


/* -----------------------------------------------------
   🛠 UI: SESSION FILTER (UPDATED)
----------------------------------------------------- */
function createSessionFilterUI() {
    const pairSelect = document.getElementById("pairProfileSymbol");
    if (!pairSelect || document.getElementById("sessionFilterContainer")) return;

    const container = document.createElement("div");
    container.id = "sessionFilterContainer";
    container.style.cssText = "margin-bottom: 10px; display: flex; align-items: center; gap: 10px;";

    const label = document.createElement("label");
    label.textContent = "🔍 Filter:";
    label.style.cssText = "font-weight: bold; color: #ccc; font-size: 0.9em;";

    const filterSelect = document.createElement("select");
    filterSelect.id = "sessionFilterSelect";
    filterSelect.style.cssText = "padding: 5px; border-radius: 4px; background-color: #2a2a2a; color: #fff; border: 1px solid #444;";

    // 🔹 Hier sind deine neuen Filter-Optionen ohne Frankfurt, mit Killzones
    const sessions = [
        { val: "ALL", text: "Alle anzeigen" },
        { val: "London", text: "🇬🇧 London Session" },
        { val: "NY", text: "🇺🇸 New York Session" },
        { val: "London Killzone", text: "🎯 London Killzone" }, // Neu
        { val: "NY Killzone", text: "🎯 NY Killzone" },         // Neu
        { val: "Tokyo", text: "🇯🇵 Tokyo / Asia" },
        { val: "Sydney", text: "🇦🇺 Sydney" }
    ];

    sessions.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.val;
        opt.textContent = s.text;
        filterSelect.appendChild(opt);
    });

    filterSelect.addEventListener("change", () => {
        if (pairSelect) pairSelect.dataset.loaded = "false"; 
        loadPairProfileDropdown();
        resetPairProfileUI();
    });

    container.appendChild(label);
    container.appendChild(filterSelect);
    pairSelect.parentNode.insertBefore(container, pairSelect);
}

/* -----------------------------------------------------
   🔥 DROPDOWN LADEN (Mit Custom Categories)
----------------------------------------------------- */
function loadPairProfileDropdown() {
    const select = document.getElementById("pairProfileSymbol");
    const filterSelect = document.getElementById("sessionFilterSelect");
    
    if (!select) return;

    const DB = getDataSafe('pairProfileDB');
    const activeFilter = filterSelect ? filterSelect.value : "ALL";

    // Select leeren
    select.innerHTML = "";
    
    // Placeholder Option
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = activeFilter === "ALL" 
        ? "– Bitte Paar wählen –" 
        : `– Wähle ein ${activeFilter}-Paar –`;
    select.appendChild(placeholder);

    // Set zum Tracken bereits hinzugefügter Symbole (um Dopplungen zu vermeiden)
    const addedSymbols = new Set();
    let totalPairsShown = 0;

    // --- 1. Durch die definierte CATEGORY_CONFIG iterieren ---
    for (const [categoryName, symbolsList] of Object.entries(CATEGORY_CONFIG)) {
        
        // Gruppe erstellen (aber noch nicht anhängen, erst checken ob Inhalt da ist)
        const optGroup = document.createElement("optgroup");
        optGroup.label = categoryName;
        let groupHasContent = false;

        symbolsList.forEach(symbol => {
            const info = DB[symbol];

            // Nur verarbeiten, wenn Symbol in DB existiert
            if (info) {
                // FILTER CHECKEN
                let isMatch = false;
                if (activeFilter === "ALL") {
                    isMatch = true;
                } else {
                    if (info.bestSessions && Array.isArray(info.bestSessions)) {
                        isMatch = info.bestSessions.some(s => s.toUpperCase().includes(activeFilter.toUpperCase()));
                    }
                }

                if (isMatch) {
                    const opt = document.createElement("option");
                    opt.value = symbol;
                    opt.textContent = symbol; // Hier könnte man auch Emojis hinzufügen, z.B. info.icon + symbol
                    optGroup.appendChild(opt);
                    
                    addedSymbols.add(symbol); // Markieren als erledigt
                    groupHasContent = true;
                    totalPairsShown++;
                }
            }
        });

        // Nur anhängen, wenn Gruppe nicht leer ist
        if (groupHasContent) {
            select.appendChild(optGroup);
        }
    }

    // --- 2. "Sonstige" (Fallback für Symbole in DB, die nicht in categories stehen) ---
    const allDbSymbols = Object.keys(DB).sort();
    const otherSymbolsGroup = document.createElement("optgroup");
    otherSymbolsGroup.label = "📂 Sonstige / Unsortiert";
    let hasOthers = false;

    allDbSymbols.forEach(symbol => {
        if (!addedSymbols.has(symbol)) { // Nur wenn noch nicht oben hinzugefügt
            const info = DB[symbol];
            
            // Filter Check (identisch zu oben)
            let isMatch = false;
            if (activeFilter === "ALL") {
                isMatch = true;
            } else {
                if (info.bestSessions && Array.isArray(info.bestSessions)) {
                    isMatch = info.bestSessions.some(s => s.toUpperCase().includes(activeFilter.toUpperCase()));
                }
            }

            if (isMatch) {
                const opt = document.createElement("option");
                opt.value = symbol;
                opt.textContent = symbol;
                otherSymbolsGroup.appendChild(opt);
                hasOthers = true;
                totalPairsShown++;
            }
        }
    });

    if (hasOthers) {
        select.appendChild(otherSymbolsGroup);
    }

    // --- 3. Empty State ---
    if (totalPairsShown === 0) {
        const infoOpt = document.createElement("option");
        infoOpt.textContent = "Keine passenden Paare gefunden.";
        infoOpt.disabled = true;
        select.appendChild(infoOpt);
    }

    select.dataset.loaded = "true";
    select.onchange = () => showPairProfile(select.value);
}


/* -----------------------------------------------------
   ANZEIGE LOGIK (Unverändert, aber solide)
----------------------------------------------------- */
function showPairProfile(symbol) {
    if (!symbol) {
        resetPairProfileUI();
        return;
    }

    const PRICES = getDataSafe('livePrices');
    const PIPS   = getDataSafe('pipValues');
    const BASIS  = getDataSafe('basisWerte');
    const DB     = getDataSafe('pairProfileDB');

    document.getElementById("pairProfileSymbolLabel").textContent = symbol;
    document.getElementById("pairProfilePrice").textContent = PRICES[symbol] ?? "-";
    document.getElementById("pairProfilePip").textContent = PIPS[symbol] ?? "-";
    document.getElementById("pairProfileContract").textContent = BASIS[symbol] ?? "-";

    const info = DB[symbol]; 

    document.getElementById("pairProfileText").textContent = 
        info?.behavior ?? "Keine Daten verfügbar.";

    // Extra Infos Box
    const basicsBox = document.getElementById("pairProfileBasics");
    basicsBox.querySelector(".extraInfo")?.remove();

    if (info) {
        const extra = document.createElement("div");
        extra.className = "extraInfo";
        extra.style.cssText = "margin-top: 12px; padding-top: 10px; border-top: 1px solid #444;";

        let rColor = "#ccc";
        if (info.riskLevel?.match(/Hoch|Extrem/i)) rColor = "#ff4d4d";
        else if (info.riskLevel?.match(/Mittel/i)) rColor = "#ffcc00";
        else if (info.riskLevel?.match(/Niedrig/i)) rColor = "#66ff66";

        extra.innerHTML = `
            <div style="margin-bottom: 4px;">🔥 Beste Sessions: <span style="color: #fff;">${(info.bestSessions || []).join(", ")}</span></div>
            <div style="margin-bottom: 4px;">📅 Beste Tage: <span style="color: #fff;">${(info.bestDays || []).join(", ")}</span></div>
            <div style="margin-bottom: 4px;">⚡ Volatilität: <span style="color: #fff;">${info.volatility ?? "-"}</span></div>
            <div>🚨 Risiko-Level: <span style="color: ${rColor}; font-weight:bold;">${info.riskLevel ?? "-"}</span></div>
        `;
        basicsBox.appendChild(extra);
    }

    loadPairNotes(symbol, info);
}

/* -----------------------------------------------------
   UPDATE: SMART NOTES PARSER (HUD EDITION)
   ----------------------------------------------------- */
function loadPairNotes(symbol, info) {
    const container = document.getElementById("pairProfileNotesList");
    
    // Wir ändern das UL zu einem DIV Grid Container via JS, falls es noch ein UL ist
    const parent = container.parentNode;
    if (container.tagName === "UL") {
        const newDiv = document.createElement("div");
        newDiv.id = "pairProfileNotesList";
        newDiv.className = "notes-grid-container";
        parent.replaceChild(newDiv, container);
        // Rekursiver Aufruf mit neuem Container
        loadPairNotes(symbol, info); 
        return;
    }

    container.innerHTML = "";
    container.className = "notes-grid-container"; // CSS Klasse setzen

    if (!info || !info.notes || info.notes.length === 0) {
        container.innerHTML = "<div class='empty-state'>Keine taktischen Daten verfügbar.</div>";
        return;
    }

    let currentCard = null;
    let currentContent = null;

    info.notes.forEach(text => {
        // 🔹 Logik: Zeilen ohne Bulletpoint "•" sind ÜBERSCHRIFTEN (Neue Karte)
        if (!text.trim().startsWith("•")) {
            
            // Karte erstellen (HUD Panel Style)
            currentCard = document.createElement("div");
            currentCard.className = "note-card"; // Standard Klasse

            // Check auf "Gefahrzonen" für roten Alarm-Style
            if (text.includes("Gefahrzonen") || text.includes("⚠️")) {
                currentCard.classList.add("danger-zone");
            }
            
            // Header
            const title = document.createElement("div");
            title.className = "card-header";
            // Icons vergrößern und Text stylen
            title.innerHTML = text.replace(/([🔎🕒🌍⚠️🎯])/, '<span class="card-icon">$1</span>').toUpperCase();
            
            currentCard.appendChild(title);

            // Content Container
            currentContent = document.createElement("div");
            currentContent.className = "card-content";
            currentCard.appendChild(currentContent);

            container.appendChild(currentCard);

        } else {
            // Es ist ein Listenpunkt •
            if (currentContent) {
                const row = document.createElement("div");
                row.className = "data-row";
                
                let cleanText = text.replace("•", "").trim();
                
                // 🔥 Auto-Highlighting für Keywords (Neon-Effekte)
                cleanText = cleanText
                    .replace(/(London Killzone|NY Killzone|London|NY|Tokyo|Sydney)/g, "<span class='hl-session'>$1</span>")
                    .replace(/(Judas Swing|OTE|Sweep|FVG|Breaker Block|MSS|Displacement)/g, "<span class='hl-tech'>$1</span>")
                    .replace(/(Tödliche Spikes|Stop Hunt|Manipulation)/g, "<span class='hl-danger'>$1</span>");

                row.innerHTML = `<span class="bullet">›</span> ${cleanText}`;
                currentContent.appendChild(row);
            }
        }
    });
}

function resetPairProfileUI() {
    document.getElementById("pairProfileSymbolLabel").textContent = "–";
    document.getElementById("pairProfilePrice").textContent = "–";
    document.getElementById("pairProfilePip").textContent = "–";
    document.getElementById("pairProfileContract").textContent = "–";
    document.getElementById("pairProfileText").textContent = "Bitte ein Trading-Paar wählen.";
    const basicsBox = document.getElementById("pairProfileBasics");
    basicsBox.querySelector(".extraInfo")?.remove();
    document.getElementById("pairProfileNotesList").innerHTML = "<li>Keine Notizen vorhanden.</li>";
}