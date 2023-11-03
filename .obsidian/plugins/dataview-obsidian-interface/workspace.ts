import { TFile, Plugin } from "obsidian"

let plugin: Plugin;


//* ==========================================



type DisplayOnTab = (
    "current" | 
    "right"
)
function display(file: TFile, tab: DisplayOnTab): boolean {
    return false
}

function createLeaf() {}


//* ==========================================

export function initAPI(module: Plugin) {
    plugin = module
}

export const api = {
    trunk: {
        display
    },
    leaf: {
        create: createLeaf
    }
}