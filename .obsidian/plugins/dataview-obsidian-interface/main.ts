import { throws } from 'assert';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, TFolder } from 'obsidian';

interface DVOSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: DVOSettings = {
	mySetting: 'default'
}

const modal_map = new Map<string, string | HTMLElement | DocumentFragment>()
const collections = new Map<string, any>()
let bin_path: string;

async function initCollections(app: App) {
	const fs = require('fs')
	
	try {
		//@ts-ignore
		bin_path = `${app.vault.adapter.basePath}/Meta/Database`
	} catch (error) {
		console.error(error)
	}

	if(!fs.existsSync(bin_path)) {
		fs.mkdirSync(bin_path)
	}
}

function saveCollections() {
	const fs = require('fs')
	
	for(let [collection, data] of collections) {
		fs.writeFileSync(
			`${bin_path}/${collection}.bucket`, 
			JSON.stringify(data)
		)
	}
}

export class DVOModal extends Modal {
	public id: string

	constructor(app: App) {
		super(app);
		this.id = ""
	}
  
	onOpen() {
		let { contentEl } = this
		let content = modal_map.get(this.id)
		contentEl.append(content === undefined? "": content)
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


export default class DVO extends Plugin {
	settings: DVOSettings

	async onload() {
		await this.loadSettings()
		initCollections(this.app)
		
		let plugin = this

		//@ts-ignore
		globalThis.DvO = {
			command: (name: string, callback: () => void) => {
				let id = name
					.toLowerCase()
					.replace(" ", "-")

				plugin.addCommand({
					id,
					name,
					callback
				})
			},
			modal: {
				define: (id:string, content:string) => {modal_map.set(id, content)},
				open: (id:string) => {new DVOModal(this.app).setID(id).open()},
			},
			vault: {
				create: async (path: string, content: string = "") => {
					if(
						path[path.length-1] === "/" || 
						path[path.length-1] === "\\"
					)
						this.app.vault.createFolder(`./${path}`)
					else
						this.app.vault.create(
							`./${path}.md`, 
							content === ""? "": content
						)
				},
				read: async (file: string) => {
					let vault_file;

					if(file === "") {
						//@ts-ignore
						vault_file = plugin.app.vault.fileMap[""]
					} else {
						//@ts-ignore
						vault_file = plugin.app.vault.fileMap[file]
					}

					return await plugin.app.vault.read(vault_file)
				},
				write: async (file: string, content: string) => {
					let vault_file;

					if(file === "") {
						//@ts-ignore
						vault_file = plugin.app.vault.fileMap[""]
					} else {
						//@ts-ignore
						vault_file = plugin.app.vault.fileMap[file]
					}

					return await plugin.app.vault.modify(vault_file, content)
				},
				append: async (file: string, content: string) => {
					let vault_file;

					if(file === "") {
						//@ts-ignore
						vault_file = plugin.app.vault.fileMap[""]
					} else {
						//@ts-ignore
						vault_file = plugin.app.vault.fileMap[file]
					}

					return await plugin.app.vault.append(vault_file, content)
				},
				delete: async (file: string) => {
					let vault_file;

					if(file === "") {
						//@ts-ignore
						vault_file = plugin.app.vault.fileMap[""]
					} else {
						//@ts-ignore
						vault_file = plugin.app.vault.fileMap[file]
					}

					return await plugin.app.vault.delete(vault_file, true)
				},
				metadata: async (file: string) => {
					let vault_file;

					if(file === "") {
						//@ts-ignore
						vault_file = plugin.app.vault.fileMap[""]
					} else {
						//@ts-ignore
						vault_file = plugin.app.vault.fileMap[file]
					}
				}
			},
			storage: {
				set: (collection: string, data: any) => {
					if(Array.isArray(data))
						collections.set(collection, [
							...collections.get(collection), 
							...data
						]);
					else if(typeof data === "object")
						collections.set(collection, {
							...collections.get(collection), 
							...data
						});
					else
						collections.set(collection, data);
				},
				get: async (collection: string) => {
					let data = collections.get(collection)
					
					if(data === undefined) {
						//@ts-ignore
						let vault_file = plugin.app.vault.fileMap[`${bin_path}/${collection}.bucket`]

						data = JSON.parse(
							await plugin.app.vault.read(vault_file)
						)
					}

					return data
				},
				save: () => {	
					for(let [collection, data] of collections) {
						//@ts-ignore
						let vault_file = plugin.app.vault.fileMap[`${bin_path}/${collection}.bucket`]
						
						try {
							plugin.app.vault.create(
								vault_file, 
								JSON.stringify(data)
							)								
						}
						catch(error) {
							plugin.app.vault.modify(
								vault_file, 
								JSON.stringify(data)
							)	
						}
					}
				},
				delete: async (collection: string) => {
					//@ts-ignore
					let vault_file = plugin.app.vault.fileMap[`${bin_path}/${collection}.bucket`]

					return await plugin.app.vault.delete(vault_file, true)
				}
			},
			dom: {
				script: (src: string) => {},
				css: (styles: string) => {}
			},
			jobs: {},
			settings: {}
		}

		this.addSettingTab(new DVOSettingTab(this.app, this))
	}

	onunload() {
		const fs = require('fs')
	
		for(let [collection, data] of collections) {
			fs.writeFileSync(
				`${bin_path}/${collection}.bucket`, 
				JSON.stringify(data)
			)
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}



class DVOSettingTab extends PluginSettingTab {
	plugin: DVO;

	constructor(app: App, plugin: DVO) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
