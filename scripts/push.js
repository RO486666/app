/* ==========================================================================
   🚀 ALPHA OS - PUSH CORE (Logic + Settings + All Alarms)
   ========================================================================== */

// 1. STATE & SETTINGS (Laden aus dem Speicher)
let currentNotifyMode = localStorage.getItem("alphaNotifyMode") || "all";
let warningMinutes = parseInt(localStorage.getItem("alphaWarningTime")) || 5; 
let systemActive = false;
let lastTriggeredTime = ""; 

// 2. CONFIG: Sessions mit START und ENDE (Minuten ab 00:00)
// Wir brauchen 'end', damit wir dir sagen können, wann Feierabend ist.
const alarmSessions = [
    { name: "Sydney",           start: 1380, end: 480 },  // 23:00 - 08:00
    { name: "Tokyo",            start: 60,   end: 600 },  // 01:00 - 10:00
    { name: "London Killzone",  start: 420,  end: 600 },  // 07:00 - 10:00
    { name: "London Open",      start: 540,  end: 1020 }, // 09:00 - 17:00
    { name: "NY Killzone",      start: 810,  end: 1020 }, // 13:30 - 17:00
    { name: "New York Open",    start: 870,  end: 1320 }, // 14:30 - 22:00
    { name: "London Close",     start: 1020, end: 1080 }, // 17:00 (Fixpunkt)
    { name: "Deadzone",         start: 1380, end: 60 }    // 23:00 - 01:00
];

// 3. AUDIO SETUP
const alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
const silentLoop = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD//////////////////////////////////////////////////////////////////wAAAP9MYXZjNTguNTQuMTAwAAAAAAAAAAAAIkcAAAAAAAABIAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAqv9HIjEFLQXAAAAAAAAAAAA0gAAAAATI7LrAAAB5iAAADSAAAAABMjsusAAAHmIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAqv9HIjEFLQXAAAAAAAAAAAA0gAAAAATI7LrAAAB5iAAADSAAAAABMjsusAAAHmIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==");
silentLoop.loop = true; 
silentLoop.volume = 0.01;


/* ==========================================================================
   4. SETTINGS FUNKTIONEN (Global für dein HTML onclick)
   ========================================================================== */

// Modus ändern: onclick="setNotifyMode('all')"
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
    console.log(`🎛️ Modus geändert auf: ${mode}`);
};

// Zeit ändern: onclick="setWarningTime(5)"
window.setWarningTime = function(mins) {
    warningMinutes = parseInt(mins);
    localStorage.setItem("alphaWarningTime", mins);
    updateNotifyUI();
    
    if(navigator.vibrate) navigator.vibrate(30);
    console.log(`⏱️ Vorwarnzeit: ${mins} min`);
};

// Panel schließen: onclick="closeNotifySettings()"
window.closeNotifySettings = function() {
    const el = document.getElementById("panel-settings-notify");
    if(el) el.classList.add("hidden");
};

// UI Aktualisieren (Buttons färben)
function updateNotifyUI() {
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
   5. SYSTEM START (Der rote Button auf dem Dashboard)
   ========================================================================== */

window.activateAlarmSystem = function() {
    if (systemActive) return;

    silentLoop.play().then(() => {
        systemActive = true;
        console.log("🚀 SYSTEM ONLINE - ALARME SCHARF");
        triggerAlarm("AlphaOS", "System aktiv. Start/Ende/Warnungen laufen.");
        
        const btn = document.getElementById("system-start-btn");
        if(btn) {
            btn.innerHTML = "✅ SYSTEM LÄUFT";
            btn.style.background = "linear-gradient(135deg, #00ff00, #006600)";
            btn.style.boxShadow = "0 0 20px #00ff00";
            btn.style.color = "#000";
        }

        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen').catch(e => console.log("WakeLock:", e));
        }
    }).catch(e => {
        alert("⚠️ Fehler: Bitte auf den Bildschirm tippen!");
    });
};


