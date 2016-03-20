
var	initialPlaces =  [
		 {
			position: {lat: 40.216147, lng: -74.012914},
			title: 'Johnny Mac House of Spirits',
			address: '208 Main St, Asbury Park, NJ 07712',
			src: 'img/macs.jpg',
			nums: 1,
			icon: null

		}, {
			position: {lat: 40.220001, lng: -74.000947},
			title: 'The Stone Pony',
			address: '913 Ocean Ave, Asbury Park, NJ 07712',
			src: 'img/pony.jpg',
			nums: 2,
			icon: null

		}, {
			position: {lat: 40.220239, lng: -74.002344},
			title: 'Porta Pizza/Wine Bar',
			address: '911 Kingsley St, Asbury Park, NJ 07712',
			src: 'img/porta.jpg',
			nums: 3,
			icon: null

		}, {
			position: {lat: 40.2207, lng: -73.999884},
			title: 'Silverball Museum',
			address: '1000 Ocean Ave, Asbury Park, NJ 07712',
			src: 'img/silverball.jpg',
			nums: 4,
			icon: null

		}, {
			position: {lat: 40.223796, lng: -73.998585},
			title: 'Convention Hall',
			address: '1300 Ocean Ave, Asbury Park, NJ 07712',
			src: 'img/hall.jpg',
			nums: 5,
			icon: null
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

	var Marker = function(data) {

		function drop() {
		    addMarkerWithTimeout(data.position, data.nums * 300);
		}
		drop();

		var image = 'img/marker-blue.png';

		function addMarkerWithTimeout(position, timeout) {
	  		window.setTimeout(function() {
			var marker = new google.maps.Marker({
				position: data.position,
				title: data.title,
				address: data.address,
				src: data.src,
				map: map,
				num: data.num,
				icon: null,
				animation: google.maps.Animation.DROP,
				infowindow: new google.maps.InfoWindow({
					content: 
					'<div id="content">'+
				      	'<h4>'+data.title+'</h4>'+
				      	'<h5>'+data.address+'</h5>'+
				      	'<img class="markerImg" src='+data.src+'>'+
				    '</div>',
				})
			
			});

			console.log(marker.infowindow.content);
			console.log(marker.title);

			$('#placeClick').click( function() { 
				marker.infowindow.open(map, marker);
				marker.setAnimation(google.maps.Animation.BOUNCE);
					timeoutID = window.setTimeout(stopBouncing, 2200);
						function stopBouncing() {
						marker.setAnimation(null);
			  		};

			});
				
		    var image = 'img/marker-blue.png';

				    marker.addListener('click', function() {
			    	marker.infowindow.open(map, marker);
					marker.setAnimation(google.maps.Animation.BOUNCE);
					timeoutID = window.setTimeout(stopBouncing, 2200);
						function stopBouncing() {
						marker.setAnimation(null);
			  		};
			  		if(marker.icon == image) 
				  		{
				  			marker.setIcon(null);
				  			marker.infowindow.close(map, marker);
				  			marker.setAnimation(null);
				  		}
			  		else
				  		{
				  			marker.setIcon(image);
				  		}
				  	console.log(marker.title);
				});

		  }, timeout);

	};

};

	var Searched = function() {
		$(document).ready(function(){
		    $('#place').keypress(function(e){
		      if(e.keyCode==13)
		      $('#button').click();
		    });
		});

		var places = [];
		var placeInput  = document.getElementById("place");
		var messageBox  = document.getElementById("display");
		var br = '</br>'

		function insert ( ) {
		 places.push( placeInput.value );
		 clearAndShow();

		}
		function clearAndShow () {
		  placeInput.value = "";
		  messageBox.innerHTML = "";
		  messageBox.innerHTML = places.join(br);
		}

		$('#button').click( function() { 
			insert();
		});
		
	}
Searched();

	var Place = function(data) {
		this.position = ko.observable(data.position);
		this.title = ko.observable(data.title);
		this.map = ko.observable(data.map);
		this.address = ko.observable(data.address);
		this.animation = google.maps.Animation.DROP;

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


		this.currentMarker = ko.observable( this.markerList()[0] );

		this.setPlace = function(clickedPlace) {
			self.currentPlace(clickedPlace);
			console.log(self.currentPlace);
		};	



	};

	ko.applyBindings(new ViewModel());
};






