

function initMap() {
	var image = 'img/marker-blue.png';

	var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
          center: {lat: 40.220391, lng: -74.012082},
          scrollwheel: false,
          zoom: 15
        });

   var	initialPlaces = [
		 {
			position: {lat: 40.216147, lng: -74.012914},
			title: 'Johnny Mac House of Spirits',
			address: '208 Main St, Asbury Park, NJ 07712',
			src: 'img/macs.jpg',
			nums: 1,
			icon: null,
			marker: marker = []
		}, {
			position: {lat: 40.220001, lng: -74.000947},
			title: 'The Stone Pony',
			address: '913 Ocean Ave, Asbury Park, NJ 07712',
			src: 'img/pony.jpg',
			nums: 2,
			icon: null,
			marker: marker = []
		}, {
			position: {lat: 40.220239, lng: -74.002344},
			title: 'Porta Pizza/Wine Bar',
			address: '911 Kingsley St, Asbury Park, NJ 07712',
			src: 'img/porta.jpg',
			nums: 3,
			icon: null,
			marker: marker = []
		}, {
			position: {lat: 40.2207, lng: -73.999884},
			title: 'Silverball Museum',
			address: '1000 Ocean Ave, Asbury Park, NJ 07712',
			src: 'img/silverball.jpg',
			nums: 4,
			icon: null,
			marker: marker = []
		}, {
			position: {lat: 40.223796, lng: -73.998585},
			title: 'Convention Hall',
			address: '1300 Ocean Ave, Asbury Park, NJ 07712',
			src: 'img/hall.jpg',
			nums: 5,
			icon: null,
			marker: marker = []
		}
		
	];

//console.log(initialPlaces[0].marker);



	var Marker = function(data) {

		function drop() {
		    addMarkerWithTimeout(data.position, data.nums * 300);
		}
		drop();



		var markers;


		  function addMarkerWithTimeout(position, timeout) {
	  		window.setTimeout(function() {
	  		var markerPushed = data.marker.push(
			markers = new google.maps.Marker({
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
				    stuff: map, marker
				})
			}));

		//	console.log(markers.infowindow.stuff);

			  		var len = initialPlaces.length;
		//	console.log(markers.infowindow.stuff);
			markers.addListener('click', function() {
				for(i=0;i<len;i++){
					var mark = initialPlaces[i].marker[0];
					console.log(initialPlaces[i].marker[0].icon);
					mark.setIcon(null);
					mark.infowindow.close(map, markers);
				}
				if(markers.icon == null)
				{
					markers.setIcon(image);
					markers.infowindow.open(map, markers);
					markers.setAnimation(google.maps.Animation.BOUNCE);
					timeoutID = window.setTimeout(stopBouncing, 2200);
					function stopBouncing() {
						markers.setAnimation(null);
					};

				}
				else 
				{
					markers.setIcon(null);
					markers.infowindow.close(map, markers);
					markers.setAnimation(null);
				}				 
			});
		}, timeout);
	}
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
		this.infowindow = ko.observable(data.infowindow);
		this.marker = ko.observable(data.marker);

	};	



	var ViewModel = function() {
		var self = this;

		this.placeList = ko.observableArray([]);
		initialPlaces.forEach(function(placeItem){
			self.placeList.push( new Place(placeItem) );
		});
		this.currentPlace = ko.observable( this.placeList()[0] );
	//	console.log(this.currentPlace().infowindow);
		//console.log(this.placeList()[0]);
		

		this.markerList = ko.observableArray([]);
		initialPlaces.forEach(function(markerItem){
			self.markerList.push( new Marker(markerItem) );
		});
	//	this.currentMarker = ko.observable( this.markerList()[0] );

		

	

		this.setPlace = function(clickedPlace) {
			self.currentPlace(clickedPlace);

	//		console.log(clickedPlace.address());

			var curMark = self.currentPlace().marker()[0];

			console.log(curMark.address);
			var len = initialPlaces.length;
			console.log(len);
			
			for(i=0;i<len;i++){
				var mark = initialPlaces[i].marker[0];
				mark.setIcon(null);
				mark.infowindow.close(map, curMark);
			}
			if(curMark.icon == null)
			{
				curMark.setIcon(image);
				curMark.infowindow.open(map, curMark);
				curMark.setAnimation(google.maps.Animation.BOUNCE);
				timeoutID = window.setTimeout(stopBouncing, 2200);
				function stopBouncing() {
					curMark.setAnimation(null);
				};

			}
			else 
			{
				curMark.setIcon(null);
				curMark.infowindow.close(map, curMark);
				curMark.setAnimation(null);
			}
		};	



	};


	ko.applyBindings(new ViewModel());
};
//apis to check out
//instagram api
//yelp api
//census api










