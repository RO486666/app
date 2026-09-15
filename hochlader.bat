@echo off
title AlphaOS Transporter (Test -^> Main)
color 0e

:: =====================================================================
:: ⚠️ HIER DEINEN ECHTEN HAUPTORDNER-PFAD EINTRAGEN
:: (Ich habe den Pfad aus deinem Screenshot abgeleitet, bitte pruefen!)
:: =====================================================================
set "MAIN_DIR=C:\Users\ro486\OneDrive\Desktop\Roman\APP\app"

echo ===================================================
echo 🔄 ALPHAOS SYNC: TEST-ORDNER -^> HAUPTORDNER
echo ===================================================
echo.
echo Scanne auf Aenderungen und uebertrage nach:
echo %MAIN_DIR%
echo.

:: Robocopy ist das maechtigste Windows-Kopiertool.
:: Es uebertraegt alle Dateien (/E), 
:: blockiert aber den .git Ordner (/XD .git) 
:: und laesst diese Updater.bat im Test-Ordner (/XF Updater.bat).
robocopy . "%MAIN_DIR%" /E /XO /XD .git /XF Updater.bat

echo.
echo ===================================================
echo ✅ DATEN ERFOLGREICH IN DEN HAUPTORDNER GEFEUERT!
echo ===================================================
echo Der Radar im Hauptordner wird die Aenderung jetzt registrieren
echo und vollautomatisch den GitHub-Upload starten.
pause