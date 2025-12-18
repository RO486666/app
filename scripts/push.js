/* ==========================================================================
   🚀 ALPHA OS - STANDALONE PUSH CORE (FINAL FIX)
   ========================================================================== */

(function() {
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

    let state = {
        notifyMode: localStorage.getItem("alphaNotifyMode") || "all",
        warningMins: parseInt(localStorage.getItem("alphaWarningTime")) || 5,
        lastTriggeredMinute: -1,
        lastWarnedSession: null
    };

    const alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    const alertBox = document.getElementById("alertBox");

    // --- HILFSFUNKTIONEN ---
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

    // --- DIE ALARM FUNKTION (HIER ENTSCHEIDET SICH PUSH) ---
    function triggerAlarm(title, body, volume = 1.0) {
        if (state.notifyMode === 'off') return;

        // 1. Visuelle Box in der App
        if (alertBox) {
            alertBox.textContent = `🔔 ${title}`;
            alertBox.style.display = "block";
            setTimeout(() => { alertBox.style.display = "none"; }, 7000);
        }

        // 2. Sound
        if (state.notifyMode === 'all' || state.notifyMode === 'sound') {
            alarmSound.volume = volume;
            alarmSound.currentTime = 0;
            alarmSound.play().catch(e => console.warn("Audio blockiert: Klicke einmal auf die Seite."));
        }

        // 3. ECHTER PUSH (Browser)
        if (state.notifyMode === 'all' || state.notifyMode === 'push') {
            if (!("Notification" in window)) {
                console.error("Browser unterstützt keine Push-Nachrichten.");
            } else if (Notification.permission === "granted") {
                try {
                    new Notification(title, {
                        body: body,
                        icon: CONFIG.icon,
                        badge: CONFIG.icon
                    });
                } catch(e) {
                    console.error("Push-Fehler:", e);
                }
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission();
            }
        }
    }

    // --- DAS GEHIRN (PRÜFT DIE ZEIT) ---
    function heartbeat() {
        const currentMins = getMinutesNow();
        if (currentMins === state.lastTriggeredMinute) return;

        let nextSession = null;
        let minTimeToNext = 1441;

        CONFIG.sessions.forEach(session => {
            const start = getAdjustedTime(session.start);
            const end = getAdjustedTime(session.end);

            // 1. Start-Alarm
            if (currentMins === start) {
                triggerAlarm(`🚀 START: ${session.name}`, session.info);
            }

            // 2. Ende-Alarm
            if (currentMins === end) {
                triggerAlarm(`🏁 ENDE: ${session.name}`, "Liquidität sinkt. Risk Management prüfen.", 0.6);
            }

            // 3. Vorwarnzeit berechnen
            let diff = start - currentMins;
            if (diff <= 0) diff += 1440;
            if (diff < minTimeToNext) {
                minTimeToNext = diff;
                nextSession = session;
            }
        });

        // 4. Vorwarnungs-Alarm
        if (nextSession && minTimeToNext === state.warningMins) {
            const warnKey = `${nextSession.name}-${currentMins}`;
            if (state.lastWarnedSession !== warnKey) {
                triggerAlarm(`⚠️ BALD: ${nextSession.name}`, `Startet in ${state.warningMins} Min.`, 0.4);
                state.lastWarnedSession = warnKey;
            }
        }
        state.lastTriggeredMinute = currentMins;
    }

    // --- EXTERNE STEUERUNG (BUTTONS) ---
    window.setNotifyMode = function(mode) {
        state.notifyMode = mode;
        localStorage.setItem("alphaNotifyMode", mode);
        updateNotifyUI();
        
        // TEST-ALARM beim Klicken
        if(mode !== 'off') {
            triggerAlarm("AlphaOS System", `Benachrichtigungen erfolgreich auf '${mode}' gesetzt!`);
        }
    };

    window.setWarningTime = function(mins) {
        state.warningMins = parseInt(mins);
        localStorage.setItem("alphaWarningTime", mins);
        updateNotifyUI();
        triggerAlarm("Zeit geändert", `Du wirst nun ${mins} Min. vor Start erinnert.`);
    };

    window.updateNotifyUI = function() {
        const m = localStorage.getItem("alphaNotifyMode") || "all";
        const t = localStorage.getItem("alphaWarningTime") || "5";
        document.querySelectorAll(".btn-notify").forEach(b => b.classList.toggle("active", b.dataset.mode === m));
        document.querySelectorAll(".btn-time").forEach(b => b.classList.toggle("active", b.dataset.time === t));
    };

    window.closeNotifySettings = function() {
        document.getElementById("panel-settings-notify").classList.add("hidden");
    };

    // --- INITIALISIERUNG ---
    setInterval(heartbeat, CONFIG.checkInterval);
    window.addEventListener("load", updateNotifyUI);
    
    // Permission beim Start anfragen
    if ("Notification" in window) {
        Notification.requestPermission();
    }
})();