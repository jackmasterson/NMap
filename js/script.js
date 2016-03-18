
var	initialPlaces =  [
		 {
			position: {lat: 40.216147, lng: -74.012914},
			title: 'Johnny Mac House of Spirits',
			address: '208 Main St, Asbury Park, NJ 07712'

		}, {
			position: {lat: 40.220001, lng: -74.000947},
			title: 'The Stone Pony',
			address: '913 Ocean Ave, Asbury Park, NJ 07712'
		}, {
			position: {lat: 40.220239, lng: -74.002344},
			title: 'Porta Pizza/Wine Bar',
			address: '911 Kingsley St, Asbury Park, NJ 07712'
		}, {
			position: {lat: 40.2207, lng: -73.999884},
			title: 'Silverball Museum',
			address: '1000 Ocean Ave, Asbury Park, NJ 07712'
		}, {
			position: {lat: 40.223796, lng: -73.998585},
			title: 'Convention Hall',
			address: '1300 Ocean Ave, Asbury Park, NJ 07712'
		}
	];


var map;

	function initMap() {
      	var mapDiv = document.getElementById('map');

      	
        var map = new google.maps.Map(mapDiv, {
          center: {lat: 40.220391, lng: -74.012082},
          scrollwheel: false,
          zoom: 15
        });



var Marker = function(name, lat, long, address) {


	this.name = name;
	this.lat = ko.observable(lat);
	this.long = ko.observable(long);
	this.address = ko.observable(address);

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, long),
		title: name,
		map: map,
	})
//	this.animation = google.maps.Animation.DROP;
//	this.icon = ko.observable(data.null)

};


var Place = function(data) {
	this.position = ko.observable(data.position);
	this.title = ko.observable(data.title);
	this.map = ko.observable(data.map);
	this.address = ko.observable(data.address);
	this.animation = google.maps.Animation.DROP

//	console.log(data.position);
//	console.log(this.position);
//	console.log(data.title);
//	console.log(data.address);

};


var ViewModel = function() {

	var self = this;

	this.placeList = ko.observableArray([]);

	initialPlaces.forEach(function(placeItem){
		self.placeList.push( new Place(placeItem) );
	});

	this.currentPlace = ko.observable( this.placeList()[0] );
	console.log(this.placeList()[0]);

	
	points: ko.observableArray([
		new Marker('Johnny Mac House of Spirits', 40.216147,
			-74.012914, '208 Main St, Asbury Park, NJ 07712'),
		new Marker('The Stone Pony', 40.220001, -74.000947,
			'913 Ocean Ave, Asbury Park, NJ 07712'),
		new Marker('Porta Pizza and Wine Bar', 40.220239, -74.002344,
			'911 Kingsley St, Asbury Park, NJ 07712'),
		new Marker('Silverball Museum', 40.2207, -73.999884,
			'1000 Ocean Ave, Asbury Park, NJ 07712'),
		new Marker('Convention Hall', 40.223796, -73.998585,
			'1300 Ocean Ave, Asbury Park, NJ 07712')
	])

	/*this.markers = ko.observableArray([]);

	initialPlaces.forEach(function(placeItem){
		self.markers.push( new google.maps.Marker(placeItem) );
	});
	
	this.currentMarker = ko.observable( this.markers()[0]);
	console.log(this.markers()[0]);
*/




	this.setMarker = function(clickedMarker) {
		self.currentMarker(clickedMarker);
		console.log(clickedMarker);
	}


	this.setPlace = function(clickedPlace) {
		self.currentPlace(clickedPlace);
		console.log(clickedPlace);
	};


};
ko.applyBindings(new ViewModel());
};






