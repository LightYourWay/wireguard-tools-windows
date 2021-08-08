import { elevate } from "./modules/elevation.ts";
import { getConfigs, toggleConfig, getConfigByName } from "./modules/wireguard.ts";
import { promt, printConfigs, Sleep } from "./modules/ux.ts";
import { isInPath, createPath, copyToPath, removePath, appendToSystemPath, removeFromSystemPath } from "./modules/install.ts";

const installTools = (Deno.args[0] == "--install" || Deno.args[0] == "-i")
const uninstallTools = (Deno.args[0] == "--uninstall" || Deno.args[0] == "-u")
const installPath = Deno.args[1] || `C:\\Program Files\\wireguard-tools`

if (Deno.args[0] && installTools && !await isInPath(installPath)) {
	await elevate();
	await createPath(installPath);
	await copyToPath(installPath);
	await appendToSystemPath(installPath);
	Deno.exit(0)
}

if (Deno.args[0] && uninstallTools && await isInPath(installPath)) {
	await elevate();
	await removePath(installPath);
	await removeFromSystemPath(installPath);
	Deno.exit(0)
}

const directAction = Deno.args.length == 2 && (Deno.args[0].toLowerCase() == "up" || Deno.args[0].toLowerCase() == "down")

if (Deno.args[0] && !directAction) {
	console.log(`---\n>>> Arguments could not be parsed. Tool expects something like "wg-quick up vpn-name".\n---`)
	Deno.exit(1);
}

await elevate();

if (Deno.args[0]) {
	const name = Deno.args[1]
	const state = Deno.args[0].toLowerCase() == "up"
	const config = (await getConfigByName(name))[0]

	!config && console.log(`---\nArguments could not be parsed. Config (${name}) does not exist.\n---\n\n`)
	config && config.status !== state && await toggleConfig(config)
	config && Deno.exit(0)
}

while (true) {
	const configs = await getConfigs()
	printConfigs(configs)
	console.log(`---`)
	
	const toggleInput = await promt(`Enter ID of config to toggle (1 .. ${configs.length}, q to quit): `);
	if (toggleInput && parseInt(toggleInput) && parseInt(toggleInput) >= 1 && parseInt(toggleInput) <= configs.length) {
		await toggleConfig(configs[parseInt(toggleInput) - 1])
		await Sleep(1000)
	} else if (toggleInput == "q") {
		console.clear()
		console.log("Have a nice day!")
		await Sleep(1000)
		break;
	} else {
		console.clear()
		console.log("Error parsing input - please try again!")
		await Sleep(2000)
	}
	console.clear()
}