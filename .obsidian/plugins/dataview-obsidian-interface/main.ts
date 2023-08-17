import { throws } from 'assert';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, TFolder } from 'obsidian';

interface DVOSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: DVOSettings = {
	mySetting: 'default'
}

const modal_map = new Map<string, string>()
const collections = new Map<string, any>()
let bin_folder: TFolder;
let plugin_app: App;

async function initCollections(app: App) {
	bin_folder = await app.vault.createFolder(`./${app.vault.configDir}/bin`) as TFolder
	plugin_app = app
}

function saveCollections() {
	for(let [collection, data] of collections) {
		return plugin_app.vault.create(
			`${bin_folder}/${collection}.bucket`, 
			JSON.stringify(data)
		);
	}
}

async function getCollection(collection: string) {
	for(let child of bin_folder.children) {
		if(child.name === collection)
			return JSON.parse(
				await plugin_app.vault.read(child as TFile)
			);
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
