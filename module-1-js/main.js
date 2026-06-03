// Task 1: JavaScript setup and load notification
console.log("Welcome to the Community Portal");

window.addEventListener("load", function() {
	alert("Event portal loaded successfully!");
});

// Task 2: Syntax, data types, operators, and template literals
const featuredEventName = "Community Music Festival";
const featuredEventDate = "2026-06-15";
let featuredEventSeats = 50;
featuredEventSeats++;
featuredEventSeats--;
console.log(`Event: ${featuredEventName}, Date: ${featuredEventDate}, Seats: ${featuredEventSeats}`);

// Task 5: Event constructor and prototype methods
function Event(name, date, category, location, totalSeats, fee) {
	this.name = name;
	this.date = date;
	this.category = category;
	this.location = location;
	this.totalSeats = totalSeats;
	this.availableSeats = totalSeats;
	this.fee = fee;
	this.registrations = [];
}

Event.prototype.checkAvailability = function() {
	return this.availableSeats > 0;
};

Event.prototype.register = function(userName) {
	if (!this.checkAvailability()) {
		throw new Error("No seats available for " + this.name);
	}
	this.availableSeats--;
	this.registrations.push(userName);
	return true;
};

Event.prototype.cancelRegistration = function(userName) {
	const index = this.registrations.indexOf(userName);
	if (index >= 0) {
		this.registrations.splice(index, 1);
		this.availableSeats++;
	}
};

Event.prototype.getDetails = function() {
	return Object.entries(this);
};

// Task 6: Arrays and methods
const eventList = [
	new Event("Music Festival", "2026-06-15", "Music", "City Park", 100, 500),
	new Event("Food Drive", "2026-06-20", "Food", "Community Hall", 50, 0),
	new Event("Art Workshop", "2026-06-22", "Art", "Library Block B", 30, 300),
	new Event("Book Fair", "2026-06-25", "Books", "Central Library", 200, 0),
	new Event("Marathon", "2026-07-01", "Sports", "City Streets", 500, 800)
];

function addEvent(name, date, category, location, seats, fee) {
	const newEvent = new Event(name, date, category, location, seats, fee);
	eventList.push(newEvent);
	return newEvent;
}

addEvent("Photography Walk", "2026-07-05", "Art", "Old Town", 25, 150);

const musicEvents = eventList.filter(event => event.category === "Music");
const displayCards = eventList.map(event => `${event.name} at ${event.location}`);
console.log("Music events:", musicEvents.map(event => event.name));
console.log("Display cards:", displayCards);
console.log("First event entries:", eventList[0].getDetails());

// Task 4: Functions, callbacks, and closure-based registration tracking
function createCategoryTracker() {
	const totalRegistrations = {};

	return {
		addRegistration: function(category) {
			totalRegistrations[category] = (totalRegistrations[category] || 0) + 1;
			return totalRegistrations[category];
		},
		getTotal: function(category) {
			return totalRegistrations[category] || 0;
		}
	};
}

const categoryTracker = createCategoryTracker();

function filterEventsByCategory(category, callback) {
	const filteredEvents = category === "all"
		? [...eventList]
		: [...eventList].filter(event => event.category === category);
	callback(filteredEvents);
}

function registerUser(userName, eventName, callback) {
	try {
		const selectedEvent = eventList.find(event => event.name === eventName);
		if (!selectedEvent) {
			throw new Error("Selected event was not found.");
		}

		selectedEvent.register(userName);
		const total = categoryTracker.addRegistration(selectedEvent.category);
		callback(true, `Successfully registered for ${eventName}. Category registrations: ${total}`);
		renderAllEvents();
	} catch (error) {
		callback(false, error.message);
	}
}

function cancelRegistration(userName, eventName) {
	const selectedEvent = eventList.find(event => event.name === eventName);
	if (selectedEvent) {
		selectedEvent.cancelRegistration(userName);
		renderAllEvents();
	}
}

