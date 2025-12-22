# MongoDB Replica Set Setup Script for Windows
# Run this script as Administrator

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "MongoDB Replica Set Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

# Check if MongoDB service exists
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($mongoService) {
    Write-Host "Found MongoDB service. Checking status..." -ForegroundColor Yellow
    
    if ($mongoService.Status -ne 'Running') {
        Write-Host "Starting MongoDB service..." -ForegroundColor Yellow
        Start-Service MongoDB
        Start-Sleep -Seconds 5
    } else {
        Write-Host "MongoDB service is already running." -ForegroundColor Green
    }
} else {
    Write-Host "MongoDB service not found. Make sure MongoDB is installed." -ForegroundColor Red
    Write-Host "If MongoDB is running manually, you can still initialize the replica set." -ForegroundColor Yellow
}

# Check if mongosh is available
try {
    $mongoshVersion = mongosh --version 2>&1
    Write-Host "MongoDB Shell (mongosh) is available." -ForegroundColor Green
} catch {
    Write-Host "WARNING: mongosh not found. Trying 'mongo' instead..." -ForegroundColor Yellow
    try {
        $mongoVersion = mongo --version 2>&1
        Write-Host "MongoDB Shell (mongo) is available." -ForegroundColor Green
        $useMongo = $true
    } catch {
        Write-Host "ERROR: Neither mongosh nor mongo found. Please install MongoDB Shell." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Initializing replica set..." -ForegroundColor Yellow

# Initialize replica set
$initScript = @"
try {
    var status = rs.status();
    print('Replica set already initialized.');
    print('Status: ' + JSON.stringify(status.set));
} catch (e) {
    if (e.message.includes('no replset config')) {
        print('Initializing replica set...');
        var result = rs.initiate({
            _id: 'rs0',
            members: [
                {
                    _id: 0,
                    host: 'localhost:27017'
                }
            ]
        });
        print('Replica set initialized successfully!');
        print('Result: ' + JSON.stringify(result));
    } else {
        print('Error: ' + e.message);
    }
}
"@

if ($useMongo) {
    $initScript | mongo --quiet
} else {
    $initScript | mongosh --quiet
}

Write-Host ""
Write-Host "Waiting for replica set to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Check status
Write-Host ""
Write-Host "Checking replica set status..." -ForegroundColor Yellow

$statusScript = @"
try {
    var status = rs.status();
    print('Replica Set: ' + status.set);
    print('State: ' + status.members[0].stateStr);
    if (status.members[0].stateStr === 'PRIMARY') {
        print('SUCCESS: Replica set is ready!');
    } else {
        print('WARNING: Replica set is not PRIMARY yet. Wait a few seconds and check again.');
    }
} catch (e) {
    print('Error checking status: ' + e.message);
}
"@

if ($useMongo) {
    $statusScript | mongo --quiet
} else {
    $statusScript | mongosh --quiet
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now use Prisma with transactions." -ForegroundColor Green
Write-Host ""
Write-Host "To verify manually, run:" -ForegroundColor Yellow
Write-Host "  mongosh --eval 'rs.status()'" -ForegroundColor White
Write-Host ""

