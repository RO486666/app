/* ==========================================================================
   🚀 ALPHA OS - PUSH CORE (Final Logic: Start, End, Warn)
   ========================================================================== */

// 1. STATE & SETTINGS
// Wir nutzen "var" statt "let" im Global Scope, um Abstürze bei Doppel-Ladung zu verhindern
var currentNotifyMode = localStorage.getItem("alphaNotifyMode") || "all";
var warningMinutes = parseInt(localStorage.getItem("alphaWarningTime")) || 5; 
var systemActive = false;
var lastTriggeredTime = ""; 

// 2. CONFIG: Alle Zeiten (Minuten ab 00:00)
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

// 3. AUDIO SETUP
const alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
const silentLoop = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD//////////////////////////////////////////////////////////////////wAAAP9MYXZjNTguNTQuMTAwAAAAAAAAAAAAIkcAAAAAAAABIAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAqv9HIjEFLQXAAAAAAAAAAAA0gAAAAATI7LrAAAB5iAAADSAAAAABMjsusAAAHmIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAqv9HIjEFLQXAAAAAAAAAAAA0gAAAAATI7LrAAAB5iAAADSAAAAABMjsusAAAHmIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==");
silentLoop.loop = true; 
silentLoop.volume = 0.01;


/* ==========================================================================
   4. SETTINGS FUNKTIONEN (Global für HTML onclick)
   ========================================================================== */

window.setNotifyMode = function(mode) {
    currentNotifyMode = mode;
    localStorage.setItem("alphaNotifyMode", mode);
    updateNotifyUI();
    
    if (mode !== 'off') {
        if (navigator.vibrate) navigator.vibrate(50);
        if ((mode === 'all' || mode === 'sound') && alarmSound) {
            alarmSound.volume = 0.5;
            alarmSound.currentTime = 0;
            alarmSound.play().catch(()=>{});
        }
    }
    console.log(`🎛️ Modus: ${mode}`);
};

window.setWarningTime = function(mins) {
    warningMinutes = parseInt(mins);
    localStorage.setItem("alphaWarningTime", mins);
    updateNotifyUI();
    if(navigator.vibrate) navigator.vibrate(30);
    console.log(`⏱️ Warnung vor: ${mins} min`);
};

window.closeNotifySettings = function() {
    const el = document.getElementById("panel-settings-notify");
    if(el) el.classList.add("hidden");
};

function updateNotifyUI() {
    // Modus Buttons färben
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
    // Zeit Buttons färben
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
   5. SYSTEM START
   ========================================================================== */

window.activateAlarmSystem = function() {
    if (systemActive) return;

    // Browser-Erlaubnis anfragen (WICHTIG!)
    Notification.requestPermission().then(perm => {
        if (perm !== "granted") {
            alert("⚠️ ACHTUNG: Du musst Benachrichtigungen ERLAUBEN, sonst geht nichts!");
        }
    });

    silentLoop.play().then(() => {
        systemActive = true;
        console.log("🚀 ALARM SYSTEM SCHARF.");
        
        // Button grün färben
        const btn = document.getElementById("system-start-btn");
        if(btn) {
            btn.innerHTML = "✅ SYSTEM LÄUFT";
            btn.style.background = "linear-gradient(135deg, #00ff00, #006600)";
            btn.style.boxShadow = "0 0 20px #00ff00";
            btn.style.color = "#000";
        }

        // Test-Alarm beim Start
        window.triggerAlarm("AlphaOS", "System läuft. Start/Ende/Warnung aktiv.");

        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen').catch(e => console.log("WakeLock:", e));
        }
    }).catch(e => {
        alert("⚠️ Fehler: Tippe auf den Bildschirm, damit Sound abgespielt werden darf!");
    });
};


/* ==========================================================================
   6. DER LOOP (Prüft Start, Ende, Warnung)
   ========================================================================== */

function getCurrentMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

function isSummerTime() {
    const d = new Date();
    const year = d.getFullYear();
    const march = new Date(year, 2, 31); march.setDate(march.getDate() - march.getDay());
    const october = new Date(year, 9, 31); october.setDate(october.getDate() - october.getDay());
    return d >= march && d < october;
}

// Loop läuft alle 2 Sekunden
setInterval(() => {
    if (!systemActive) return;

    const rawMinutes = getCurrentMinutes();
    const dstOffset = isSummerTime() ? 60 : 0;
    const nowString = new Date().toLocaleTimeString().slice(0, 5); 

    // Nur 1x pro Minute feuern
    if (nowString === lastTriggeredTime) return;

    alarmSessions.forEach(session => {
        // Zeiten berechnen
        let adjStart = (session.start + dstOffset) % 1440;
        let adjEnd = (session.end + dstOffset) % 1440;

        // 1. START ALARM
        if (rawMinutes === adjStart) {
            window.triggerAlarm(`🚀 START: ${session.name}`, "Marktstruktur prüfen! Liquidity Sweep?");
            lastTriggeredTime = nowString;
        }

        // 2. ENDE ALARM
        if (rawMinutes === adjEnd) {
            window.triggerAlarm(`🏁 ENDE: ${session.name}`, "Session beendet. Risk off. Gewinne sichern.");
            lastTriggeredTime = nowString;
        }

        // 3. VORWARNUNG (Next Session)
        let warnTime = adjStart - warningMinutes;
        if (warnTime < 0) warnTime += 1440;

        if (rawMinutes === warnTime) {
            window.triggerAlarm(`⚠️ BALD: ${session.name}`, `Startet in ${warningMinutes} Minuten. Bereite dich vor.`);
            lastTriggeredTime = nowString;
        }
    });
}, 2000);


/* ==========================================================================
   7. TRIGGER ENGINE (Bulletproof)
   ========================================================================== */

window.triggerAlarm = function(title, body) {
    if (currentNotifyMode === 'off') return;

    console.log(`🔔 TRIGGER: ${title}`);

    // A. Audio
    if ((currentNotifyMode === 'all' || currentNotifyMode === 'sound') && alarmSound) {
        alarmSound.currentTime = 0;
        alarmSound.volume = 1.0;
        alarmSound.play().catch(e => console.log("Audio blockiert"));
    }

    // B. Push Notification
    if (currentNotifyMode === 'all' || currentNotifyMode === 'push') {
        if (Notification.permission === "granted") {
            try {
                // Die einfachste, sicherste Methode
                const notif = new Notification(title, {
                    body: body,
                    icon: "https://cdn-icons-png.flaticon.com/512/1827/1827349.png", 
                    vibrate: [200, 100, 200],
                    requireInteraction: true
                });
                
                notif.onclick = function() { window.focus(); this.close(); };

            } catch (e) {
                console.error("Push Error:", e);
                // Fallback falls Push fehlschlägt (z.B. wegen file://)
                alert(`🔔 ALARM: ${title}\n${body}`); 
            }
        } else {
            console.log("Push Berechtigung fehlt.");
        }
    }
};

// Start
window.addEventListener("load", () => {
    updateNotifyUI();
});