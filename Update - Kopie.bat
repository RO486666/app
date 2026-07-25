@echo off
title AlphaOS Live-Radar
color 0b

:: Erstellt ein sauberes Skript im temporaeren Windows-Ordner, um Parser-Abstuerze zu blockieren
set "PS_FILE=%temp%\alpha_radar.ps1"

echo $folder = (Get-Item .).FullName > "%PS_FILE%"
echo $watcher = New-Object IO.FileSystemWatcher $folder, '*.*' >> "%PS_FILE%"
echo $watcher.IncludeSubdirectories = $true >> "%PS_FILE%"
echo $watcher.EnableRaisingEvents = $true >> "%PS_FILE%"
echo Write-Host "=========================================" -ForegroundColor Cyan >> "%PS_FILE%"
echo Write-Host " RADAR AKTIV - UEBERWACHE DEINEN CODE" -ForegroundColor Cyan >> "%PS_FILE%"
echo Write-Host "=========================================" -ForegroundColor Cyan >> "%PS_FILE%"
echo Write-Host "Lass dieses Fenster im Hintergrund offen." -ForegroundColor Gray >> "%PS_FILE%"
echo while($true) { >> "%PS_FILE%"
echo     $result = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::Changed, 1000) >> "%PS_FILE%"
echo     if ($result.TimedOut -eq $false) { >> "%PS_FILE%"
echo         $file = $result.Name >> "%PS_FILE%"
echo         if ($file -match "\\.git" -or $file -match "sw\.js" -or $file -match "\.bat") { continue } >> "%PS_FILE%"
echo         Write-Host "`n[!] Aenderung in: $file" -ForegroundColor Yellow >> "%PS_FILE%"
echo         Start-Sleep -Seconds 3 >> "%PS_FILE%"
echo         Write-Host "Feuere update.bat ab..." -ForegroundColor Green >> "%PS_FILE%"
echo         cmd.exe /c "update.bat" >> "%PS_FILE%"
echo         Write-Host "`n[OK] Radar scannt wieder..." -ForegroundColor Cyan >> "%PS_FILE%"
echo     } >> "%PS_FILE%"
echo } >> "%PS_FILE%"

:: Feuert das saubere Skript ab
powershell -NoProfile -ExecutionPolicy Bypass -File "%PS_FILE%"
pause