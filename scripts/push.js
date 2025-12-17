/* ==========================================================================
   🚀 ALPHA OS - JARVIS PUSH CORE (CLEANED & FIXED)
   ========================================================================== */

// 1. STATE & SETTINGS
var currentNotifyMode = localStorage.getItem("alphaNotifyMode") || "all";
var warningMinutes = parseInt(localStorage.getItem("alphaWarningTime")) || 5;
var systemActive = false; // Master Switch
var lastTriggeredTime = "";

// DOM Elements
const btnElement = document.getElementById("system-start-btn");
const logElement = document.getElementById("status-log");

// 2. CONFIG: Session Zeitplan (Minuten ab 00:00)
const alarmSessions = [
    { name: "Sydney",           start: 1380, end: 480 },  // 23:00 - 08:00
    { name: "Tokyo",            start: 60,   end: 600 },  // 01:00 - 10:00
    { name: "London Killzone",  start: 420,  end: 600 },  // 07:00 - 10:00
    { name: "London Open",      start: 540,  end: 1020 }, // 09:00 - 17:00
    { name: "NY Killzone",      start: 810,  end: 1020 }, // 13:30 - 17:00
    { name: "New York Open",    start: 870,  end: 1320 }, // 14:30 - 22:00
    { name: "London Close",     start: 1020, end: 1080 }, // 17:00 Fix
    { name: "Deadzone",         start: 1380, end: 60 }    // 23:00 - 01:00
];

// 3. AUDIO ENGINE (Silent Loop & Alarm)
const alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
// Kurzer Base64 Silent Track (um Mobile Browser wach zu halten)
const silentLoop = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD//////////////////////////////////////////////////////////////////wAAAP9MYXZjNTguNTQuMTAwAAAAAAAAAAAAIkcAAAAAAAABIAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAqv9HIjEFLQXAAAAAAAAAAAA0gAAAAATI7LrAAAB5iAAADSAAAAABMjsusAAAHmIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAqv9HIjEFLQXAAAAAAAAAAAA0gAAAAATI7LrAAAB5iAAADSAAAAABMjsusAAAHmIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==");
silentLoop.loop = true;
silentLoop.volume = 0.01;

/* ==========================================================================
   4. SYSTEM START ENGINE (Button Logic)
   ========================================================================== */

function toggleSystem() {
    // FALL 1: System ist AUS -> Einschalten
    if (!systemActive) {
        
        // A. Erlaubnis für Push anfragen
        if ("Notification" in window) {
            Notification.requestPermission().then(perm => {
                if (perm !== "granted") {
                    updateLog("⚠️ Browser blockiert Benachrichtigungen!", "#ff9900");
                }
            });
        }

        // B. Audio Engine Starten (Silent Loop)
        // WICHTIG: Muss innerhalb des Click-Events passieren
        silentLoop.play().then(() => {
            systemActive = true;
            console.log("🚀 ALPHA OS: Hintergrund-System aktiv.");
            
            // UI Update: ON
            updateButtonUI(true);
            updateLog("🚀 ALPHA OS: ONLINE - Scanne Märkte...", "#0f0");

            // Initiale Bestätigung (Piep)
            triggerAlarm("AlphaOS Online", "Wach-Modus aktiviert.");

            // Wake Lock (Bildschirm anlassen)
            if ('wakeLock' in navigator) {
                navigator.wakeLock.request('screen').catch(e => console.log("WakeLock:", e));
            }

        }).catch(e => {
            console.error(e);
            updateLog("⚠️ Fehler: Audio blockiert. Klick erneut!", "#ff4444");
        });

    // FALL 2: System ist AN -> Ausschalten
    } else {
        systemActive = false;
        silentLoop.pause();
        silentLoop.currentTime = 0;
        console.log("🛑 ALPHA OS: System heruntergefahren.");

        // UI Update: OFF
        updateButtonUI(false);
        updateLog("🛑 System gestoppt.", "#666");
    }
}

