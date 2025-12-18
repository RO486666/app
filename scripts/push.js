/* ==========================================================================
   🚀 ALPHA OS - STANDALONE PUSH CORE (FIXED UI)
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
        checkInterval: 2000,
        icon: "https://cdn-icons-png.flaticon.com/512/2910/2910795.png"
    };

    // State initialisieren
    let state = {
        notifyMode: localStorage.getItem("alphaNotifyMode") || "all",
        warningMins: parseInt(localStorage.getItem("alphaWarningTime")) || 5,
        lastTriggeredMinute: -1,
        lastWarnedSession: null
    };

    const alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    const alertBox = document.getElementById("alertBox");

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

    function triggerAlarm(title, body, volume = 1.0) {
        if (state.notifyMode === 'off') return;

        if (alertBox) {
            alertBox.textContent = `🔔 ${title}`;
            alertBox.style.display = "block";
            setTimeout(() => { alertBox.style.display = "none"; }, 7000);
        }

        if (state.notifyMode === 'all' || state.notifyMode === 'sound') {
            alarmSound.volume = volume;
            alarmSound.currentTime = 0;
            alarmSound.play().catch(() => {});
        }

        if (state.notifyMode === 'all' || state.notifyMode === 'push') {
            if (Notification.permission === "granted") {
                new Notification(title, { body: body, icon: CONFIG.icon });
            }
        }
    }

    function heartbeat() {
        const currentMins = getMinutesNow();
        if (currentMins === state.lastTriggeredMinute) return;

        let nextSession = null;
        let minTimeToNext = 1441;

        CONFIG.sessions.forEach(session => {
            const start = getAdjustedTime(session.start);
            const end = getAdjustedTime(session.end);

            // Alarme
            if (currentMins === start) triggerAlarm(`🚀 START: ${session.name}`, session.info);
            if (currentMins === end) triggerAlarm(`🏁 ENDE: ${session.name}`, "Session beendet.", 0.6);

            // Next Session Check
            let diff = start - currentMins;
            if (diff <= 0) diff += 1440;
            if (diff < minTimeToNext) {
                minTimeToNext = diff;
                nextSession = session;
            }
        });

        if (nextSession && minTimeToNext === state.warningMins) {
            const warnKey = `${nextSession.name}-${currentMins}`;
            if (state.lastWarnedSession !== warnKey) {
                triggerAlarm(`⚠️ BALD: ${nextSession.name}`, `Startet in ${state.warningMins} Min.`, 0.4);
                state.lastWarnedSession = warnKey;
            }
        }
        state.lastTriggeredMinute = currentMins;
    }

    /* --- EXTERNE SCHNITTSTELLEN --- */

    window.setNotifyMode = function(mode) {
        state.notifyMode = mode; // Update interner State
        localStorage.setItem("alphaNotifyMode", mode);
        updateNotifyUI();
        if(mode !== 'off') triggerAlarm("Modus aktiv", `Alarme eingestellt auf: ${mode}`);
    };

    window.setWarningTime = function(mins) {
        state.warningMins = parseInt(mins); // Update interner State
        localStorage.setItem("alphaWarningTime", mins);
        updateNotifyUI();
        triggerAlarm("Zeit geändert", `Vorwarnung nun bei ${mins} Minuten.`);
    };

    window.updateNotifyUI = function() {
        const currentMode = localStorage.getItem("alphaNotifyMode") || "all";
        const currentTime = localStorage.getItem("alphaWarningTime") || "5";

        document.querySelectorAll(".btn-notify").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.mode === currentMode);
        });

        document.querySelectorAll(".btn-time").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.time === currentTime);
        });
    };

    window.closeNotifySettings = function() {
        document.getElementById("panel-settings-notify").classList.add("hidden");
    };

    setInterval(heartbeat, CONFIG.checkInterval);
    window.addEventListener("load", updateNotifyUI);
    if ("Notification" in window && Notification.permission !== "granted") Notification.requestPermission();

})();