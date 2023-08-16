import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface DVOSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: DVOSettings = {
	mySetting: 'default'
}

export default class DVO extends Plugin {
	settings: DVOSettings;


	public consoler1() {
		console.log(this)
	}

	async onload() {
		await this.loadSettings();
		
		//@ts-ignore
		this.consoler = () => {
			console.log(this)
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