// Hilfsfunktion für Button Styles
function updateButtonUI(isActive) {
    if (isActive) {
        btnElement.innerHTML = "✅ SYSTEM AKTIV (ONLINE)";
        btnElement.style.background = "#0f0";
        btnElement.style.color = "#000";
        btnElement.style.borderColor = "#0a0";
        btnElement.classList.add("pulse-active");
    } else {
        btnElement.innerHTML = "🛑 SYSTEM STARTEN (OFFLINE)";
        btnElement.style.background = "#222";
        btnElement.style.color = "#fff";
        btnElement.style.borderColor = "#444";
        btnElement.classList.remove("pulse-active");
        btnElement.style.boxShadow = "0 4px 15px rgba(0,0,0,0.5)";
    }
}

function updateLog(msg, color) {
    if(logElement) {
        logElement.innerText = msg;
        logElement.style.color = color;
    }
}

// EVENT LISTENER (Verbindet Button mit Logik)
if(btnElement) {
    btnElement.addEventListener("click", toggleSystem);
} else {
    console.error("Button nicht gefunden! ID 'system-start-btn' fehlt im HTML.");
}


/* ==========================================================================
   5. SETTINGS INTERFACE (Optional, falls du Settings-Panel hast)
   ========================================================================== */

window.setNotifyMode = function(mode) {
    currentNotifyMode = mode;
    localStorage.setItem("alphaNotifyMode", mode);
    console.log(`🎛️ Jarvis: Alarm-Modus auf ${mode} gesetzt.`);
};

window.setWarningTime = function(mins) {
    warningMinutes = parseInt(mins);
    localStorage.setItem("alphaWarningTime", mins);
    console.log(`⏱️ Jarvis: Vorwarnzeit auf ${mins} Minuten gesetzt.`);
};


/* ==========================================================================
   6. ZEIT-LOOP (Das Gehirn)
   ========================================================================== */

function getCurrentMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

// Einfache Sommerzeit-Erkennung für EU
function isSummerTime() {
    const d = new Date();
    const year = d.getFullYear();
    // Letzter Sonntag im März
    const march = new Date(year, 2, 31); march.setDate(march.getDate() - march.getDay());
    // Letzter Sonntag im Oktober
    const october = new Date(year, 9, 31); october.setDate(october.getDate() - october.getDay());
    return d >= march && d < october;
}

// Heartbeat alle 2 Sekunden
setInterval(() => {
    // Wenn System aus, mach gar nichts
    if (!systemActive) return;

    const rawMinutes = getCurrentMinutes();
    const dstOffset = isSummerTime() ? 60 : 0;
    const nowString = new Date().toLocaleTimeString().slice(0, 5); 

    // Spam-Schutz: Nur 1x pro Minute feuern
    if (nowString === lastTriggeredTime) return;

    alarmSessions.forEach(session => {
        // Achtung: Einfache Logik. Für komplexe Zeitzonen-Anpassung
        // sollte man eigentlich UTC verwenden. Hier angepasst auf Lokale Zeit + DST.
        let adjStart = (session.start + dstOffset) % 1440;
        let adjEnd = (session.end + dstOffset) % 1440;

        // 1. SESSION START
        if (rawMinutes === adjStart) {
            triggerAlarm(`🚀 START: ${session.name}`, "Liquidität steigt. Marktstruktur prüfen!");
            lastTriggeredTime = nowString;
        }

        // 2. SESSION ENDE
        if (rawMinutes === adjEnd) {
            triggerAlarm(`🏁 ENDE: ${session.name}`, "Volumen sinkt. Risk Management prüfen.");
            lastTriggeredTime = nowString;
        }

        // 3. VORWARNUNG
        let warnTime = adjStart - warningMinutes;
        if (warnTime < 0) warnTime += 1440;

        if (rawMinutes === warnTime) {
            triggerAlarm(`⚠️ BALD: ${session.name}`, `Startet in ${warningMinutes} Minuten. Bereite dich vor.`);
            lastTriggeredTime = nowString;
        }
    });
}, 2000);

/* ==========================================================================
   🚀 PUSH.JS - ALARM & NOTIFICATION ENGINE
   ========================================================================== */

