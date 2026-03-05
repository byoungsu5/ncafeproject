# 카멜케이스 → 케밥케이스 파일명 변경 스크립트

$uploadDir = ".\upload"

# 변경할 파일 목록 (카멜케이스 → 케밥케이스)
$renames = @{
    "beefBagel.png" = "beef-bagel.png"
    "bagelCreamCheese.png" = "bagel-cream-cheese.png"
    "butterCookie.png" = "butter-cookie.png"
    "hamCheeseSandwich.png" = "ham-cheese-sandwich.png"
    "scrambledEggSandwich.png" = "scrambled-egg-sandwich.png"
    "turkeySandwich.png" = "turkey-sandwich.png"
    "tunaSandwich.png" = "tuna-sandwich.png"
    "strawberryCake.png" = "strawberry-cake.png"
    "chocolateCroissant.png" = "chocolate-croissant.png"
    "chocolateMousse.png" = "chocolate-mousse.png"
    "caramelMacchiato.png" = "caramel-macchiato.png"
    "chocoChipCookie.png" = "choco-chip-cookie.png"
    "almondCookie.png" = "almond-cookie.png"
    "DubaiZzondeukCookie.png" = "dubai-zzondeuk-cookie.png"
}

foreach ($old in $renames.Keys) {
    $new = $renames[$old]
    $oldPath = Join-Path $uploadDir $old
    $newPath = Join-Path $uploadDir $new
    
    if (Test-Path $oldPath) {
        Write-Host "Renaming: $old -> $new"
        Rename-Item -Path $oldPath -NewName $new
    } else {
        Write-Host "File not found: $old" -ForegroundColor Yellow
    }
}

Write-Host "`nDone! 파일명 변경 완료" -ForegroundColor Green