/* ==========================================================================
   6. ZEIT & ALARM LOOP (Das Herzstück)
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

// Check alle 2 Sekunden
setInterval(() => {
    if (!systemActive) return;

    const rawMinutes = getCurrentMinutes();
    const dstOffset = isSummerTime() ? 60 : 0;
    const nowString = new Date().toLocaleTimeString().slice(0, 5); 

    // Nur 1x pro Minute feuern (Verhindert Dauerfeuer)
    if (nowString === lastTriggeredTime) return;

    alarmSessions.forEach(session => {
        // Zeiten anpassen (Sommerzeit + Tagesüberlauf korrigieren)
        let adjStart = (session.start + dstOffset) % 1440;
        let adjEnd = (session.end + dstOffset) % 1440;

        // 1. START ALARM
        if (rawMinutes === adjStart) {
            triggerAlarm(`🚀 START: ${session.name}`, "Marktstruktur prüfen!");
            lastTriggeredTime = nowString;
        }

        // 2. ENDE ALARM
        if (rawMinutes === adjEnd) {
            triggerAlarm(`🏁 ENDE: ${session.name}`, "Session beendet. Risk off.");
            lastTriggeredTime = nowString;
        }

        // 3. VORWARNUNG (Warning)
        let warnTime = adjStart - warningMinutes;
        if (warnTime < 0) warnTime += 1440;

        if (rawMinutes === warnTime) {
            triggerAlarm(`⚠️ BALD: ${session.name}`, `Startet in ${warningMinutes} Minuten.`);
            lastTriggeredTime = nowString;
        }
    });
}, 2000);


/* ==========================================================================
   7. TRIGGER ENGINE (Robust & Debugging Version)
   ========================================================================== */

function triggerAlarm(title, body) {
    console.log(`⚡ TRIGGER BEFEHL ERHALTEN: ${title}`); // Debug Log

    // 1. Check: Ist Modus auf "OFF"?
    if (currentNotifyMode === 'off') {
        console.log("❌ Abbruch: Modus ist OFF");
        return;
    }

    // 2. Audio abspielen (Unabhängig von Push)
    if ((currentNotifyMode === 'all' || currentNotifyMode === 'sound') && alarmSound) {
        alarmSound.currentTime = 0;
        alarmSound.volume = 1.0;
        alarmSound.play()
            .then(() => console.log("🔊 Audio spielt"))
            .catch(e => console.warn("⚠️ Audio blockiert (User Interaction fehlt):", e));
    }

    // 3. Push Notification senden
    if (currentNotifyMode === 'all' || currentNotifyMode === 'push') {
        
        // Haben wir überhaupt die Erlaubnis?
        if (Notification.permission === "granted") {
            try {
                // Versuche Standard-Notification (funktioniert am zuverlässigsten ohne PWA Setup)
                const notif = new Notification(title, {
                    body: body,
                    icon: "https://cdn-icons-png.flaticon.com/512/1827/1827349.png", // Test-Icon aus dem Web (um Pfadfehler auszuschließen)
                    vibrate: [200, 100, 200, 100, 200, 100, 400],
                    requireInteraction: true, // Bleibt bis man klickt
                    tag: "alpha-alarm" 
                });
                
                notif.onclick = function() {
                    window.focus();
                    this.close();
                };
                
                console.log("✅ Push gesendet via new Notification()");

            } catch (e) {
                console.error("❌ Push Fehler (Catch):", e);
                alert(`ALARM: ${title}\n${body}`); // Fallback Alert, falls Push crasht
            }
        } else if (Notification.permission === "denied") {
            console.error("⛔ Push verweigert! Bitte im Browser erlauben.");
            alert("⚠️ ACHTUNG: Benachrichtigungen sind blockiert! Klicke auf das Schloss-Symbol in der Adressleiste.");
        } else {
            console.log("❓ Push Berechtigung noch nicht angefragt.");
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    triggerAlarm(title, body); // Sofort nochmal versuchen
                }
            });
        }
    }
}


// Initialisierung beim Laden
window.addEventListener("load", () => {
    updateNotifyUI();
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});