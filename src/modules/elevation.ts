import { basename } from "https://deno.land/std@0.103.0/path/mod.ts";

export async function isAdmin() {
  const testCMD = Deno.run({
    cmd: [`net`, `session`],
    stdout: "null",
    stderr: "null",
  });
  return (await testCMD.status()).code == 0;
}

export async function elevate() {
  if (await isAdmin()) return;
  Deno.run({
    cmd: [
      `Powershell`,
      `-Command`,
      `Start "${Deno.execPath()}"${Deno.args[0] ? ` "${Deno.args.join(' ')}"` : ''} -Verb Runas`,
    ],
  });
  Deno.exit(0);
}
