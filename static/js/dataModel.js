function Event(eventData) {
	var self         = this;
	self.title       = eventData.title;
	self.id          = eventData.id;
	self.slogan      = eventData.slogan;
	self.season      = eventData.season;
	self.address     = eventData.address;
	self.date        = eventData.date;
	self.time        = eventData.time;
	self.source      = eventData.source;
	self.images      = eventData.images;
	self.description = eventData.description;
	self.theme       = eventData.theme;
}

function filiViewModel() {
	var self = this;
	var events = [
		{
			"title": "Mating Call", 
			"id": "mating-call",
			"slogan": "Get wild.",
			"season": "Spring",
			"address": "173 Morgan Ave. Brooklyn, NY 11206",
			"date": "May 20th",
			"time": "May 20th",
			"images": {
				"mobile"    : "./assets/event_mating-call_background.png",
				"foreground": "./assets/event_mating-call_foreground_lg.png",
				"midground" : "./assets/event_mating-call_midground_lg.png",
				"background": "./assets/event_mating-call_background_lg.jpg"
			},
			"source": "./assets/event_mating-call_background_lg.jpg",
			"description": "Mating Call this is an example of a long description. Mating Call this is an example of a long description.",
			"theme": "purple"
		},
		{
			"title": "Sunset Sounds", 
			"id": "sunset-sounds",
			"slogan": "Go on a field trip.",
			"season": "Summer",
			"address": "A field",
			"date": "July 8th",
			"time": "July 8th",
			"images": {
				"mobile"    : "./assets/event_sunset-sounds_background.png",
				"foreground": "./assets/event_sunset-sounds_foreground_lg.png",
				"midground" : "./assets/event_sunset-sounds_midground_lg.png",
				"background": "./assets/event_sunset-sounds_background_lg.png"
			},
			"source": "./assets/event_sunset-sounds_background_lg.png",
			"description": "Sunset Sounds this is an example of a long description. Sunset Sounds this is an example of a long description.",
			"theme": "red"
		},
		{
			"title": "SQUADron", 
			"id": "squadron",
			"slogan": "Float on.",
			"season": "Fall",
			"address": "A river",
			"date": "August 19th",
			"time": "August 19th",
			"images": {
				"mobile"    : "./assets/event_squadron_background.png",
				"foreground": "./assets/event_squadron_foreground_lg.png",
				"midground" : "./assets/event_squadron_midground_lg.png",
				"background": "./assets/event_squadron_background_lg.jpg"
			},
			"source": "./assets/event_squadron_background_lg.jpg",
			"description": "Current Event this is an example of a long description. Current Event this is an example of a long description.",
			"theme": "green"
		},
		{
			"title": "FearGarden", 
			"id": "feargarden",
			"slogan": "Dance to death.",
			"season": "Winter",
			"address": "The Well",
			"date": "September 30th",
			"time": "September 30th",
			"images": {
				"mobile"    : "./assets/event_feargarden_background.png",
				"foreground": "./assets/event_feargarden_foreground_lg.png",
				"midground" : "./assets/event_feargarden_midground_lg.png",
				"background": "./assets/event_feargarden_background_lg.jpg"
			},
			"source": "./assets/event_feargarden_background_lg.jpg",
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