// DOM Referenz für visuellen Alert
const alertBox = document.getElementById("alertBox");

// 1. STATE & AUDIO
const alertSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
let currentNotifyMode = localStorage.getItem("alphaNotifyMode") || "all";
let warningMinutes = parseInt(localStorage.getItem("alphaWarningTime")) || 5;

// Status-Variablen für Alarm-Trigger
let lastAlertSession = null;
let lastActiveSessionState = "";
let isFirstLoad = true;

/* ==========================================================================
   2. SETTINGS INTERFACE (Aufrufbar aus HTML)
   ========================================================================== */

window.setNotifyMode = function(mode) {
    currentNotifyMode = mode;
    localStorage.setItem("alphaNotifyMode", mode);
    updateNotifyUI();
    
    const modeNames = { 'all': "🔊 Alles an", 'push': "📳 Nur Push", 'sound': "🔈 Nur Ton", 'off': "🔕 Stumm" };
    showAlert(`✅ ${modeNames[mode]}`);

    // Audio Test
    if ((mode === 'all' || mode === 'sound') && alertSound) {
        alertSound.volume = 1.0;
        alertSound.currentTime = 0;
        alertSound.play().catch(e => console.log("Audio Autoplay blockiert"));
    }
    // Push Test
    if (mode === 'all' || mode === 'push') {
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        if (Notification.permission === "granted") {
            new Notification("🔔 Test", { body: `Modus: ${modeNames[mode]}`, icon: "/app/icon-192.png" });
        }
    }
};

window.setWarningTime = function(mins) {
    warningMinutes = parseInt(mins);
    localStorage.setItem("alphaWarningTime", mins);
    updateNotifyUI();
    
    if(navigator.vibrate) navigator.vibrate(30);
    console.log(`Vorwarnzeit gesetzt auf: ${mins} Minuten`);
};

window.closeNotifySettings = function() {
    const p = document.getElementById("panel-settings-notify");
    if(p) p.classList.add("hidden");
};

// UI Aktualisierung für Buttons
function updateNotifyUI() {
    const modeBtns = document.querySelectorAll(".btn-notify");
    modeBtns.forEach(btn => {
        if (btn.dataset.mode === currentNotifyMode) {
            btn.classList.add("active");
            btn.style.border = "2px solid #00ffcc";
            btn.style.background = "rgba(0, 255, 204, 0.1)";
        } else {
            btn.classList.remove("active");
            btn.style.border = "1px solid #333";
            btn.style.background = "transparent";
        }
    });

    const timeBtns = document.querySelectorAll(".btn-time");
    timeBtns.forEach(btn => {
        if (parseInt(btn.dataset.time) === warningMinutes) {
            btn.classList.add("active");
            btn.style.border = "1px solid #00ffcc";
            btn.style.background = "rgba(0, 255, 204, 0.15)";
        } else {
            btn.classList.remove("active");
            btn.style.border = "1px solid #444";
            btn.style.background = "transparent";
        }
    });
}

// Initialer Load der UI
window.addEventListener("load", () => {
    requestNotificationPermission();
    updateNotifyUI();
});

/* ==========================================================================
   3. NOTIFICATION LOGIC
   ========================================================================== */

function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

function showAlert(msg) {
    if (alertBox) {
        alertBox.textContent = msg;
        alertBox.style.display = "block";
        setTimeout(() => { alertBox.style.display = "none"; }, 5000);
    }
    console.log("ALERT:", msg);
}

// 🔥 SESSION START ALARM
function showSessionStartNotification(name, info) {
    if (currentNotifyMode === 'off') return;
    const title = `AlphaOS: ${name} gestartet!`;
    const cleanInfo = info.replace(/<[^>]*>/g, "").substring(0, 100) + "...";

    // Push
    if ((currentNotifyMode === 'all' || currentNotifyMode === 'push') && Notification.permission === "granted") {
        new Notification(title, { body: cleanInfo, icon: "/app/icon-192.png", vibrate: [200, 100, 200] });
    }
    // Audio
    if ((currentNotifyMode === 'all' || currentNotifyMode === 'sound') && alertSound) {
        alertSound.volume = 1.0;
        alertSound.currentTime = 0;
        alertSound.play().catch(()=>{});
    }
}

