/* ==========================================================================
   🚀 ALPHA OS - STANDALONE PUSH CORE (MOBILE ULTIMATE FIX)
   ========================================================================== */

(function() {
    const CONFIG = {
        sessions: [
            { name: "Sydney",            start: 1380, end: 480,  info: "Übergang aus der Deadzone." },
            { name: "Tokyo",             start: 60,   end: 600,  info: "Asia-High/Low formt sich." },
            { name: "London Killzone",   start: 420,  end: 600,  info: "Asia-Liquidity Sweep." },
            { name: "London Open",       start: 540,  end: 1020, info: "Haupttrend-Phase." },
            { name: "NY Killzone",       start: 810,  end: 1020, info: "Manipulation vor US-Volumen." },
            { name: "New York Open",     start: 870,  end: 1320, info: "Volumenwechsel & Reversal." },
            { name: "London Close",      start: 1020, end: 1080, info: "Gewinnmitnahmen." },
            { name: "Deadzone",          start: 1380, end: 60,   info: "Nacht-Ruhephase." }
        ],
        checkInterval: 2000,
        icon: "https://cdn-icons-png.flaticon.com/512/2910/2910795.png"
    };

    let state = {
        notifyMode: localStorage.getItem("alphaNotifyMode") || "all",
        warningMins: parseInt(localStorage.getItem("alphaWarningTime")) || 5,
        lastTriggeredMinute: -1,
        isUnlocked: false // NEU: Tracker für Mobile Activation
    };

    const alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

    // --- MOBILE UNLOCK FUNKTION ---
    // Diese Funktion muss einmalig durch einen Klick ausgelöst werden
    function unlockMobileFeatures() {
        if (state.isUnlocked) return;
        
        // 1. Audio "anwärmen" (spielt lautlos)
        alarmSound.play().then(() => {
            alarmSound.pause();
            alarmSound.currentTime = 0;
            state.isUnlocked = true;
            console.log("🔊 Mobile Audio Unlocked");
        }).catch(e => console.error("Audio Unlock Failed", e));

        // 2. Push-Rechte nochmals aktiv triggern
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }

    function triggerAlarm(title, body, volume = 1.0) {
        if (state.notifyMode === 'off') return;

        // Sound (Mobile braucht vorherigen Unlock)
        if (state.notifyMode === 'all' || state.notifyMode === 'sound') {
            alarmSound.volume = volume;
            alarmSound.currentTime = 0;
            alarmSound.play().catch(e => console.warn("Sound blockiert. Bitte Modus erneut anklicken."));
        }

        // Push
        if (state.notifyMode === 'all' || state.notifyMode === 'push') {
            if (Notification.permission === "granted") {
                // Auf Handys funktioniert Variante B oft besser
                const options = {
                    body: body,
                    icon: CONFIG.icon,
                    vibrate: [200, 100, 200],
                    badge: CONFIG.icon
                };
                
                // Versuche ServiceWorker, dann Fallback
                if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.ready.then(reg => reg.showNotification(title, options));
                } else {
                    new Notification(title, options);
                }
            }
        }
    }

    function heartbeat() {
        const now = new Date();
        const currentMins = now.getHours() * 60 + now.getMinutes();
        if (currentMins === state.lastTriggeredMinute) return;

        const march = new Date(now.getFullYear(), 2, 31); march.setDate(march.getDate() - march.getDay());
        const oct = new Date(now.getFullYear(), 9, 31); oct.setDate(oct.getDate() - oct.getDay());
        const offset = (now >= march && now < oct) ? 60 : 0;

        CONFIG.sessions.forEach(s => {
            const start = (s.start + offset) % 1440;
            const end = (s.end + offset) % 1440;
            const warn = (start - state.warningMins + 1440) % 1440;

            if (currentMins === start) triggerAlarm(`🚀 START: ${s.name}`, s.info);
            if (currentMins === end) triggerAlarm(`🏁 ENDE: ${s.name}`, "Session beendet.");
            if (currentMins === warn) triggerAlarm(`⚠️ BALD: ${s.name}`, `Startet in ${state.warningMins} Min.`, 0.4);
        });

        state.lastTriggeredMinute = currentMins;
    }

    // --- EXTERNE BUTTONS ---
    window.setNotifyMode = function(mode) {
        unlockMobileFeatures(); // WICHTIG: Schaltet Handy-Features frei!
        state.notifyMode = mode;
        localStorage.setItem("alphaNotifyMode", mode);
        updateNotifyUI();
        if(mode !== 'off') triggerAlarm("AlphaOS", `Modus: ${mode} aktiviert!`);
    };

    window.setWarningTime = function(mins) {
        unlockMobileFeatures(); // Unlock auch hier
        state.warningMins = parseInt(mins);
        localStorage.setItem("alphaWarningTime", mins);
        updateNotifyUI();
        triggerAlarm("AlphaOS", `Erinnerung auf ${mins} Min. gesetzt.`);
    };

    window.updateNotifyUI = function() {
        const m = localStorage.getItem("alphaNotifyMode") || "all";
        const t = localStorage.getItem("alphaWarningTime") || "5";
        document.querySelectorAll(".btn-notify").forEach(b => b.classList.toggle("active", b.dataset.mode === m));
        document.querySelectorAll(".btn-time").forEach(b => b.classList.toggle("active", b.dataset.time === t));
    };

    window.closeNotifySettings = () => document.getElementById("panel-settings-notify").classList.add("hidden");

    setInterval(heartbeat, CONFIG.checkInterval);
    window.addEventListener("load", updateNotifyUI);
})();