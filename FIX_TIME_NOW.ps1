# Quick script to sync Windows time and restart dev server

Write-Host "🕐 Checking system time..." -ForegroundColor Yellow

# Show current time
$currentTime = Get-Date
Write-Host "Current system time: $currentTime" -ForegroundColor Cyan

# Try to sync time (requires admin)
Write-Host "`n🔄 Attempting to sync time with time server..." -ForegroundColor Yellow
try {
    w32tm /resync /rediscover /nowait
    Write-Host "✅ Time sync command sent" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Time sync failed - you may need to run as Administrator" -ForegroundColor Red
    Write-Host "   Right-click PowerShell → Run as Administrator, then run this script again" -ForegroundColor Yellow
}

Write-Host "`n📝 Manual time sync instructions:" -ForegroundColor Cyan
Write-Host "1. Right-click the clock in your taskbar" -ForegroundColor White
Write-Host "2. Click 'Adjust date and time'" -ForegroundColor White
Write-Host "3. Toggle 'Set time automatically' OFF then ON" -ForegroundColor White
Write-Host "4. Click 'Sync now' button" -ForegroundColor White

Write-Host "`n🔄 After syncing time, restart your dev server:" -ForegroundColor Yellow
Write-Host "   Ctrl+C (stop current server)" -ForegroundColor White
Write-Host "   npm run dev (start fresh)" -ForegroundColor White

Write-Host "`n✅ Then try your checkout again!" -ForegroundColor Green