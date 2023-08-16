class Pad{
 	command(app, name) {
		app.commands.commands[name].callback()	
	}

	plugin(globl) {
		console.log(globl)
	}

}