// Task 3: Conditionals, loops, and valid event filtering
function displayValidEvents() {
	const today = new Date();
	const validEvents = [];

	eventList.forEach(event => {
		const eventDate = new Date(event.date);
		if (eventDate > today && event.checkAvailability()) {
			validEvents.push(event);
		}
	});

	return validEvents;
}

// Task 7: DOM manipulation
function createEventCard(event) {
	const card = document.createElement("div");
	card.className = "event-card";

	const title = document.createElement("h4");
	title.textContent = event.name;

	const details = document.createElement("p");
	details.textContent = `${event.date} | ${event.category} | ${event.location} | Seats: ${event.availableSeats} | Fee: Rs. ${event.fee}`;

	const registerButton = document.createElement("button");
	registerButton.type = "button";
	registerButton.textContent = "Register";
	registerButton.onclick = function() {
		const userName = prompt("Enter your name:");
		if (userName) {
			registerUser(userName.trim(), event.name, function(success, message) {
				alert(message);
				if (success) {
					$(card).fadeOut(function() {
						$(card).fadeIn();
					});
				}
			});
		}
	};

	const cancelButton = document.createElement("button");
	cancelButton.type = "button";
	cancelButton.textContent = "Cancel";
	cancelButton.onclick = function() {
		const userName = prompt("Enter the registered name to cancel:");
		if (userName) {
			cancelRegistration(userName.trim(), event.name);
		}
	};

	card.append(title, details, registerButton, cancelButton);
	return card;
}

function renderEvents(containerId, events) {
	const container = document.querySelector(containerId);
	if (!container) return;

	container.innerHTML = "";
	if (events.length === 0) {
		container.textContent = "No upcoming events available.";
		return;
	}

	events.forEach(event => {
		container.appendChild(createEventCard(event));
	});
}

function renderAllEvents() {
	renderEvents("#upcomingEvents", displayValidEvents());
	populateEventOptions();
}

// Task 8: Event handling
function handleCategoryFilter() {
	const filterSelect = document.querySelector("#categoryFilter");
	filterSelect.addEventListener("change", function() {
		filterEventsByCategory(this.value, function(events) {
			renderEvents("#filterResults", events);
		});
	});
}

function handleQuickSearch() {
	const searchInput = document.querySelector("#eventSearch");
	searchInput.addEventListener("keydown", function(event) {
		if (event.key === "Enter") {
			const searchTerm = searchInput.value.trim().toLowerCase();
			const results = eventList.filter(item => item.name.toLowerCase().includes(searchTerm));
			renderEvents("#searchResults", results);
		}
	});
}

// Task 9: Promises, async/await, and loading spinner
function mockFetchEvents() {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve({ success: true, data: eventList });
		}, 600);
	});
}

function loadEventsWithPromise() {
	return mockFetchEvents()
		.then(response => response.data)
		.catch(error => {
			console.error("Error loading events:", error);
			return [];
		});
}

async function loadEventsWithAsync() {
	const spinner = document.querySelector("#loadingSpinner");
	spinner.style.display = "block";

	try {
		const response = await mockFetchEvents();
		return response.data;
	} catch (error) {
		console.error("Async loading failed:", error);
		return [];
	} finally {
		spinner.style.display = "none";
	}
}

// Task 10: Modern JavaScript features
function createEventSummary(eventName, year = 2026) {
	const event = eventList.find(item => item.name === eventName);
	return event ? `${event.name} (${year})` : "Event not found";
}

function extractEventInfo(event) {
	const { name, category, location, availableSeats } = event;
	return `${name} - ${category} event at ${location}. Seats left: ${availableSeats}`;
}

function cloneEventList() {
	return [...eventList];
}

console.log(createEventSummary("Music Festival"));
console.log(extractEventInfo(eventList[0]));
console.log("Cloned events:", cloneEventList().length);

