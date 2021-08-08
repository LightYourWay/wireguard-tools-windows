export async function isRunning(name: string): Promise<boolean> {
    const p = Deno.run({
        cmd: [
            `sc`,
            `query`,
            `WireGuardTunnel$${name}`
        ],
        stdout: "piped",
        stderr: "piped",
    });
    const { code } = await p.status();
    const rawOutput = await p.output();

    return (code == 0 && new TextDecoder().decode(rawOutput).includes(`RUNNING`))
}