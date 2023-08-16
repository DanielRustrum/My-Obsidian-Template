```dataviewjs
let task_template = `
---
tast_type: admin
---
Description Here!
`

let button = document.createElement("button")
let input_button = document.createElement("button")
let input = document.createElement("input")
let wrapper = document.createElement("div")
let input_value = ""

input.placeholder = "Enter Task Name"
button.textContent = "Tasks"
wrapper.hidden = true
input_button.textContent = "Add Task"

input.addEventListener("input", event => {
	input_value = event.target.value
})
button.addEventListener("click", () => {
	wrapper.hidden = !wrapper.hidden
})
input_button.addEventListener("click", () => {
	DvO.vault.createFile(`Tasks/${input_value}.md`, task_template)
})

this.container.append(button)
wrapper.append(input)
wrapper.append(input_button)
this.container.append(wrapper)
```