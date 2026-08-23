Add-Type -AssemblyName System.Drawing

$sourceDir = "D:\backUp File\Quads\00_ImageQuads"
$targetDir = "D:\Home_Dashboard\portfolio\public\drones"

if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }

$files = Get-ChildItem -Path $sourceDir -Filter *.jpg -File
$files += Get-ChildItem -Path $sourceDir -Filter *.JPG -File
$files = $files | Select-Object -Unique

Write-Host "Total images to process: $($files.Count)"

$count = 0
$manifest = @()

foreach ($file in $files) {
    $count++
    $cleanName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    
    # Safe output filename without problematic characters
    $safeFileName = ($file.Name -replace '[^a-zA-Z0-9_\-\. ]', '')
    $outPath = Join-Path $targetDir $safeFileName

    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        
        # Calculate resize if larger than 1200px
        $maxDimension = 1100
        $w = $img.Width
        $h = $img.Height
        
        if ($w -gt $maxDimension -or $h -gt $maxDimension) {
            if ($w -ge $h) {
                $newW = $maxDimension
                $newH = [int](($h / $w) * $maxDimension)
            } else {
                $newH = $maxDimension
                $newW = [int](($w / $h) * $maxDimension)
            }
        } else {
            $newW = $w
            $newH = $h
        }
        
        $bitmap = New-Object System.Drawing.Bitmap($newW, $newH)
        $g = [System.Drawing.Graphics]::FromImage($bitmap)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($img, 0, 0, $newW, $newH)
        $g.Dispose()
        $img.Dispose()

        # Compress with quality parameter
        $quality = 72
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)
        
        $bitmap.Save($outPath, $jpegEncoder, $encoderParams)
        $bitmap.Dispose()

        $sizeKb = [math]::Round(((Get-Item $outPath).Length / 1KB), 1)
        
        # If still over 95KB, reduce quality and resize slightly further
        if ($sizeKb -gt 95) {
            $img2 = [System.Drawing.Image]::FromFile($outPath)
            $w2 = [int]($img2.Width * 0.85)
            $h2 = [int]($img2.Height * 0.85)
            $bitmap2 = New-Object System.Drawing.Bitmap($img2, $w2, $h2)
            $img2.Dispose()
            
            $quality2 = 62
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality2)
            $bitmap2.Save($outPath, $jpegEncoder, $encoderParams)
            $bitmap2.Dispose()
            $sizeKb = [math]::Round(((Get-Item $outPath).Length / 1KB), 1)
        }
        
        $manifest += [PSCustomObject]@{
            FileName = $safeFileName
            Path = "/drones/$safeFileName"
            Title = $cleanName
            SizeKb = $sizeKb
        }
        
        Write-Host "[$count/$($files.Count)] Saved $safeFileName ($sizeKb KB)"
    } catch {
        Write-Warning "Error processing $($file.Name): $_"
    }
}

$manifest | ConvertTo-Json -Depth 4 | Set-Content -Path (Join-Path $targetDir "manifest.json") -Encoding UTF8
Write-Host "Done! Total $($manifest.Count) images processed."
