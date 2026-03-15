param(
  [string]$Host = "localhost",
  [int]$Port = 5432,
  [string]$PostgresUser = "postgres",
  [Parameter(Mandatory = $true)][string]$PostgresPassword,
  [string]$Db = "lbenna_dev",
  [string]$AppUser = "lbenna",
  [Parameter(Mandatory = $true)][string]$AppPassword
)

Write-Host "Connecting to PostgreSQL $Host:$Port as $PostgresUser..." -ForegroundColor Cyan

$env:PGPASSWORD = $PostgresPassword

function Invoke-PSQL {
  param([string]$Query, [string]$Database = "postgres")
  & psql -v ON_ERROR_STOP=1 -U $PostgresUser -h $Host -p $Port -d $Database -c $Query
  if ($LASTEXITCODE -ne 0) { throw "psql failed: $Query" }
}

try {
  Invoke-PSQL -Query "CREATE USER \"$AppUser\" WITH PASSWORD '$AppPassword';" -Database "postgres"
} catch {
  Write-Warning "User $AppUser may already exist: $_"
}

try {
  Invoke-PSQL -Query "CREATE DATABASE \"$Db\";" -Database "postgres"
} catch {
  Write-Warning "Database $Db may already exist: $_"
}

Invoke-PSQL -Query "GRANT ALL PRIVILEGES ON DATABASE \"$Db\" TO \"$AppUser\";" -Database "postgres"
Invoke-PSQL -Query "GRANT ALL ON SCHEMA public TO \"$AppUser\";" -Database $Db

Write-Host "✅ Database setup done: db=$Db user=$AppUser" -ForegroundColor Green
