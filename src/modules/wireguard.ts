import { dirname, join, extname, parse } from "https://deno.land/std@0.103.0/path/mod.ts";
import { isRunning } from "./service.ts";

export async function installPath(): Promise<string> {
    const p = Deno.run({
        cmd: [
            `where`,
            `wireguard`
        ],
        stdout: "piped",
        stderr: "piped",
    });
    const { code } = await p.status();
    const rawOutput = await p.output();

    if (code != 0) throw new Error(`WireGuard has not been added to $PATH and thus can not be found. Please add WireGuard to $PATH!`);

    return new TextDecoder().decode(rawOutput)
}

async function configPath(): Promise<string> {
    return join(dirname(await installPath()), `Data\\Configurations`)
}

export interface config {
    name: string,
    path: string,
    status: boolean
}

export async function getConfigs() {
    const path = await configPath()
    const configs = new Array<config>()
    for await (const dirEntry of Deno.readDir(path)) {
        if (dirEntry.isFile && extname(dirEntry.name) == `.dpapi` ) {
            const parsedName = parse(parse(dirEntry.name).name).name;
            configs.push({name: parsedName, path: join(path, dirEntry.name), status: await isRunning(parsedName)})
        }
    }
    return configs
}

export async function toggleConfig(config: config) {
    let cmd = [
        `wireguard`,
        `/installtunnelservice`,
        `${config.path}`,
    ]
    if (config.status == true) {
        cmd = [
            `wireguard`,
            `/uninstalltunnelservice`,
            `${config.name}`,
        ]
    }

    const p = Deno.run({
        cmd: cmd,
        stdout: "piped",
        stderr: "piped",
    });

	
	const { code } = await p.status();
	
	const rawOutput = await p.output();
	const rawError = await p.stderrOutput();
	
	if (code === 0) {
		await Deno.stdout.write(rawOutput);
	} else {
		const errorString = new TextDecoder().decode(rawError);
		console.log(errorString);
	}    
}

export async function getConfigByName(name: string) {
    const configs = await getConfigs()
    return configs.filter(config => {
        return config.name === name
    })
}