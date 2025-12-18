/* ==========================================================================
   🚀 ALPHA OS - STANDALONE PUSH CORE (MOBILE OPTIMIZED)
   ========================================================================== */

// Wir verzichten auf die (function(){}) Kapselung, damit das Handy 
// die Funktionen global besser verwalten kann.

const ALARM_CONFIG = {
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
    icon: "https://cdn-icons-png.flaticon.com/512/2910/2910795.png"
};

// Globaler State
var notifyMode = localStorage.getItem("alphaNotifyMode") || "all";
var warningMins = parseInt(localStorage.getItem("alphaWarningTime")) || 5;
var lastMinuteTriggered = -1;
var lastWarnedSessionKey = "";

// Audio-Objekt (Einmalig erstellen)
const alarmSoundEffect = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

function triggerPushAlarm(title, body) {
    if (notifyMode === 'off') return;

    // 1. SOUND (Wichtig für Mobile: Muss kurz angespielt werden)
    if (notifyMode === 'all' || notifyMode === 'sound') {
        alarmSoundEffect.currentTime = 0;
        alarmSoundEffect.play().catch(e => console.log("Handy braucht Klick für Sound"));
    }

    // 2. PUSH
    if (notifyMode === 'all' || notifyMode === 'push') {
        if (Notification.permission === "granted") {
            new Notification(title, {
                body: body,
                icon: ALARM_CONFIG.icon,
                silent: (notifyMode === 'push') // Falls nur Push, dann Sound vom System unterdrücken
            });
        }
    }
}

// Zeit-Logik
function checkSessionTimes() {
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();

    if (mins === lastMinuteTriggered) return;

    // DST Check
    const march = new Date(now.getFullYear(), 2, 31); march.setDate(march.getDate() - march.getDay());
    const oct = new Date(now.getFullYear(), 9, 31); oct.setDate(oct.getDate() - oct.getDay());
    const offset = (now >= march && now < oct) ? 60 : 0;

    ALARM_CONFIG.sessions.forEach(s => {
        const start = (s.start + offset) % 1440;
        const end = (s.end + offset) % 1440;
        const warn = (start - warningMins + 1440) % 1440;

        if (mins === start) triggerPushAlarm(`🚀 START: ${s.name}`, "Session aktiv!");
        if (mins === end) triggerPushAlarm(`🏁 ENDE: ${s.name}`, "Session beendet.");
        
        if (mins === warn) {
            const key = `${s.name}-${mins}`;
            if (lastWarnedSessionKey !== key) {
                triggerPushAlarm(`⚠️ BALD: ${s.name}`, `In ${warningMins} Min.`);
                lastWarnedSessionKey = key;
            }
        }
    });

    lastMinuteTriggered = mins;
}

// BUTTON FUNKTIONEN (Global für das HTML)
window.setNotifyMode = function(mode) {
    notifyMode = mode;
    localStorage.setItem("alphaNotifyMode", mode);
    
    // WICHTIG FÜR HANDY: Sound beim Klick kurz "entsperren"
    alarmSoundEffect.play().then(() => {
        alarmSoundEffect.pause();
        alarmSoundEffect.currentTime = 0;
    }).catch(() => {});

    updateNotifyUI();
    if (mode !== 'off') triggerPushAlarm("System Check", "Alarme aktiviert.");
};

window.setWarningTime = function(mins) {
    warningMins = parseInt(mins);
    localStorage.setItem("alphaWarningTime", mins);
    updateNotifyUI();
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

// Start
setInterval(checkSessionTimes, 5000);
window.addEventListener("load", () => {
    updateNotifyUI();
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});