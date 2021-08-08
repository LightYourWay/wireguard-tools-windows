# wireguard-tools-windows
An easy to use windows only version of wireguard-tools build with TypeScript on deno.

## install via powershell
- download newest [release](https://github.com/LightYourWay/wireguard-tools-windows/releases)
- navigate into the folder you've downloaded the file to
- `Shift`+`Right-Click` > open powershell here
- `./wg-quick --install`

## build on windows
```powershell
(New-Item -ItemType Directory -Force -Path ./build) -and (deno compile --allow-read --allow-write --allow-run --allow-env --unstable --target x86_64-pc-windows-msvc --output ./build/wg-quick ./src/wg-quick.ts)
```

## build on linux
```bash
mkdir -p build && deno compile --allow-read --allow-write --allow-run --allow-env --unstable --target x86_64-pc-windows-msvc --output ./build/wg-quick ./src/wg-quick.ts
```