// 🔥 SESSION ENDE ALARM
function showSessionEndNotification(name) {
    if (currentNotifyMode === 'off') return;
    const title = `AlphaOS: ${name} Beendet`;

    if ((currentNotifyMode === 'all' || currentNotifyMode === 'push') && Notification.permission === "granted") {
        new Notification(title, { body: "Liquidität sinkt.", icon: "/app/icon-192.png", vibrate: [100, 50, 100] });
    }
    if ((currentNotifyMode === 'all' || currentNotifyMode === 'sound') && alertSound) {
        alertSound.volume = 0.5;
        alertSound.currentTime = 0;
        alertSound.play().catch(()=>{});
    }
}

// 🔥 VORWARNUNG ALARM
function showSessionWarningNotification(name, minutes) {
    if (currentNotifyMode === 'off') return;
    const title = `AlphaOS: ${name} bald!`;
    const bodyText = `Startet in ${minutes} Minuten.`;

    if ((currentNotifyMode === 'all' || currentNotifyMode === 'push') && Notification.permission === "granted") {
        new Notification(title, { body: bodyText, icon: "/app/icon-192.png", vibrate: [50, 50] });
    }
    if ((currentNotifyMode === 'all' || currentNotifyMode === 'sound') && alertSound) {
        alertSound.volume = 0.3;
        alertSound.currentTime = 0;
        alertSound.play().catch(()=>{});
    }
}

/* ==========================================================================
   2. EINSTELLUNGEN & ALARME (JETZT MIT ZEIT-AUSWAHL)
   ========================================================================== */

// Einstellungen laden
let currentNotifyMode = localStorage.getItem("alphaNotifyMode") || "all";
let warningMinutes = parseInt(localStorage.getItem("alphaWarningTime")) || 5; // Standard: 5 Min

// Modus setzen (Alles an, Push, etc.)
function setNotifyMode(mode) {
    currentNotifyMode = mode;
    localStorage.setItem("alphaNotifyMode", mode);
    updateNotifyUI();
    
    const modeNames = { 'all': "🔊 Alles an", 'push': "📳 Nur Push", 'sound': "🔈 Nur Ton", 'off': "🔕 Stumm" };
    showAlert(`✅ ${modeNames[mode]}`);

    // Audio Test
    if ((mode === 'all' || mode === 'sound') && alertSound) {
        alertSound.volume = 1.0;
        alertSound.currentTime = 0;
        alertSound.play().catch(e => console.log("Audio Autoplay blockiert"));
    }
    // Push Test
    if (mode === 'all' || mode === 'push') {
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        if (Notification.permission === "granted" && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(reg => {
                reg.showNotification("🔔 Test erfolgreich!", {
                    body: `Modus: ${modeNames[mode]}`,
                    icon: "/app/icon-192.png",
                    vibrate: [50, 50, 50],
                    tag: "test-feedback"
                });
            });
        }
    }
}

// ⏳ Vorwarnzeit setzen (5, 10, 30, 60)
function setWarningTime(mins) {
    warningMinutes = mins;
    localStorage.setItem("alphaWarningTime", mins);
    updateNotifyUI();
    
    if(navigator.vibrate) navigator.vibrate(30);
    console.log(`Vorwarnzeit gesetzt auf: ${mins} Minuten`);
}

// UI Aktualisieren
function updateNotifyUI() {
    // 1. Modus Buttons
    const btns = document.querySelectorAll(".btn-notify");
    btns.forEach(btn => {
        if (btn.dataset.mode === currentNotifyMode) {
            btn.classList.add("active");
            btn.style.border = "2px solid #00ffcc";
            btn.style.background = "rgba(0, 255, 204, 0.1)";
        } else {
            btn.classList.remove("active");
            btn.style.border = "1px solid #333";
            btn.style.background = "transparent";
        }
    });

    // 2. Zeit Buttons
    const timeBtns = document.querySelectorAll(".btn-time");
    timeBtns.forEach(btn => {
        if (parseInt(btn.dataset.time) === warningMinutes) {
            btn.classList.add("active");
            btn.style.border = "1px solid #00ffcc";
            btn.style.background = "rgba(0, 255, 204, 0.15)";
            btn.style.color = "#00ffcc";
        } else {
            btn.classList.remove("active");
            btn.style.border = "1px solid #444";
            btn.style.background = "transparent";
            btn.style.color = "#fff";
        }
    });
}

