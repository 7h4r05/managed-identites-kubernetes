param([String] $version = $null,
[array] $images= $null,
[boolean] $cloudBuild = $TRUE)

if($version::IsNullOrEmpty){
    $file = 'cube.yaml';
    $pattern = ':v\d+';
    $currentVersion = (select-string -Path $file -Pattern $pattern | % {$_.Matches} | % {$_.Value})[0]
    $nextVersion = ([convert]::ToInt32($currentVersion.substring(2), 10) + 1)
    $version = ':v' + $nextVersion
}

if ($images -eq $null){
    $images = Get-ChildItem | Where-Object {$_.PSIsContainer} | Foreach-Object {$_.Name} 
}

Write-Host $images

if ($cloudBuild -eq $TRUE){
    Copy-Item -force ./environment.cloud.js ./web/src/environment.js
}else{
    Copy-Item -force ./environment.local.js ./web/src/environment.js
}


if($images.contains('web'))
{
    cd web
    ./build.bat
    cd ..
}
foreach($image in $images){
    $containerName = '{YOUR_AZURE_CONTAINER_REGISTRY_NAME}.azurecr.io/' + $image + $version;
    Write-Host $containerName
    docker build $image -t $containerName
    docker push $containerName
}

(Get-Content cube.yaml) -Replace ':v\d+', ($version) | Out-File cube.yaml
kubectl apply -f ./cube.yaml;