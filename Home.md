```dataviewjs
dv.view("Meta/Views/header-message")
const { Pad } = customJS

let button = document.createElement("button")
button.textContent = "sdfs"
button.addEventListener("click", () => {
	Pad.command(this.app, "app:open-help")
})

console.log(Pad.plugin(this))

this.container.append(button)
```