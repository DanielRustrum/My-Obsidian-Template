import { App, Modal, Plugin } from 'obsidian';

let plugin: Plugin;


//* ==========================================


type ModalContents = string | HTMLElement
const modal_map = new Map<string, ModalContents>()

class DVOModal extends Modal {
	public id: string

	constructor(app: App, id: string) {
		super(app);
		this.id = id
	}
  
	onOpen() {
		let content = modal_map.get(this.id)
		if (content === undefined) return;
		
		let { contentEl } = this
		contentEl.append(content)

	}
  
	onClose() {
	  	let { contentEl } = this
	  	contentEl.empty()
	}

	setID(id: string) {
		this.id = id
		return this
	}
}


function defineModal(id: string, content: ModalContents | DocumentFragment) {
	if(content instanceof DocumentFragment) {
		let temp_div = document.createElement("div")
		temp_div.append(content)
		content = temp_div
	}

    modal_map.set(id, content)
}

function openModal(id: string) {
    if (plugin === null) return;

    new DVOModal(plugin.app, id)
        .setID(id)
        .open()
}


//* ==========================================


export function initAPI(module: Plugin) {
    plugin = module
}

export const api = {
    define: defineModal,
    open: openModal
}