// Task 11: Forms and inline validation
function populateEventOptions() {
	const eventType = document.querySelector("#eventType");
	const selectedValue = eventType.value;
	eventType.innerHTML = '<option value="">Select an event</option>';

	displayValidEvents().forEach(event => {
		const option = document.createElement("option");
		option.value = event.name;
		option.textContent = event.name;
		eventType.appendChild(option);
	});

	eventType.value = selectedValue;
}

function showFormError(message) {
	document.querySelector("#formError").textContent = message;
}

function handleFormSubmission(event) {
	event.preventDefault();
	showFormError("");

	const form = event.target;
	const name = form.elements.name.value.trim();
	const email = form.elements.email.value.trim();
	const eventType = form.elements.eventType.value;

	try {
		console.log("Submitting form", { name, email, eventType });

		if (!name || !email || !eventType) {
			throw new Error("Please fill all required fields.");
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			throw new Error("Please enter a valid email address.");
		}

		registerUser(name, eventType, function(success, message) {
			const confirmation = document.querySelector("#confirmation");
			confirmation.value = message;
			confirmation.style.color = success ? "green" : "red";

			if (success) {
				sendRegistrationToServer({ name, email, eventType });
				form.reset();
			}
		});
	} catch (error) {
		showFormError(error.message);
	}
}

// Task 12: Fetch API style submission with delayed mock server response
function sendRegistrationToServer(payload) {
	const statusDiv = document.querySelector("#serverStatus");
	statusDiv.classList.add("show");
	statusDiv.textContent = "Sending registration to server...";
	console.log("Fetch request payload:", payload);

	setTimeout(() => {
		fetch("data:application/json,%7B%22message%22%3A%22Registered%20successfully%22%7D", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(payload)
		})
			.then(response => response.json())
			.then(data => {
				statusDiv.textContent = data.message;
				statusDiv.style.color = "green";
			})
			.catch(error => {
				statusDiv.textContent = "Registration failed.";
				statusDiv.style.color = "red";
				console.error("Fetch failed:", error);
			});
	}, 800);
}

// Task 14: jQuery-style helper for click, fadeIn, and fadeOut
function $(target) {
	const element = typeof target === "string" ? document.querySelector(target) : target;

	return {
		click: function(callback) {
			if (element) element.addEventListener("click", callback);
		},
		fadeIn: function(callback) {
			if (!element) return;
			element.style.opacity = "0";
			element.style.display = "block";
			let opacity = 0;
			const interval = setInterval(() => {
				opacity += 0.1;
				element.style.opacity = opacity.toString();
				if (opacity >= 1) {
					clearInterval(interval);
					if (callback) callback();
				}
			}, 25);
		},
		fadeOut: function(callback) {
			if (!element) return;
			let opacity = 1;
			const interval = setInterval(() => {
				opacity -= 0.1;
				element.style.opacity = opacity.toString();
				if (opacity <= 0) {
					element.style.display = "none";
					clearInterval(interval);
					if (callback) callback();
				}
			}, 25);
		}
	};
}

console.log("React and Vue make large apps easier by keeping UI state and DOM updates organized.");

// Task 13: Debugging helpers and startup wiring
document.addEventListener("DOMContentLoaded", async function() {
	console.log("DOM Content Loaded");

	document.querySelector("#registrationForm").addEventListener("submit", handleFormSubmission);
	handleCategoryFilter();
	handleQuickSearch();
	$("#registerBtn").click(function() {
		console.log("Register button clicked through jQuery-style helper");
	});

	await loadEventsWithPromise();
	await loadEventsWithAsync();
	renderAllEvents();
	console.log("Total events available:", eventList.length);
});

window.debugEvents = function() {
	console.group("Registered Events");
	eventList.forEach(event => {
		console.log(event.name, {
			available: event.availableSeats,
			total: event.totalSeats,
			registrations: event.registrations.length
		});
	});
	console.groupEnd();
};
