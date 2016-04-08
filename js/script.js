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





	// var places = ko.observable(places);

function initMap() {

	var image = 'img/marker-blue.png';
	var myLatLng = {lat: 40.220391, lng: -74.012082};

	var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
          center: myLatLng,
          scrollwheel: false,
          zoom: 15
        });  

	    for(i in places()){
	    //	console.log([i]);
	//    	infowindow = infowindow[i];
		//	console.log(places());
	//		console.log(places());
	    	var place = places()[i];
	  //  	console.log(place);
	    	var pos = place.position;
	    	var src = place.src;
	    	var nums = place.nums;
	    	var infoContent = 
	    	'<div id="content">' +
		        '<h4>' + place.title + '</h4>' +
		        '<h5>' + place.address + '</h5>' +
		        '<img class="markerImg" src=' + place.src +'>' +
		      '</div>';
			var marker = new google.maps.Marker({
				position: pos,
				map: map,
				animation: google.maps.Animation.DROP,
				infowindow: new google.maps.InfoWindow({
					content: infoContent
				})
			}); 


			
			marker.addListener('click', function() {
		    	console.log('CLIQUED');
		    	this.infowindow.open(map, this);


		  });

		}

};

//console.log(initialPlaces[0].marker);



	var Marker = function(data) {
		this.position = ko.observable(data.position);
		this.title = ko.observable(data.title);
		this.map = ko.observable(data.map);
		this.address = ko.observable(data.address);
		//this.animation = google.maps.Animation.DROP;
		this.infowindow = ko.observable(data.infowindow);
		this.marker = ko.observable(data.marker);
		this.visible = ko.observable(data.visible);

/*
		function drop() {
		    addMarkerWithTimeout(data.position, data.nums * 300);
		}
		drop();




		var markers;
		console.log(data.marker);

		  function addMarkerWithTimeout(position, timeout) {
	  		window.setTimeout(function() {
	  		var markerPushed = data.marker.push(
			markers = new google.maps.Marker({
				position: data.position,
				title: data.title,
				address: data.address,
				src: data.src,
				setMap: map,
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
					  //  stuff: map, marker
					})

			}), timeout);
	
	  		
				});	
					}
};			

			
	  		/*var markerPushed = data.marker.push(
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

			}));*/


		//	console.log(markers.infowindow.stuff);

		/*	var len = initialPlaces.length;
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

						 
			
		
	}*/
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
	

/*

	var Place = function(data) {
		this.position = ko.observable(data.position);
		this.title = ko.observable(data.title);
		this.map = ko.observable(data.map);
		this.address = ko.observable(data.address);
		this.animation = google.maps.Animation.DROP;
		this.infowindow = ko.observable(data.infowindow);
		this.marker = ko.observable(data.marker);


	};	
*/
	
	var viewModel = {
		self: this, 
		placeList: ko.observableArray([]),
	//	currentPlace: ko.observable( self.placeList()[0]),
		spot: ko.observableArray(places),
		query: ko.observable('')

	};
 var places = ko.observableArray([ 
 		{
			position: {lat: 40.216147, lng: -74.012914},
			title: 'Johnny Mac House of Spirits',
			address: '208 Main St, Asbury Park, NJ 07712',
			src: 'img/macs.jpg',
			nums: 1,
			icon: null,
			marker: [],
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
	]);
	/*var initPlaces = function() {
			places.forEach(function(placeItem){
				viewModel.placeList.push( new Marker(placeItem) )
			}); 
		};

	initPlaces();*/



	ko.applyBindings(viewModel);

//apis to check out
//instagram api
//yelp api
//census api

//census api 








