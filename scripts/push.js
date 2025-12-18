/* ==========================================================================
   🚀 ALPHA OS - STANDALONE PUSH CORE (WAKE-LOCK & SPOTIFY-TRICK)
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
        checkInterval: 5000, 
        icon: "https://cdn-icons-png.flaticon.com/512/2910/2910795.png"
    };

    let state = {
        notifyMode: localStorage.getItem("alphaNotifyMode") || "all",
        warningMins: parseInt(localStorage.getItem("alphaWarningTime")) || 5,
        lastTriggeredMinute: -1,
        isUnlocked: false 
    };

    // 1. Audio-Setups
    const alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    // Lautloser Loop (Spotify-Trick)
    const silentWakeLock = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
    silentWakeLock.loop = true;

    // --- MEDIA SESSION (Zwingt das Handy, die App offen zu lassen) ---
    function activateMediaSession() {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: 'AlphaOS Market Scanner',
                artist: 'Jarvis Core',
                album: 'Hintergrund-Überwachung aktiv',
                artwork: [{ src: CONFIG.icon, sizes: '512x512', type: 'image/png' }]
            });
        }
    }

    function unlockMobileFeatures() {
        if (state.isUnlocked) return;
        
        // Zwinge das Handy in den Musik-Modus
        silentWakeLock.play().then(() => {
            activateMediaSession();
            state.isUnlocked = true;
            console.log("🔊 Spotify-Mode aktiv: Hintergrund-Scan gesichert.");
        }).catch(e => console.warn("Interaktion nötig für Wake-Lock"));

        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }

    function triggerAlarm(title, body, volume = 1.0) {
        if (state.notifyMode === 'off') return;

        if (state.notifyMode === 'all' || state.notifyMode === 'sound') {
            alarmSound.volume = volume;
            alarmSound.currentTime = 0;
            alarmSound.play().catch(() => {
                // Falls der Hauptsound blockiert, versuchen wir den Silent-Loop kurz zu kicken
                silentWakeLock.play();
            });
        }

        if (state.notifyMode === 'all' || state.notifyMode === 'push') {
            if (Notification.permission === "granted") {
                const options = {
                    body: body,
                    icon: CONFIG.icon,
                    vibrate: [500, 100, 500, 100, 500],
                    tag: 'session-alert',
                    renotify: true,
                    requireInteraction: true // Nachricht bleibt auf Sperrbildschirm stehen!
                };
                
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
        
        // Verhindert doppeltes Feuern, erlaubt aber Check nach Standby
        if (currentMins === state.lastTriggeredMinute) return;

        const march = new Date(now.getFullYear(), 2, 31); march.setDate(march.getDate() - march.getDay());
        const oct = new Date(now.getFullYear(), 9, 31); oct.setDate(oct.getDate() - oct.getDay());
        const offset = (now >= march && now < oct) ? 60 : 0;

        CONFIG.sessions.forEach(s => {
            const start = (s.start + offset) % 1440;
            const end = (s.end + offset) % 1440;
            const warn = (start - state.warningMins + 1440) % 1440;

            if (currentMins === start) triggerAlarm(`🚀 START: ${s.name}`, "Markt-Einstieg prüfen!");
            if (currentMins === end) triggerAlarm(`🏁 ENDE: ${s.name}`, "Volumen sinkt.");
            if (currentMins === warn) triggerAlarm(`⚠️ BALD: ${s.name}`, `Startet in ${state.warningMins} Min.`, 0.6);
        });

        state.lastTriggeredMinute = currentMins;
    }

      // --- BUTTONS ---
    window.setNotifyMode = function(mode) {
        unlockMobileFeatures(); // SCHALTET DAS HANDY FREI
        state.notifyMode = mode;
        localStorage.setItem("alphaNotifyMode", mode);
        updateNotifyUI();
        if(mode !== 'off') triggerAlarm("AlphaOS", "Alarme scharf geschaltet!");
    };

    window.setWarningTime = function(mins) {
        unlockMobileFeatures(); // SCHALTET DAS HANDY FREI
        state.warningMins = parseInt(mins);
        localStorage.setItem("alphaWarningTime", mins);
        updateNotifyUI();
        triggerAlarm("AlphaOS", `Timer auf ${mins} Min. gesetzt.`);
    };

    // TEST-FUNKTION (Füge diesen Button in dein HTML ein für Sicherheit)
    window.testMobilePush = function() {
        unlockMobileFeatures();
        triggerAlarm("🔔 Test-Alarm", "Wenn du das hörst/siehst, funktioniert alles!");
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