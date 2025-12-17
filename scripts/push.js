/* ==========================================================================
   🚀 ALPHA OS - JARVIS PUSH CORE (Final Production Version - MERGED)
   ========================================================================== */

// 1. STATE & SETTINGS
var currentNotifyMode = localStorage.getItem("alphaNotifyMode") || "all";
var warningMinutes = parseInt(localStorage.getItem("alphaWarningTime")) || 5; 
var systemActive = false; // Master Switch
var lastTriggeredTime = ""; 

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
const silentLoop = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD//////////////////////////////////////////////////////////////////wAAAP9MYXZjNTguNTQuMTAwAAAAAAAAAAAAIkcAAAAAAAABIAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAqv9HIjEFLQXAAAAAAAAAAAA0gAAAAATI7LrAAAB5iAAADSAAAAABMjsusAAAHmIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAqv9HIjEFLQXAAAAAAAAAAAA0gAAAAATI7LrAAAB5iAAADSAAAAABMjsusAAAHmIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==");
silentLoop.loop = true; 
silentLoop.volume = 0.01;


/* ==========================================================================
   4. SETTINGS INTERFACE
   ========================================================================== */

window.setNotifyMode = function(mode) {
    currentNotifyMode = mode;
    localStorage.setItem("alphaNotifyMode", mode);
    updateNotifyUI();
    
    // Feedback
    if (mode !== 'off') {
        if (navigator.vibrate) navigator.vibrate(30);
        if ((mode === 'all' || mode === 'sound') && alarmSound) {
            alarmSound.volume = 0.5;
            alarmSound.currentTime = 0;
            alarmSound.play().catch(()=>{});
        }
    }
    console.log(`🎛️ Jarvis: Alarm-Modus auf ${mode} gesetzt.`);
};

window.setWarningTime = function(mins) {
    warningMinutes = parseInt(mins);
    localStorage.setItem("alphaWarningTime", mins);
    updateNotifyUI();
    
    if(navigator.vibrate) navigator.vibrate(30);
    console.log(`⏱️ Jarvis: Vorwarnzeit auf ${mins} Minuten gesetzt.`);
};

window.closeNotifySettings = function() {
    const el = document.getElementById("panel-settings-notify");
    if(el) el.classList.add("hidden");
};

