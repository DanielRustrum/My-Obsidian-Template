let weekend_message = `Its the Weekend! Enjoy Yourself, Make Some Memeories!`
let admin_message =  `Today is Admin Day, Focus on getting your needs done for the week.`
let cleanup_message = `Today is Cleaning and Cooking Day! Time to get ready for the weekend!`
let self_care_message = `Today is Self-Care Day! Focus on taking care of yourself Today.`
let default_message = `It isn't a dedicated day today, Have a wonderful day!`

let day = new Date().getDay()
let el_attr = {
	attr: {
		style: 'text-align: center; margin: 50px 0px 30px; font-weight: bold;'
	}
}

switch(day) {
	case 0:
	case 6:
		dv.el("p", weekend_message, el_attr)
		break
	case 1:
		dv.el("p", cleanup_message, el_attr)
		break
	case 2:
		dv.el("p", admin_message, el_attr)
		break
	case 4:
		dv.el("p", self_care_message, el_attr)
		break
	default:
		dv.el("p", default_message, el_attr)
}