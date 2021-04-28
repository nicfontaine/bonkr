(function() {"use strict"})()

const dde = {

	dom: {
		triggers: document.getElementsByClassName("dropdown-event"),
		body: document.getElementsByTagName("body")[0]
	},

	// Hold reference to body events
	listeners: [],

	loopBack: function(cb) {
		for (var i=0; i<dde.dom.triggers.length; i++) {
			let trigger = dde.dom.triggers[i]
			;(function(trig, c, index) {
				c(trig, index)
			})(trigger, cb, i)
		}
	},

	addEvent: function() {
		let cb = (trigger, i) => {

			// Create array index to hold body event listener references
			dde.listeners.push(undefined)

			let list = trigger.getElementsByClassName("dropdown-list")[0]

			trigger.addEventListener("click", e => {
				// Don't trigger below on children of toggle
				if (e.target !== trigger) return

				// Close toggle, and remove body listener
				if (trigger.classList.contains("active")) {
					trigger.classList.remove("active")
					list.classList.remove("show")
					dde.dom.body.removeEventListener("click", dde.listeners[i], true)
				}
				// Open toggle, add listener on body to close (will delete itself)
				else {
					trigger.classList.add("active")
					list.classList.add("show")
					list.getElementsByTagName("a")[0].focus()
					// Body event function. save to eventlisteners
					dde.listeners[i] = function(e) {
						// Child of trigger
						if (trigger.contains(e.target)) return
						// Remove itself, and reset reference
						dde.dom.body.removeEventListener("click", dde.listeners[i], true)
						dde.listeners[i] = undefined
						// Is trigger
						if (e.target === trigger) return
						// Hide DD
						trigger.classList.remove("active")
						list.classList.remove("show")
					}
					// Add body event
					dde.dom.body.addEventListener("click", dde.listeners[i], true)
				}

			}, true)

		}
		// Execute on every dropdown, using loop
		dde.loopBack(cb)
	}

}

if (dde.dom.triggers != undefined) {
	dde.addEvent()
}