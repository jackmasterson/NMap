$(document).ready(function () {
    $('.slideout-menu-toggle').on('click', function(event){
    	event.preventDefault();
    	// create menu variables
    	var slideoutMenu = $('#jamBase-header');
    	var slideoutMenuWidth = $('#jamBase-header').width();
    	
    	// toggle open class
    	slideoutMenu.toggleClass("open");
    	
    	// slide menu
    	if (slideoutMenu.hasClass("open")) {
	    	slideoutMenu.animate({
		    	left: "0px"
	    	});	
    	} else {
	    	slideoutMenu.animate({
		    	left: -slideoutMenuWidth
	    	}, 250);	
    	}
    });
});

var divs = $('div[data-filter]');
$('#place').on('keyup', function() {
    var val = $.trim(this.value);
    divs.hide();
    divs.filter(function() {
        return $(this).data('filter').search(val) >= 0
    }).show();
});

divs.on('click', function() {
    divs.not(this).hide();
    var text = $.trim($(this).text());
    $('#place').val(text);
})


function socrataData() {
	var $socrataElem = $('#socrata-header');
	var socrataURL = 'https://odn.data.socrata.com/resource/uf4m-5u8r.json?' +
		'id=1600000US3401960';
	var socrataTimeout = setTimeout(function(){
		$socrataElem.text('You were supposed to see some awesome census data ' +
			'about Asbury Park, NJ, but the request failed. And its all. my.' +
			' fault. Im sorry to let you down.');
	}, 1000);

	$.ajax({
		url: socrataURL,
		dataType: "json",
		//jsonp: "callback",
		success: function(response){
	//		console.log(response[0]);
			var infos=response;
			for(var i=0; i<infos.length; i++){
				var info = infos[i];
		
				$socrataElem.prepend('<ul class="info">Asbury Park, NJ Census Facts | ' +
					'<li id="infoHead"> Year: ' + info.year + ' | </li> ' +
					'<li id="infoHead"> Population: ' + info.population + ' | </li> ' +
					'<li id="infoHead"> High School Graduation Rate: ' 
						+ info.percent_high_school_graduate + '% | </li> ' +
					'<li id="infoHead"> Bachelors Degree: ' 
						+ info.percent_bachelors_degree + '% | </li> ' +
					'<li id="infoHead"> Associates Degree: ' 
						+ info.percent_associates_degree + '% | </li> ' +
					'<li id="infoHead"> Information Courtesy Socrata Open Data Network | </li> ' +
					'</ul>')
			}
			clearTimeout(socrataTimeout);
		}
	});

};

socrataData();

function jamBase() {
	var $jamBaseElem = $('#jamBase-header');
	var jamBaseURL = 'http://api.jambase.com/events?zipCode=07712' +
	'&radius=5&page=0&api_key=u34rze74n8752gcq7nt3bzn3';
	var jamBaseTimeout = setTimeout(function(){
		$jamBaseElem.text('This was supposed to show a bunch of information ' +
			'about concerts in the area, and the request failed. Im so, so sorry. '+
			'So instead, here is a picture of a microphone, which should make up for' +
			' it. Right?');
		var mic = '</br><img src="img/microphone.jpg" id="mic">';
		$jamBaseElem.append(mic);
	}, 5000);

	/*$.ajax({
		url: jamBaseURL,
		dataType: "json",
		success: function(response) {
	//		console.log("SUCCESS!");
			$jamBaseElem.text('Live Music, Courtesy JamBase');

				var infos = response.Events;


		for(i=0;i<infos.length;i++){
			
			var info = response.Events[i];

			var artists = info.Artists

			
			for(t=0;t<artists.length;t++){
				var artist = info.Artists[t];
	
	//			console.log(artist);
	//			console.log(info);
				

				var jamBaseStuff = '<ul class="concerts">' +
					'<a href="#" class="slideout-menu-toggle">&times;</a></h3>'+
					'<li id="concertsHead">Artist: ' + artist.Name + '</li>' +
					'<li id="concertsHead">Venue: ' + info.Venue.Name + '</li>' +
					'<li id="concertsHead"><a target="_blank" href="' + info.TicketUrl +
						'">Tickets</a></li>' +
					'</ul></br>';
					$jamBaseElem.append(jamBaseStuff);
				}
		};
			clearTimeout(jamBaseTimeout);

		}
	});*/
};
jamBase();



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
			marker: marker = [],
			visible: true
		}, {
			position: {lat: 40.220001, lng: -74.000947},
			title: 'The Stone Pony',
			address: '913 Ocean Ave, Asbury Park, NJ 07712',
			src: 'img/pony.jpg',
			nums: 2,
			icon: null,
			marker: marker = [],
			visible: true
		}, {
			position: {lat: 40.220239, lng: -74.002344},
			title: 'Porta Pizza/Wine Bar',
			address: '911 Kingsley St, Asbury Park, NJ 07712',
			src: 'img/porta.jpg',
			nums: 3,
			icon: null,
			marker: marker = [],
			visible: true
		}, {
			position: {lat: 40.2207, lng: -73.999884},
			title: 'Silverball Museum',
			address: '1000 Ocean Ave, Asbury Park, NJ 07712',
			src: 'img/silverball.jpg',
			nums: 4,
			icon: null,
			marker: marker = [],
			visible: true
		}, {
			position: {lat: 40.223796, lng: -73.998585},
			title: 'Convention Hall',
			address: '1300 Ocean Ave, Asbury Park, NJ 07712',
			src: 'img/hall.jpg',
			nums: 5,
			icon: null,
			marker: marker = [],
			visible: true
		}
		      
	];

