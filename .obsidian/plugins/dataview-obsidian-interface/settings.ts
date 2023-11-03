import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface DVOPlugin extends Plugin {
    settings: Map<string, any>
}

let plugin: DVOPlugin


export async function initAPI(module: DVOPlugin) {
    plugin = module
}


export const api = {
}