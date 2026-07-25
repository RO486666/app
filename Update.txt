@echo off
title AlphaOS Auto-Deployer
color 0a

echo ===================================================
echo 🚀 ALPHAOS AUTO-DEPLOY INITIALISIERT
echo ===================================================
echo.

echo [1/3] Patche Service Worker Cache-Version...
:: Liest das aktuelle Datum/Uhrzeit und ueberschreibt exakt Zeile 1 in der sw.js
powershell -Command "$d = Get-Date -Format 'yyyyMMdd-HHmmss'; (Get-Content sw.js) -replace '^const CACHE_NAME = .*', ('const CACHE_NAME = \"alphaos-v' + $d + '\";') | Set-Content sw.js"
echo ✅ sw.js erfolgreich aktualisiert!
echo.

echo [2/3] Bereite Git-Upload vor...
git add .
git commit -m "Auto-Deploy Update"
echo.

echo [3/3] Lade auf GitHub hoch...
git push
echo.

echo ===================================================
echo ✅ UPDATE ERFOLGREICH ABGESCHLOSSEN!
echo ===================================================
pause