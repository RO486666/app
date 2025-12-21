/* ============================================================
   📦 LOCAL EXPORT / IMPORT
   Weekly Pair Plan + Confluence
   ============================================================ */

const BACKUP_KEY = "weeklyPairPlan_v1";

/* =========================
   EXPORT
   ========================= */
function exportLocalBackup() {
  const raw = localStorage.getItem(BACKUP_KEY);

  if (!raw) {
    alert("Kein Weekly Pair Plan vorhanden.");
    return;
  }

  const payload = {
    key: BACKUP_KEY,
    data: JSON.parse(raw),
    exportedAt: new Date().toISOString()
  };

  const blob = new Blob(
    [JSON.stringify(payload, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "weekly-pair-backup.json";
  a.click();

  URL.revokeObjectURL(a.href);
}

/* =========================
   IMPORT
   ========================= */
function importLocalBackup(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const payload = JSON.parse(e.target.result);

      if (
        payload.key !== BACKUP_KEY ||
        !Array.isArray(payload.data)
      ) {
        alert("Ungültige Backup-Datei.");
        return;
      }

      localStorage.setItem(
        BACKUP_KEY,
        JSON.stringify(payload.data)
      );

      alert("Backup erfolgreich importiert.");
      location.reload();

    } catch (err) {
      alert("Fehler beim Import.");
    }
  };

  reader.readAsText(file);
}
