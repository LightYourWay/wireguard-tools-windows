import { ensureDir } from "https://deno.land/std@0.103.0/fs/mod.ts";
import { basename, join } from "https://deno.land/std@0.103.0/path/mod.ts";

async function readRegistryValue(key: string, value: string): Promise<string> {
    const p = Deno.run({
        cmd: [
          `reg`,
          `query`,
          `${key}`,
          `/v`,
          `${value}`
        ],
        stdout: "piped",
        stderr: "piped",
      });
    
      const { code } = await p.status();
    
      const rawOutput = await p.output();
      const rawError = await p.stderrOutput();
    
      if (code === 0) {
        let currentPath = '';
        (new TextDecoder().decode(rawOutput)).replace(/\r\n *Path *REG_EXPAND_SZ *(.*)\r\n/gi, (match, path: string) => {
            currentPath = path
            return match
        });
        return currentPath
      }
    
      const errorString = new TextDecoder().decode(rawError);
      console.log(errorString);
      throw new Error(`Couldn't read registry.`);
}

async function writeRegistryValue(key: string, value: string, data: string): Promise<boolean> {
    const p = Deno.run({
        cmd: [
          `reg`,
          `add`,
          `${key}`,
          `/v`,
          `${value}`,
          `/t`,
          `REG_EXPAND_SZ`,
          `/d`,
          `${data}`,
          `/f`
        ]
      });
    
      const { code } = await p.status();

      const rawOutput = await p.output();
      const rawError = await p.stderrOutput();
      
      if (code === 0) {
          console.log(new TextDecoder().decode(rawOutput));
          return true
      } else {
          const errorString = new TextDecoder().decode(rawError);
          console.log(errorString);
          return false
      }
}

export async function isInPath(path: string) {
    return (await readRegistryValue(`HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment`, `PATH`)).includes(path)
}

export async function createPath(path: string) {
    return await ensureDir(path);
}

export async function removePath(path: string) {
    return await Deno.remove(path, { recursive: true });
}

export async function copyToPath(path: string) {
    return await Deno.copyFile(Deno.execPath(), join(path, basename(Deno.execPath())));
}

export async function appendToSystemPath(path: string) {
    return await writeRegistryValue(`HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment`, `PATH`, `${(await readRegistryValue(`HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment`, `PATH`))};${path}`);
}

export async function removeFromSystemPath(path: string) {
    return await writeRegistryValue(`HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment`, `PATH`, `${(await readRegistryValue(`HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment`, `PATH`)).replace(`;${path}`, ``)}`);    
}
