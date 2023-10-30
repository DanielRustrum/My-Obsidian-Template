```dataviewjs
```
```dataviewjs
(async () => {
	let template = DvO.templates.define`<h1>Hello World</h1>`
	let dom = DvO.templates.render(template)
	console.log(dom)
})();
```