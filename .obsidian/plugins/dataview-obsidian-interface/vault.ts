import { TFile, TFolder, Plugin } from "obsidian"

let plugin: Plugin;


//* ==========================================



type ExplorerLocation = TFile | TFolder | null
type ExplorerConstraint = (
    "all" |
    "folder" |
    "file" |
    "markdown"
)
function navigateExplorerWithLocation(
    location: string, 
    constraint: ExplorerConstraint = "file"
): ExplorerLocation {
    let files: Array<any>;
    switch(constraint) {
        case "all":
            files = plugin.app.vault.getAllLoadedFiles()
        case "file":
            files = plugin.app.vault.getFiles()
        case "markdown":
            files = plugin.app.vault.getMarkdownFiles()
        default:
            files = []
    }
    
    for(let file of files) {
        if(file.path === location) {
            return file
        }
    }
    
    return null
}

function createItem(
    location: string, 
    type: Exclude<ExplorerConstraint, "all"> = "markdown"
): boolean {
    if(navigateExplorerWithLocation(location, "all") !== null) 
        return false;

    switch(type) {
        case "folder":
            break
        case "file":
            break
        default:
            break
    }

    return true
}

function fetchItem(location: string): ExplorerLocation {
    return navigateExplorerWithLocation(location, "all")
}

function deleteItem(location: string): boolean {
    let item = navigateExplorerWithLocation(location)
    if (item === null) 
        return false;
    
    plugin.app.vault.delete(item)
    return true
}



//* ==========================================




export function initAPI(module: Plugin) {
    plugin = module
}


export const api = {
    create: createItem,
    fetch: fetchItem,
    delete: deleteItem
}