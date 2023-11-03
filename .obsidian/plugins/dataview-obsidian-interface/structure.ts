import { Plugin } from "obsidian"

let plugin: Plugin;


//* ==========================================


function addScript() {}
function addStylesheet() {}
function createBlock() {}


//* ==========================================


export function initAPI(module: Plugin) {
    plugin = module
}

export const api = {
    script: addScript,
    style: addStylesheet,
    block: createBlock
}