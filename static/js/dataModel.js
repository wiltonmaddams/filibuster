function Event(eventData) {
	var self = this;
	self.title = eventData.title;
	self.slogan = eventData.slogan;
	self.season = eventData.season;
	self.address = eventData.address;
	self.time = eventData.time;
	self.source = eventData.source;
	self.description = eventData.description;
	self.theme = eventData.theme;
}

function filiViewModel() {
	var self = this;
	var events = [
		{
			"title": "Mating Call", 
			"slogan": "Get wild.",
			"season": "Spring 2017",
			"address": "173 Morgan Ave. Brooklyn, NY 11206",
			"time": "2-8pm",
			"source": "./Assets/background-1.jpg",
			"description": "Mating Call this is an example of a long description. Mating Call this is an example of a long description.",
			"theme": "purple"
		},
		{
			"title": "Sunset Sounds", 
			"slogan": "Go on a field trip.",
			"season": "Summer 2017",
			"address": "A field",
			"time": "2-9pm",
			"source": "./Assets/background-2.jpg",
			"description": "Sunset Sounds this is an example of a long description. Sunset Sounds this is an example of a long description.",
			"theme": "red"
		},
		{
			"title": "Current Event", 
			"slogan": "Float on.",
			"season": "Fall 2017",
			"address": "A river",
			"time": "2-10pm",
			"source": "./Assets/background-3.jpg",
			"description": "Current Event this is an example of a long description. Current Event this is an example of a long description.",
			"theme": "green"
		},
		{
			"title": "FearGarden", 
			"slogan": "Dance to death.",
			"season": "Winter 2017",
			"address": "The Well",
			"time": "2-11pm",
			"source": "./Assets/background-4.jpg",
			"description": "Fear Garden this is an example of a long description. Fear Garden this is an example of a long description.",
			"theme": "black"
		}
	]
	var mappedEvents = $.map(events, function(eventData) {	
		return new Event(eventData);
	});
	self.events = ko.observableArray(mappedEvents);
	self.activeEvent = ko.observable(self.events()[0]); // Default active event is Mating Call
	
	self.setActiveEvent = function(filiEvent) {
		self.activeEvent(filiEvent);
	}
}

var newFB = new filiViewModel();
ko.applyBindings(newFB);