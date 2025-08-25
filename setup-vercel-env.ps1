# JobConnect - Automated Vercel Environment Setup (PowerShell)
# This script sets up all required environment variables for Vercel deployment

Write-Host "🚀 JobConnect - Vercel Environment Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Environment variables
$envVars = @{
    "MONGODB_URI" = "mongodb+srv://aryabratmishra:jobsforarya2023@cluster0.mongodb.net/jobconnect?retryWrites=true&w=majority"
    "JWT_SECRET" = "36718b6c5e943c88a46822b12f94b6b35ecc1514b24255181e7b57cf36d1eb0d072b7c80f7642c1e097f4659293abe22d8b97f68afadcf35560053c79d468ff7"
    "JWT_EXPIRE" = "7d"
    "NODE_ENV" = "production"
    "CLIENT_URL" = "https://jobcon-six.vercel.app"
    "API_BASE_URL" = "https://jobcon-six.vercel.app/api"
    "PORT" = "5000"
}

# Check if Vercel CLI is installed
Write-Host "🔍 Checking Vercel CLI..." -ForegroundColor Yellow
try {
    $null = Get-Command vercel -ErrorAction Stop
    Write-Host "✅ Vercel CLI is installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    try {
        npm install -g vercel
        Write-Host "✅ Vercel CLI installed successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to install Vercel CLI. Please install manually: npm install -g vercel" -ForegroundColor Red
        exit 1
    }
}

# Check Vercel authentication
Write-Host ""
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Yellow
$authCheck = vercel whoami 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Already authenticated with Vercel" -ForegroundColor Green
}
else {
    Write-Host "🔑 Please login to Vercel..." -ForegroundColor Yellow
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to authenticate with Vercel" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Successfully authenticated with Vercel" -ForegroundColor Green
}

# Set environment variables
Write-Host ""
Write-Host "⚙️  Setting up environment variables..." -ForegroundColor Yellow

foreach ($env in $envVars.GetEnumerator()) {
    $key = $env.Key
    $value = $env.Value
    
    Write-Host "Setting $key..." -ForegroundColor Cyan
    
    # Create a temporary file with the value
    $tempFile = [System.IO.Path]::GetTempFileName()
    Set-Content -Path $tempFile -Value $value -NoNewline
    
    try {
        # Try to add the environment variable
        $result = cmd /c "echo y | vercel env add $key production < $tempFile" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $key set successfully" -ForegroundColor Green
        }
        else {
            Write-Host "⚠️  $key might already exist" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "⚠️  Failed to set $key" -ForegroundColor Yellow
    }
    finally {
        # Clean up temp file
        if (Test-Path $tempFile) {
            Remove-Item $tempFile -Force
        }
    }
}

# Manual environment variable setup instructions
Write-Host ""
Write-Host "📋 Manual Setup Instructions:" -ForegroundColor Cyan
Write-Host "If the automated setup didn't work, please set these variables manually in Vercel Dashboard:" -ForegroundColor White
Write-Host ""
foreach ($env in $envVars.GetEnumerator()) {
    Write-Host "$($env.Key) = $($env.Value)" -ForegroundColor Gray
}

# Trigger redeployment
Write-Host ""
Write-Host "🔄 Triggering redeployment..." -ForegroundColor Yellow
try {
    vercel --prod --yes
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Redeployment triggered successfully" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  Manual redeployment may be required" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "⚠️  Manual redeployment may be required" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Setup process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "- Environment variables configured (or instructions provided)" -ForegroundColor White
Write-Host "- Production deployment triggered" -ForegroundColor White
Write-Host "- Your app should be live at: https://jobcon-six.vercel.app" -ForegroundColor White
Write-Host ""
Write-Host "⏰ Please wait 2-3 minutes for deployment to complete." -ForegroundColor Yellow

# Optional: Open the deployment URL
$openSite = Read-Host "Would you like to open the site in your browser? (y/n)"
if ($openSite -eq 'y' -or $openSite -eq 'Y') {
    Start-Process "https://jobcon-six.vercel.app"
}