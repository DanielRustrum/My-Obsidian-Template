import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface DVOSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: DVOSettings = {
	mySetting: 'default'
}

let modal_map = new Map<string, string>()
export class DVOModal extends Modal {
	public id: string

	constructor(app: App) {
		super(app);
		this.id = ""
	}
  
	onOpen() {
		let { contentEl } = this;
		contentEl.setText(modal_map.get(this.id) as string);
	}
  
	onClose() {
	  	let { contentEl } = this;
	  	contentEl.empty();
	}

	setID(id: string) {
		this.id = id
		return this
	}
}


export default class DVO extends Plugin {
	settings: DVOSettings;

	async onload() {
		await this.loadSettings();
		let plugin = this

		//@ts-ignore
		globalThis.DvO = {
			command: (name: string, callback: ()=>void) => {
				let id = name
					.toLowerCase()
					.replace(" ", "-")

				plugin.addCommand({
					id,
					name,
					callback
				})
			},
			defineModal: (id:string, content:string) => {modal_map.set(id, content)},
			openModal: (id:string) => {new DVOModal(this.app).setID(id).open()},
			vault: {
				createFile: async (path: string, content: string) => {this.app.vault.create(
					`./${path}`, 
					content === ""? "": content
				)},
				readFile: async (path: string) => {
					// this.app.vault.read("")
				},
				delete: async (path: string) => {}
			}
		}

		
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new DVOSettingTab(this.app, this));
	}

	onunload() {

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
