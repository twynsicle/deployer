param (
    [string]$recyclePath = $(throw "-recyclePath is required.")
)

[system.io.file]::AppendAllText($recyclePath, " ")

$recyclePath