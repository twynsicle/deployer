param (
    [string]$from = $(throw "-from is required."),
    [string]$to = $(throw "-to is required.")
)

try {
	Copy-Item $from $to
	$to
} catch [system.exception] {

}

