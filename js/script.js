
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
console.log(initialPlaces[0].position);


var map;

function initMap() {
      	var mapDiv = document.getElementById('map');

      	
        var map = new google.maps.Map(mapDiv, {
          center: {lat: 40.220391, lng: -74.012082},
          scrollwheel: false,
          zoom: 15
        });




	var Marker = function(data) {


		console.log(data.position);

		var marker = new google.maps.Marker({
			position: data.position,
			title: name,
			address: data.address,
			map: map,
			animation: google.maps.Animation.DROP,
		});


		
		var contentString = 
			'<div id="content">' +
		      '<h3>' + marker.title + '</h3>' +
		      '<h4>' + marker.address + '</h4>' +
		    '</div>';
	

		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});

			marker.addListener('click', function() {
			infowindow.open(map, marker);
		});
		





		var clickedMarker;
		google.maps.event.addListener(marker, 'click', function() {
			clickedMarker = marker;
			// var nonClicked = clickedMarker.not( document.)
			console.log(clickedMarker.title);
			if(clickedMarker == marker) {
				marker.setAnimation(google.maps.Animation.BOUNCE);
				timeoutID = window.setTimeout(stopBouncing, 3000);
				function stopBouncing() {
					marker.setAnimation(null);
				};
			}
		});
	};





	var Place = function(data) {
		this.position = ko.observable(data.position);
		this.title = ko.observable(data.title);
		this.map = ko.observable(data.map);
		this.address = ko.observable(data.address);
		this.animation = google.maps.Animation.DROP

		console.log(data.position);
	};	


	






	var ViewModel = function() {

		var self = this;

		this.placeList = ko.observableArray([]);
		initialPlaces.forEach(function(placeItem){
			self.placeList.push( new Place(placeItem) );
		});
		this.currentPlace = ko.observable( this.placeList()[0] );


		this.markerList = ko.observableArray([]);
		initialPlaces.forEach(function(markerItem){
			self.markerList.push( new Marker(markerItem) );
		});


		/*
		this.points = ko.observableArray([
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
		]);

	    */


		this.currentMarker = ko.observable( this.markerList()[0] );

		this.setPlace = function(clickedPlace) {
			self.currentPlace(clickedPlace);
		};		





	};
	ko.applyBindings(new ViewModel());
};






