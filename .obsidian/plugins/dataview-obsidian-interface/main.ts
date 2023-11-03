import { Plugin } from 'obsidian';

import * as template from './template'
import * as command from './command';
import * as vault from './vault';
import * as modal from './modal';
import * as workspace from './workspace';

export default class DVO extends Plugin {
	async onload() {
		command.initAPI(this)
		modal.initAPI(this)
		vault.initAPI(this)
		workspace.initAPI(this)

		//@ts-ignore
		globalThis.DvO = {
			command: command.api,
			modal: modal.api,
			vault: vault.api,
			template: template.api,
			workspace: workspace.api,
		}

		//@ts-ignore
		globalThis.DvOAsync = (
			(callback: Function) => {(async () => {await callback();})();}
		)

	}

	onunload() {}
}