function closeNotifySettings() {
    const p = document.getElementById("panel-settings-notify");
    if(p) p.classList.add("hidden");
}

/* ==========================================================================
   4. TRIGGER ENGINE (Verbindung zur Main JS)
   ========================================================================== */

// Diese Funktion wird von der Main JS jede Minute aufgerufen
window.checkAndTriggerAlarms = function(activeSessions, minutesNow) {
    
    // 1. Namen sammeln
    const currentNamesList = activeSessions.map(s => s.name);
    const currentSessionString = currentNamesList.join(",");
    const lastNamesList = lastActiveSessionState ? lastActiveSessionState.split(",").filter(n => n) : [];

    // 2. Change Detection (Start/Ende)
    if (isFirstLoad) {
        lastActiveSessionState = currentSessionString;
        isFirstLoad = false; 
    } else if (currentSessionString !== lastActiveSessionState) {
        
        // Check Start
        const newSession = activeSessions.find(s => !lastNamesList.includes(s.name));
        if (newSession) {
            showSessionStartNotification(newSession.name, newSession.info);
            showAlert(`🚀 START: ${newSession.name}`);
        }
        
        // Check Ende
        const endedSessionName = lastNamesList.find(name => !currentNamesList.includes(name));
        if (endedSessionName) {
            showSessionEndNotification(endedSessionName);
            showAlert(`🏁 ENDE: ${endedSessionName}`);
        }
        
        lastActiveSessionState = currentSessionString;
    }

    // 3. Vorwarnung (Nutzt Helper aus Main JS)
    // Wir prüfen, ob die Helper existieren
    if (window.getMinutesToNextSession && window.getNextSessionInfo) {
        const minutesToNext = window.getMinutesToNextSession(minutesNow);
        
        if (minutesToNext <= warningMinutes && minutesToNext > 0) {
            const nextInfo = window.getNextSessionInfo(minutesNow);
            if (nextInfo && nextInfo.session) {
                const warningKey = `warn-${nextInfo.session.name}-${warningMinutes}`;
                if (lastAlertSession !== warningKey) {
                    showAlert(`⚠️ Achtung: ${nextInfo.session.name} startet in ${minutesToNext} Min!`);
                    showSessionWarningNotification(nextInfo.session.name, minutesToNext);
                    lastAlertSession = warningKey;
                }
            }
        } else {
            if (minutesToNext > warningMinutes) lastAlertSession = null;
        }
    }
};


/* ==========================================================================
   7. NOTIFICATION ENGINE
   ========================================================================== */

function triggerAlarm(title, body) {
    if (currentNotifyMode === 'off') return;

    console.log(`🔔 PUSH: ${title}`);

    // A. Audio
    if ((currentNotifyMode === 'all' || currentNotifyMode === 'sound') && alarmSound) {
        alarmSound.currentTime = 0;
        alarmSound.volume = 1.0;
        alarmSound.play().catch(e => console.log("Audio Autoplay blockiert: User Interaktion nötig"));
    }

    // B. Push
    if (currentNotifyMode === 'all' || currentNotifyMode === 'push') {
        if (Notification.permission === "granted") {
            try {
                const notif = new Notification(title, {
                    body: body,
                    // Standard Icon oder dein eigenes
                    icon: "https://cdn-icons-png.flaticon.com/512/2910/2910795.png", 
                    vibrate: [200, 100, 200, 100, 500],
                    requireInteraction: true 
                });
                notif.onclick = function() { window.focus(); this.close(); };
            } catch (e) {
                console.error("Push Error:", e);
            }
        }
    }
}