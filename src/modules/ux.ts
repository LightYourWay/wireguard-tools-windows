import { readLines } from "https://deno.land/std@0.103.0/io/mod.ts";
import { config } from "./wireguard.ts";

export async function promt(msg?: string) {
  msg && console.log(msg);
  // Listen to stdin input, once a new line is entered return
  for await (const line of readLines(Deno.stdin)) {
    return line;
  }
}

export function printConfigs(configs: Array<config>) {
    configs.forEach((config, index) => {
		console.log(`${index + 1}: ${config.name} (${config.status ? `running` : `stopped`})`)
	})    
}

export function Sleep(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}