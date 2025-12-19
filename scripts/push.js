/* ==========================================================================
   🚀 ALPHA OS - STANDALONE PUSH CORE (SW-SYNC + WAKE-LOCK)
   ========================================================================== */

(function() {
    const CONFIG = {
        sessions: [
            { name: "Sydney",            start: 1380, end: 480 },
            { name: "Tokyo",             start: 60,   end: 600 },
            { name: "London Killzone",   start: 420,  end: 600 },
            { name: "London Open",       start: 540,  end: 1020 },
            { name: "NY Killzone",       start: 810,  end: 1020 },
            { name: "New York Open",     start: 870,  end: 1320 },
            { name: "London Close",      start: 1020, end: 1080 },
            { name: "Deadzone",          start: 1380, end: 60   }
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

    // 1. Audio für Wake-Lock & Alarme
    const alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    const silentWakeLock = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
    silentWakeLock.loop = true;

    // --- SERVICE WORKER BRIDGE ---
    function sendToServiceWorker(title, body) {
        if (state.notifyMode === 'off') return;

        // 1. Sound (auf Web-Ebene)
        if (state.notifyMode === 'all' || state.notifyMode === 'sound') {
            alarmSound.currentTime = 0;
            alarmSound.play().catch(() => silentWakeLock.play());
        }

        // 2. Push via Service Worker (für Handy-Hintergrund)
        if (state.notifyMode === 'all' || state.notifyMode === 'push') {
            const payload = {
                title: title,
                options: {
                    body: body,
                    icon: CONFIG.icon,
                    vibrate: [500, 100, 500],
                    tag: 'alpha-alert',
                    renotify: true,
                    requireInteraction: true
                }
            };

            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                // Sendet Nachricht an deine sw.js (addEventListener("message"))
                navigator.serviceWorker.controller.postMessage(payload);
            } else {
                // Fallback: Normaler Push falls SW nicht bereit
                if (Notification.permission === "granted") {
                    new Notification(title, payload.options);
                }
            }
        }
    }

    // --- MOBILE UNLOCK ---
    function unlockMobileFeatures() {
        if (state.isUnlocked) return;
        
        silentWakeLock.play().then(() => {
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: 'AlphaOS Scanner', artist: 'Jarvis', artwork: [{ src: CONFIG.icon }]
                });
            }
            state.isUnlocked = true;
            console.log("🔊 Hintergrund-Audio & SW-Bridge entsperrt.");
        }).catch(() => {});

        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }

    // --- ZEIT-LOGIK ---
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

            if (currentMins === start) sendToServiceWorker(`🚀 START: ${s.name}`, "Markt aktiv!");
            if (currentMins === end) sendToServiceWorker(`🏁 ENDE: ${s.name}`, "Session beendet.");
            if (currentMins === warn) sendToServiceWorker(`⚠️ BALD: ${s.name}`, `In ${state.warningMins} Min.`);
        });

        state.lastTriggeredMinute = currentMins;
    }

    // --- INTERFACE ---
    window.setNotifyMode = (m) => {
        unlockMobileFeatures();
        state.notifyMode = m;
        localStorage.setItem("alphaNotifyMode", m);
        updateNotifyUI();
        if(m !== 'off') sendToServiceWorker("AlphaOS", "System Online ✅");
    };

    window.setWarningTime = (t) => {
        unlockMobileFeatures();
        state.warningMins = parseInt(t);
        localStorage.setItem("alphaWarningTime", t);
        updateNotifyUI();
    };

    window.testMobilePush = () => { unlockMobileFeatures(); sendToServiceWorker("🔔 Test", "Verbindung steht!"); };
    window.updateNotifyUI = function() {
        const m = localStorage.getItem("alphaNotifyMode") || "all";
        const t = localStorage.getItem("alphaWarningTime") || "5";
        document.querySelectorAll(".btn-notify").forEach(b => b.classList.toggle("active", b.dataset.mode === m));
        document.querySelectorAll(".btn-time").forEach(b => b.classList.toggle("active", b.dataset.time === t));
    };

    setInterval(heartbeat, CONFIG.checkInterval);
    window.addEventListener("load", window.updateNotifyUI);
})();