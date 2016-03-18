
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



var Marker = function() {


for(i=0;i<initialPlaces.length;i++){
	var place = initialPlaces[i];

		var marker = new google.maps.Marker({
			position: place.position,
			title: place.title,
			map: map,
			address: place.address,
			animation: google.maps.Animation.DROP,

		});
		bindEvent(marker, place, i);
	}
	



	function bindEvent(marker, place, i) {
		var image = 'img/marker-blue.png';
		image.id = "blue-marker";
		google.maps.event.addListener(marker, 'click', function() {
			if (marker.getAnimation() !== null) {
		    marker.setAnimation(null);
		  } else {
		    marker.setAnimation(google.maps.Animation.BOUNCE);
		    marker.setIcon(image)
		  }
		})
		google.maps.event.addListener(marker, 'click', function() {
			if (marker.getAnimation() !== google.maps.Animation.Bounce) {
				timeoutID = window.setTimeout(stopBouncing, 2200);
			};
			function stopBouncing() {
				marker.setAnimation(null);
			}
		})
	}

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
	})

	this.currentPlace = ko.observable( this.placeList()[0] );

	
	this.markers = ko.observableArray([]);


	self.markers.push( new Marker() );






	this.setPlace = function(clickedPlace) {
		self.currentPlace(clickedPlace);
		console.log(clickedPlace);
	};


};
ko.applyBindings(new ViewModel());
};





