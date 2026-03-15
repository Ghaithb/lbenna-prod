param(
  [string]$MigrationName = "add-projects"
)

if (-not $env:DATABASE_URL) {
  Write-Error "DATABASE_URL is not set. Set it before running this script. Example:`n$env:DATABASE_URL = 'postgresql://user:pass@localhost:5432/db?schema=public'"
  exit 1
}

Write-Host "Running: npx prisma generate"
npx prisma generate

if ($LASTEXITCODE -ne 0) { Write-Error "prisma generate failed"; exit $LASTEXITCODE }

Write-Host "Running: npx prisma migrate dev --name $MigrationName"
npx prisma migrate dev --name $MigrationName

if ($LASTEXITCODE -ne 0) { Write-Error "prisma migrate failed"; exit $LASTEXITCODE }

Write-Host "Prisma generate + migrate completed. Commit prisma/migrations and schema.prisma to git."
