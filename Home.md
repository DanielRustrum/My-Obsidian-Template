DV: 
```dataviewjs
DvOAsync(async () => {
	DvO.modal.define("test", DvO.template.quick`
		<h2>You are in the Modal Now</h2>
		<p>Hello!!!</p>
	`)

	let container = dv.el("div", document.createElement("div"), {})
	container.removeChild(container.firstChild)
	let on_click = () => {
		DvO.modal.open("test")
	}

	container.append(DvO.template.quick`
		<h2 style="color: red;">Click to activate Modal</h2>
		<button [click]=${on_click}>Activate</button>
	`)

})
```
After: