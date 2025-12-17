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