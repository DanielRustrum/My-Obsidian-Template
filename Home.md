```dataviewjs
let weekend_message = `Its the Weekend! Enjoy Yourself, Make Some Memeories!`
let monday_message =  `Today is Admin Day, Focus on getting your needs done today.`
let tuesday_message = `Today is Self-Care Day! Focus on taking care of yourself Today.`
let default_message = `Have a wonderful day!`

let day = new Date().getDay()
let el_attr = {
	attr: {style: 'text-align: center; margin: 50px 0px 30px; font-weight: bold;'}
}
switch(day) {
	case 0:
	case 6:
		dv.el("p", weekend_message, el_attr)
		break
	case 1:
		dv.el("p", monday_message, el_attr)
		break
	case 2:
		dv.el("p", tuesday_message, el_attr)
		break
	default:
		dv.el("p", default_message, el_attr)
}
```