//console.log(initialPlaces[0].marker);



	var Marker = function(data) {
		this.position = ko.observable(data.position);
		this.title = ko.observable(data.title);
		this.map = ko.observable(data.map);
		this.address = ko.observable(data.address);
		this.animation = google.maps.Animation.DROP;
		this.infowindow = ko.observable(data.infowindow);
		this.marker = ko.observable(data.marker);
		this.visible = ko.observable(data.visible);


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
				visible: data.visible,
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
		//			console.log(initialPlaces[i].marker[0].icon);
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

			query = ko.observable('');
			
			this.placeList = ko.observableArray([]);
			initialPlaces.forEach(function(placeItem){
				self.placeList.push( new Place(placeItem) );
			});

			this.currentPlace = ko.observable( this.placeList()[0] );


			this.markerList = ko.observableArray([]);
			initialPlaces.forEach(function(markerItem){
				self.markerList.push( new Marker(markerItem) );
			});


		
		self.filterPins = ko.computed(function () {



		    var search = this.query().toLowerCase();


		    return ko.utils.arrayFilter(self.placeList(), function (item) {
		    	var lower = item.title().toLowerCase();
		    	var lowerIndex = lower.indexOf(search) >=0;
		    	var len = self.placeList().length;
		    	var q;
		    	var t;
		    	var lowerQ;
		    	var lowerIndexQ;
				var removeMark = function() {				
	   		
				   		for (var p=0;p<len;p++){
				   			q = initialPlaces[p].marker[0];
				   			l = initialPlaces[p];
				   			t = initialPlaces[p].title;
				   			console.log(l);
				   			console.log(t);

				   			if(lowerIndex !== true){
				   				lowerQ = q.title.toLowerCase();
				   				lowerIndexQ = lowerQ.indexOf(search) >=0;

				   				if(lowerIndexQ !== true){
				   					q.setMap();
				   					self.placeList.remove( item );
				   				}
				   			}
				   		}			
			  	};
			  	removeMark();

				var addBack = function() {

					$('body').keyup(function(e){
						if(e.keyCode == 13, 8){					
						       // user has pressed backspace or enter
							var addMark = function() {
				   				for (var p=0;p<len;p++){
				   					q = initialPlaces[p].marker[0];
				   						console.log(q);

						   			if(lowerIndex !== true){
						   				lowerQ = q.title.toLowerCase();
						   				lowerIndexQ = lowerQ.indexOf(search) >=0;
						   				console.log(q);

						   				if(lowerIndexQ !== true){
						   					q.setMap(map);
						   					console.log(q);
						   				}
						   			}
					   			}
					   		};
					   		var addList = function() {
							    var list = self.placeList()[0].title();
							    var itemTitle = item.title();

							    if(lowerIndex === true){
							       	if(list !== itemTitle){
							       		if(self.placeList().length<5){
							       		self.placeList.push(item);
							       		};
							    	}
							    }						       
						   	}
						if(e.keyCode == 8){	
					    	addMark();
					    	addList();
						}	   
						}

					});
			};
			addBack();
			});
		});

	



	

		this.setPlace = function(clickedPlace) {
			self.currentPlace(clickedPlace);

	//		console.log(clickedPlace.address());

			var curMark = self.currentPlace().marker()[0];

		//	console.log(curMark.address);
			var len = initialPlaces.length;
		//	console.log(len);
			
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

//census api 








