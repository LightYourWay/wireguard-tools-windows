# wireguard-tools-windows
An easy to use windows only version of wireguard-tools build with TypeScript on deno.

## build on windows
```powershell
(New-Item -ItemType Directory -Force -Path ./build) -and (deno compile --allow-read --allow-run --allow-env --target x86_64-pc-windows-msvc --output ./build/wg-quick ./src/wg-quick.ts)
```

## build on linux
```bash
mkdir -p build && deno compile --allow-read --allow-run --allow-env --target x86_64-pc-windows-msvc --output ./build/wg-quick ./src/wg-quick.ts
```