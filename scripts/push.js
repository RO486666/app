/* ==========================================================================
   🚀 ALPHA OS - STANDALONE PUSH CORE
   ========================================================================== */

(function() {
    // 1. KONFIGURATION & STATE
    const CONFIG = {
        sessions: [
            { name: "Sydney",            start: 1380, end: 480,  info: "Übergang aus der Deadzone, Liquidity-Aufbau." },
            { name: "Tokyo",             start: 60,   end: 600,  info: "Asia-High/Low formt sich, saubere Struktur." },
            { name: "London Killzone",   start: 420,  end: 600,  info: "Asia-Liquidity Sweep vor der London Direction." },
            { name: "London Open",       start: 540,  end: 1020, info: "Haupttrend-Phase & London Expansion." },
            { name: "NY Killzone",       start: 810,  end: 1020, info: "Manipulation vor dem US-Volumen-Shift." },
            { name: "New York Open",     start: 870,  end: 1320, info: "Volumenwechsel, Reversal oder Continuation." },
            { name: "London Close",      start: 1020, end: 1080, info: "Gewinnmitnahmen & Volumenrückgang." },
            { name: "Deadzone",          start: 1380, end: 60,   info: "Nacht-Ruhephase, kein Trading empfohlen." }
        ],
        checkInterval: 2000, // Prüft alle 2 Sekunden (Heartbeat)
        icon: "https://cdn-icons-png.flaticon.com/512/2910/2910795.png"
    };

    let state = {
        notifyMode: localStorage.getItem("alphaNotifyMode") || "all",
        warningMins: parseInt(localStorage.getItem("alphaWarningTime")) || 5,
        lastActiveSessions: [],
        lastTriggeredMinute: -1,
        lastWarnedSession: null
    };

    const alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    const alertBox = document.getElementById("alertBox");

    /* ==========================================================================
       2. HILFSFUNKTIONEN (ZEIT & DST)
       ========================================================================== */

    function getMinutesNow() {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
    }

    function isSummerTimeEU() {
        const d = new Date();
        const year = d.getFullYear();
        const march = new Date(year, 2, 31); march.setDate(march.getDate() - march.getDay());
        const october = new Date(year, 9, 31); october.setDate(october.getDate() - october.getDay());
        return d >= march && d < october;
    }

    function getAdjustedTime(baseMinutes) {
        const offset = isSummerTimeEU() ? 60 : 0;
        return (baseMinutes + offset) % 1440;
    }

    /* ==========================================================================
       3. ALARM ENGINE
       ========================================================================== */

    function triggerAlarm(title, body, volume = 1.0) {
        if (state.notifyMode === 'off') return;

        // A. UI Alert
        if (alertBox) {
            alertBox.textContent = `🔔 ${title}`;
            alertBox.style.display = "block";
            setTimeout(() => { alertBox.style.display = "none"; }, 7000);
        }

        // B. Audio
        if (state.notifyMode === 'all' || state.notifyMode === 'sound') {
            alarmSound.volume = volume;
            alarmSound.currentTime = 0;
            alarmSound.play().catch(() => console.warn("Audio braucht Interaktion."));
        }

        // C. Push
        if (state.notifyMode === 'all' || state.notifyMode === 'push') {
            if (Notification.permission === "granted") {
                new Notification(title, {
                    body: body,
                    icon: CONFIG.icon,
                    vibrate: [200, 100, 200]
                });
            }
        }
    }

    /* ==========================================================================
       4. HEARTBEAT (DIE EIGENE UHR)
       ========================================================================== */

    function heartbeat() {
        const currentMins = getMinutesNow();
        
        // Verhindert mehrfaches Feuern innerhalb derselben Minute
        if (currentMins === state.lastTriggeredMinute) return;

        const activeNow = [];
        let nextSession = null;
        let minTimeToNext = 1441;

        CONFIG.sessions.forEach(session => {
            const start = getAdjustedTime(session.start);
            const end = getAdjustedTime(session.end);

            // Prüfen ob Session aktiv ist
            let isActive = false;
            if (start < end) {
                isActive = (currentMins >= start && currentMins < end);
            } else {
                isActive = (currentMins >= start || currentMins < end);
            }

            if (isActive) activeNow.push(session.name);

            // Vorwarnungs-Logik
            let diff = start - currentMins;
            if (diff <= 0) diff += 1440;

            if (diff < minTimeToNext) {
                minTimeToNext = diff;
                nextSession = session;
            }

            // 1. START ALARM
            if (currentMins === start) {
                triggerAlarm(`🚀 START: ${session.name}`, session.info);
            }

            // 2. ENDE ALARM
            if (currentMins === end) {
                triggerAlarm(`🏁 ENDE: ${session.name}`, "Liquidität sinkt. Risk Management prüfen.", 0.6);
            }
        });

        // 3. VORWARNUNG ALARM
        if (nextSession && minTimeToNext === state.warningMins) {
            const warnKey = `${nextSession.name}-${currentMins}`;
            if (state.lastWarnedSession !== warnKey) {
                triggerAlarm(`⚠️ BALD: ${nextSession.name}`, `Startet in ${state.warningMins} Minuten.`, 0.4);
                state.lastWarnedSession = warnKey;
            }
        }

        state.lastActiveSessions = activeNow;
        state.lastTriggeredMinute = currentMins;
    }

    /* ==========================================================================
       5. EXTERNE STEUERUNG (SETTINGS)
       ========================================================================== */

    window.setNotifyMode = function(mode) {
        state.notifyMode = mode;
        localStorage.setItem("alphaNotifyMode", mode);
        if(mode !== 'off') triggerAlarm("Modus geändert", `Alarme sind nun auf '${mode}' gesetzt.`);
        if(typeof updateNotifyUI === "function") updateNotifyUI();
    };

    window.setWarningTime = function(mins) {
        state.warningMins = parseInt(mins);
        localStorage.setItem("alphaWarningTime", mins);
        triggerAlarm("Zeit geändert", `Vorwarnung nun bei ${mins} Minuten.`);
        if(typeof updateNotifyUI === "function") updateNotifyUI();
    };

    // UI Marker Update
    window.updateNotifyUI = function() {
        document.querySelectorAll(".btn-notify").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.mode === state.notifyMode);
        });
        document.querySelectorAll(".btn-time").forEach(btn => {
            btn.classList.toggle("active", parseInt(btn.dataset.time) === state.warningMins);
        });
    };

    /* ==========================================================================
       6. START
       ========================================================================== */

    // Permission beim Start
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // Interval starten
    setInterval(heartbeat, CONFIG.checkInterval);
    
    // UI Initialisierung
    window.addEventListener("load", updateNotifyUI);

    console.log("🚀 Standalone Push Engine Online.");
})();