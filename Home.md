DV: 
```dataviewjs
(async () => {
	let node = document.createElement("p")
	node.innerHTML = "Hi!"
	let container = dv.el("div", document.createElement("div"), {})

	let link = dv.el("p", dv.pages(`"test"`).file.link, {})

	let template = DvO.templates.define`
		<h1>Hello World</h1>
		${node}
		<p>What is this?</p>
		${link}
		<p>Jajajaja</p>`
	let dom = DvO.templates.render(template)
	console.log(dom)
	container.append(dom)
})();
```
After: