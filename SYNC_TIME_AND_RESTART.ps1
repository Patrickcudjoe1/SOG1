# Auto-fix script for Firebase Admin time issue

Write-Host "`n⚡ FIXING CHECKOUT ISSUE..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

# Step 1: Show current time
Write-Host "`n📅 Current system time:" -ForegroundColor Cyan
Get-Date
Write-Host ""

# Step 2: Attempt time sync
Write-Host "🔄 Syncing time with internet..." -ForegroundColor Yellow
try {
    $result = w32tm /resync 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Time synced successfully!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Auto-sync failed. Please sync manually:" -ForegroundColor Yellow
        Write-Host "   1. Click Start → type 'Date and Time'" -ForegroundColor White
        Write-Host "   2. Toggle 'Set time automatically' OFF then ON" -ForegroundColor White
        Write-Host "   3. Click 'Sync now'" -ForegroundColor White
    }
} catch {
    Write-Host "⚠️  Could not auto-sync. Manual sync required." -ForegroundColor Yellow
    Write-Host "   Run PowerShell as Administrator for auto-sync." -ForegroundColor Gray
}

Write-Host "`n📅 Updated system time:" -ForegroundColor Cyan
Get-Date

# Step 3: Instructions
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "🔄 NOW RESTART YOUR DEV SERVER:" -ForegroundColor Yellow
Write-Host "   1. Go to your terminal running 'npm run dev'" -ForegroundColor White
Write-Host "   2. Press Ctrl+C to stop" -ForegroundColor White
Write-Host "   3. Run: npm run dev" -ForegroundColor Cyan
Write-Host "   4. Try checkout again" -ForegroundColor White

Write-Host "`n✅ Checkout should work after restart!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray