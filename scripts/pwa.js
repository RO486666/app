// ✅ Service Worker Registrierung
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then(reg => console.log("✅ Service Worker registriert:", reg))
      .catch(err => console.error("❌ SW Registrierung fehlgeschlagen:", err));
  });
}

// ✅ App-Install Trigger mit Button
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log("🟡 beforeinstallprompt ausgelöst");
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

function showInstallButton() {
  if (localStorage.getItem("installPromptHandled") === "true") return;
  if (document.getElementById("installBtn")) return;

  const installBtn = document.createElement("button");
  installBtn.id = "installBtn";
  installBtn.textContent = "📲 App installieren";
  installBtn.className = "big-btn";
  installBtn.style.position = "fixed";
  installBtn.style.bottom = "80px";
  installBtn.style.left = "50%";
  installBtn.style.transform = "translateX(-50%)";
  installBtn.style.zIndex = "9999";
  document.body.appendChild(installBtn);

  installBtn.addEventListener("click", () => {
    installBtn.remove();
    localStorage.setItem("installPromptHandled", "true"); // ✅ Nur einmal fragen
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        console.log("📥 Installationswahl:", choiceResult.outcome);
        deferredPrompt = null;
      });
    }
  });
}

// 🕒 Fallback-Check nach 3 Sekunden, ob der Button angezeigt werden kann
setTimeout(() => {
  if (deferredPrompt) {
    showInstallButton();
  } else {
    console.log("❌ Kein Install-Event verfügbar");
  }
}, 3000);