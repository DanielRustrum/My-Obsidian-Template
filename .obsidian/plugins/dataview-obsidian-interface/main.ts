import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface DVOSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: DVOSettings = {
	mySetting: 'default'
}

const modal_map = new Map<string, string>()
const collections = new Map<string, any>()
let bin_path = ""

function initCollections(app: App) {
	bin_path = `./${app.vault.configDir}/bin`
}

function saveCollections() {
	const fs = require('fs')

	for(let [collection, data] of collections) {
		fs.writeFile(`${bin_path}/${collection}.bucket`, data, (err: any) => {
			if (err) {console.error(err)}
		})
	}
}

function getCollection(collection: string) {
	const fs = require('fs')

	let result = null

	fs.readFile(`${bin_path}/${collection}.bucket`, 'utf8', (err: any, data: any) => {
		if (err) {
		  console.error(err)
		  return
		}
		result = data
	})
}

export class DVOModal extends Modal {
	public id: string

	constructor(app: App) {
		super(app);
		this.id = ""
	}
  
	onOpen() {
		let { contentEl } = this
		contentEl.setText(modal_map.get(this.id) as string);
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
		
		const fs = require('fs')

		if (!fs.existsSync(bin_path)) {
			fs.mkdirSync(bin_path)
		}
		
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
				create: async (path: string, content: string) => {
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
				delete: async (path: string) => {}
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
				get: (collection: string) => {
					let data = collections.get(collection)
					
					if(data === undefined) {
						data = getCollection(collection)
					}

					return data
				},
				save: () => {
					saveCollections()
				}
			}
		}

		this.addSettingTab(new DVOSettingTab(this.app, this))
	}

	onunload() {
		saveCollections()
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
