// Init
let args = input

let container = dv.el("div", "", {cls: "schedule-container"})
container.removeChild(container.firstChild)

let lists_container = document.createElement("div")
lists_container.setAttribute("class", "schedule-lists")
container.append(lists_container)

let button_container = document.createElement("div")
button_container.setAttribute("class", "schedule-buttons")
container.append(button_container)

let primary_list = document.createElement("div")
primary_list.setAttribute("class", "list-primary")

let secondary_lists = document.createElement("div")
secondary_lists.setAttribute("class", "list-side")

lists_container.append(primary_list)
lists_container.append(secondary_lists)

// Functions
function setList(name, list, onclick) {
	let button = document.createElement("button")
	button.textContent = `Add ${name}`
	button.addEventListener("click", onclick)
	button_container.append(button)

	let list_container = document.createElement("div")

	
	let h3 = document.createElement("h3")
	h3.innerText = name
	h3.style.textAlign = "center"
	list_container.append(h3)

	let ul = document.createElement("ul")
	list.forEach(item => {
		ul.append(item)
	})
	ul.setAttribute("class", `schedule-list-${name}`)

	
	list_container.append(ul)

	if(args.primary === name) {
		primary_list.append(list_container)
	} else {
		secondary_lists.append(list_container)
	}
}

function filterList(list, target, filter_func) {
	return list.filter(routine => 
		(
			Array.isArray(routine.file.frontmatter[target]) && 
			filter_func.file.frontmatter[target].reduce(
				(accumulator, value) => filter_func(value) || accumulator
			)
		) ||
		(
			!Array.isArray(routine.file.frontmatter[target]) && 
			filter_func(routine.file.frontmatter[target])
		)
	)
}

function buildList(list, map_func) {
	return list.map(item => {
		let li = document.createElement("li")
		li.style.display = "flex"
		
		nodes = map_func(item).reverse()
		
		for(let node of nodes) {
			li.append(node)
		}
		
		return li
	})
}

// Definitions
let routines = dv.pages('"Scheduling/Routine"')

routines = filterList(routines, "Show On", routine => {
	let date = new Date()
	
	let adjustedDate = date.getDate() + date.getDay()
	let prefixes = ['0', '1', '2', '3', '4', '5']
	let week_number = (parseInt(prefixes[0 | adjustedDate / 7]) + 1)

	return true
})
routines = buildList(routines, routine => {
	let p = dv.el("p", routine.file.link, {attr: {
		style: "margin: 0px; "
	}})
	
	let input = document.createElement("input")
	input.setAttribute("type", "checkbox")
	input.setAttribute("style", "margin: 5px 0px; margin-right: 5px;")

	return [p, input]
})
setList("Routines", routines, ()=>{})

let tasks = dv.pages('"Scheduling/Tasks"')
tasks = filterList(tasks, "Complete By", task => {
	return true
})
tasks = buildList(tasks, task => {
	let p = dv.el("p", task.file.link, {attr: {
		style: "margin: 0px; "
	}})
	return [p]
})
setList("Tasks", tasks, ()=>{})
	
let events = dv.pages('"Scheduling/Events"')
events = filterList(events, "Complete By", event => {
	return true
})
events = buildList(events, event => {
	let p = dv.el("p", event.file.link, {attr: {
		style: "margin: 0px; "
	}})

	return [p]
})
setList("Events", events, ()=>{})
