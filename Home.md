```dataviewjs
const { Pad } = customJS

let button = document.createElement("button")
button.textContent = "sdfs"
button.addEventListener("click", () => {
	Pad.command(this.app, "app:open-help")
})

Pad.plugin(this)

//this.app.plugins.plugins["dvo"].consoler()

this.container.append(button)
```