function updateNotifyUI() {
    // Mode Buttons
    const modeBtns = document.querySelectorAll(".btn-notify");
    if(modeBtns) {
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
    }

    // Time Buttons
    const timeBtns = document.querySelectorAll(".btn-time");
    if(timeBtns) {
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
}


/* ==========================================================================
   5. SYSTEM START ENGINE (INTEGRATED)
   ========================================================================== */

window.activateAlarmSystem = function() {
    const btn = document.getElementById("system-start-btn");

    // FALL 1: System ist AUS -> Einschalten
    if (!systemActive) {
        // Erlaubnis prüfen
        Notification.requestPermission().then(perm => {
            if (perm !== "granted") {
                alert("⚠️ SYSTEM FEHLER: Benachrichtigungen nicht erlaubt! Bitte im Browser aktivieren.");
            }
        });

        // Audio Engine Starten (Wichtig für iOS/Android Hintergrund)
        silentLoop.play().then(() => {
            systemActive = true;
            console.log("🚀 ALPHA OS: Hintergrund-System aktiv.");
            
            // UI Update: ON (Grün)
            if(btn) {
                btn.innerHTML = "✅ SYSTEM AKTIV (ONLINE)";
                btn.style.background = "#0f0";
                btn.style.color = "#000";
                btn.style.borderColor = "#0a0";
                btn.style.boxShadow = "0 0 20px rgba(0, 255, 0, 0.6)";
            }

            // Initiale Bestätigung
            window.triggerAlarm("AlphaOS Online", "Wach-Modus aktiviert. Warte auf Signale.");

            // Wake Lock versuchen
            if ('wakeLock' in navigator) {
                navigator.wakeLock.request('screen').catch(e => console.log("WakeLock:", e));
            }

        }).catch(e => {
            console.error(e);
            alert("⚠️ Fehler: Bitte einmal fest auf den Bildschirm tippen, um Audio zu erlauben!");
        });

    // FALL 2: System ist AN -> Ausschalten
    } else {
        systemActive = false;
        silentLoop.pause();
        silentLoop.currentTime = 0;
        console.log("🛑 ALPHA OS: System heruntergefahren.");

        // UI Update: OFF (Grau/Rot)
        if(btn) {
            btn.innerHTML = "🛑 SYSTEM STARTEN (OFFLINE)";
            btn.style.background = "#222";
            btn.style.color = "#fff";
            btn.style.borderColor = "#444";
            btn.style.boxShadow = "0 4px 15px rgba(0,0,0,0.5)";
        }
    }
};


/* ==========================================================================
   6. ZEIT-LOOP (Das Gehirn)
   ========================================================================== */

function getCurrentMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

// Einfache Sommerzeit-Erkennung für DE
function isSummerTime() {
    const d = new Date();
    const year = d.getFullYear();
    const march = new Date(year, 2, 31); march.setDate(march.getDate() - march.getDay());
    const october = new Date(year, 9, 31); october.setDate(october.getDate() - october.getDay());
    return d >= march && d < october;
}

// Heartbeat alle 2 Sekunden
setInterval(() => {
    // Wenn System aus, mach gar nichts
    if (!systemActive) return;

    const rawMinutes = getCurrentMinutes();
    // DST Offset (Hier +1h im Sommer, anpassbar je nach Broker-Zeit)
    const dstOffset = isSummerTime() ? 60 : 0;
    const nowString = new Date().toLocaleTimeString().slice(0, 5); 

    // Spam-Schutz: Nur 1x pro Minute feuern
    if (nowString === lastTriggeredTime) return;

    alarmSessions.forEach(session => {
        // Zeiten normalisieren
        let adjStart = (session.start + dstOffset) % 1440;
        let adjEnd = (session.end + dstOffset) % 1440;

        // 1. SESSION START
        if (rawMinutes === adjStart) {
            window.triggerAlarm(`🚀 START: ${session.name}`, "Liquidität steigt. Marktstruktur prüfen!");
            lastTriggeredTime = nowString;
        }

        // 2. SESSION ENDE
        if (rawMinutes === adjEnd) {
            window.triggerAlarm(`🏁 ENDE: ${session.name}`, "Volumen sinkt. Risk Management prüfen.");
            lastTriggeredTime = nowString;
        }

        // 3. VORWARNUNG
        let warnTime = adjStart - warningMinutes;
        if (warnTime < 0) warnTime += 1440;

        if (rawMinutes === warnTime) {
            window.triggerAlarm(`⚠️ BALD: ${session.name}`, `Startet in ${warningMinutes} Minuten. Bereite dich vor.`);
            lastTriggeredTime = nowString;
        }
    });
}, 2000);


/* ==========================================================================
   7. NOTIFICATION ENGINE
   ========================================================================== */

window.triggerAlarm = function(title, body) {
    if (currentNotifyMode === 'off') return;

    console.log(`🔔 PUSH: ${title}`);

    // A. Audio
    if ((currentNotifyMode === 'all' || currentNotifyMode === 'sound') && alarmSound) {
        alarmSound.currentTime = 0;
        alarmSound.volume = 1.0;
        alarmSound.play().catch(e => console.log("Audio Autoplay blockiert"));
    }

    // B. Push
    if (currentNotifyMode === 'all' || currentNotifyMode === 'push') {
        if (Notification.permission === "granted") {
            try {
                const notif = new Notification(title, {
                    body: body,
                    icon: "https://cdn-icons-png.flaticon.com/512/1827/1827349.png", 
                    vibrate: [200, 100, 200, 100, 500],
                    requireInteraction: true 
                });
                
                notif.onclick = function() { window.focus(); this.close(); };

            } catch (e) {
                console.error("Push Error:", e);
            }
        }
    }
};

// Auto-Init UI beim Laden
window.addEventListener("load", () => {
    updateNotifyUI();
});