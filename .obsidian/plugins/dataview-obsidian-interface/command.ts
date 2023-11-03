import { Plugin } from 'obsidian';

let plugin: Plugin


//* ==========================================



function addCommand(name: string, callback: () => void) {
    let id = name
        .toLowerCase()
        .replace(" ", "-")

        plugin.addCommand({
        id,
        name,
        callback
    })
}

function executeCommand(name: string): boolean {
    return false
}


//* ==========================================



export function initAPI(module: Plugin) {
    plugin = module
}

export const api = {
    add: addCommand,
    execute: executeCommand
}