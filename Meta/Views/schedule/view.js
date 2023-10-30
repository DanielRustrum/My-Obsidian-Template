// ==================== Setup ====================



let args = input

let container = dv.el("div", "", {cls: "schedule-container"})
// container.removeChild(container.firstChild)

let lists_container = document.createElement("div")
lists_container.setAttribute("class", "schedule-lists")
container.append(lists_container)

let button = document.createElement("button")
button.textContent = `Add to Schedule`
button.addEventListener("click", () => {
	DvO.modal.open("schedule")
})

let primary_list = document.createElement("div")
primary_list.setAttribute("class", "list-primary")

let secondary_lists = document.createElement("div")
secondary_lists.setAttribute("class", "list-side")

lists_container.append(primary_list)
lists_container.append(secondary_lists)
lists_container.append(button)

let button_container = document.createElement("div")
button_container.setAttribute("class", "schedule-buttons")

let pop_up_container = document.createElement("div")
pop_up_container.setAttribute("class", "schedule-popup")
pop_up_container.append(button_container)

DvO.modal.define("schedule", pop_up_container)




// ==================== Functions ====================



function initList(name, template) {
	let add_to_template_button = document.createElement("button")
	add_to_template_button.textContent = `Add to ${name.slice(0,-1)}`
	add_to_template_button.addEventListener("click", async () => {
		
	})
	button_container.append(add_to_template_button)

	
	return dv.pages(`"Scheduling/${name}"`)
}

function setList(name, list) {
	let list_container = document.createElement("div")
	
	let h3 = document.createElement("h3")
	h3.innerText = name
	h3.style.textAlign = "center"

	let ul = document.createElement("ul")
	list.forEach(item => {
		ul.append(item)
	})
	ul.setAttribute("class", `schedule-list-${name} schedule-list-instance`)


	if(list.length !== 0) {
		list_container.append(h3)
		list_container.append(ul)
		
		if(args.primary === name) {
			primary_list.append(list_container)
		} else {
			secondary_lists.append(list_container)
		}
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
	return list.map((item, index) => {
		let li = document.createElement("li")
		li.style.display = "flex"
		
		nodes = map_func(item, index)
		
		for(let node of nodes) {
			li.append(node)
		}
		
		return li
	})
}

function sortByDate(list, day, time) {
	return list
}

function sortByNumber(list, target) {
	return list
}





// ==================== Definitions ====================




let routines = initList("Routines", `
---
Show On: Monday
Priority: 0
---
Description Here
`)

routines = filterList(routines, "Show On", routine => {
	routine = routine.trim()

	if(routine === "Everyday")
		return true;
	
	const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
	
	let date = new Date()
	let day;

	{
		day = weekdays[date.getDay()]
	}
	
	if(weekdays.includes(routine))
		return routine === day;

	let week_number, routine_number, routine_day;
	
	{
		let adjustedDate = date.getDate() + date.getDay()
		let prefixes = ['0', '1', '2', '3', '4', '5']
		week_number = (parseInt(prefixes[0 | adjustedDate / 7]))

		if(!isNaN(routine[0])) {
			[routine_number, routine_day] = routine.split(" ")
			routine_number = Number(routine_number[0])
			
		} 
	}

	if(!isNaN(routine[0]))
		return routine_number === week_number &&
			routine_day === day;

	let last_day;

	{
		if(routine.startsWith("Last")) {
			[_, routine_day] = routine.split(" ")
			

			let day_map = {
				"Monday": 1,
				"Tuesday": 2,
				"Wednesday": 3,
				"Thursday": 4,
				"Friday": 5,
				"Saturday": 6,
				"Sunday": 7,
			}
			let year = date.getFullYear()
			let month = date.getMonth()


			last_day = new Date(year, month+1, 0)
			if(last_day.getDay() < day_map[routine_day]) {
				last_day.setDate(last_day.getDate() - 7)
			}
			last_day.setDate(
				last_day.getDate() - (
					last_day.getDay() - day_map[routine_day]
				)
			)

		}
	}

	if(routine.startsWith("Last"))
		return date.getDate() === last_day.getDate();

	return false
})
routines = buildList(routines, routine => {
	let p = dv.el("p", routine.file.link, {attr: {
		style: "margin: 0px; "
	}})
	
	let input = document.createElement("input")
	input.setAttribute("type", "checkbox")
	input.setAttribute("style", "margin: 5px 0px; margin-right: 5px;")

	return [input, p]
})
setList("Routines", routines)


let tasks = initList("Tasks", `
---
Complete By: 2025-10-22
Priority: 0
---
Description Here
`)
tasks = filterList(tasks, "Complete By", task => {
	return true
})
tasks = buildList(tasks, (task, index) => {
	let p = dv.el("p", task.file.link, {attr: {
		style: "margin: 0px; padding-right: 10px;"
	}})

	let complete_by_tag = document.createElement("p")
	complete_by_tag.innerHTML = `${task.file.frontmatter["Complete By"]}`
	complete_by_tag.setAttribute("style", "margin: 0px; padding: 0px 0px 0px 10px; border-left: 2px solid;")
	return [p, complete_by_tag]
})
setList("Tasks", tasks)


let events = initList("Events", `
---
Start Date: 2023-10-30T6:00
End Date: 2023-10-31T19:00
Location: None
---
Description Here
`)
events = filterList(events, "End Date", event => {
	let date = new Date()
	let end = dv.date(event)
	let on_correct_month = (
		date.getFullYear() <= end.c.year &&
		date.getMonth() <= end.c.month
	)
	let before_day = date.getDay() < end.c.day
	let on_day = date.getDay() === end.c.day
	let before_time = (
		date.getHours() <= end.c.hour &&
		date.getMinutes() < end.c.minute
	)
	return (on_correct_month && before_day) ||
	(on_correct_month && on_day && before_time)
})
events = buildList(events, event => {
	let date = document.createElement("p")
	date.innerHTML = `${event.file.frontmatter["Start Date"].replace("T", " @ ")}<br><i>${event.file.frontmatter["End Date"].replace("T", " @ ")}</i>`
	date.setAttribute("style", "margin: 0px; padding: 5px 20px; text-align: center; border-right: 1px solid;")
	
	let p = dv.el("p", event.file.link, {attr: {
		style: "margin: 0px; padding: 5px 20px; align-self: center;"
	}})

	return [date, p]
})
setList("Events", events)
