$credentials = @{
    email    = "admin@lbenna.tn"
    password = "password123"
} | ConvertTo-Json

$loginResponseString = curl.exe -X POST http://localhost:3001/api/auth/admin/login `
    -H "Content-Type: application/json" `
    -d $credentials

$authData = $loginResponseString | ConvertFrom-Json
$token = $authData.access_token

Write-Host "Token: $token"

$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "`n--- Test JWT endpoint ---"
$testJwtResponse = curl.exe -v -X GET http://localhost:3001/api/auth/test-jwt -H "Authorization: Bearer $token"
Write-Host "`nResponse: $testJwtResponse"

Write-Host "`n--- Analytics Summary ---"
$summaryResponse = curl.exe -v -X GET http://localhost:3001/api/analytics/summary -H "Authorization: Bearer $token"
Write-Host "`nResponse: $summaryResponse"
