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

/*var Marker = function(data) {
	this.position = ko.observable(data.position);
//	console.log(data);
	this.title = ko.observable(data.title);
	this.map = ko.observable(data.map);
	this.address = ko.observable(data.address);
//	this.animation = google.maps.Animation.DROP;
	this.infowindow = ko.observable(data.infowindow);
	this.markOpts = ko.observable(data.markOpts);
//	console.log(data.markOpts);

};*/

var Pin = function Pin(map, position, name, address, src) {
  var marker;
  var infowindow;
  var image = 'img/marker-blue.png';


  this.name = ko.observable(name);
  this.position  = ko.observable(position);



 // this.lon  = ko.observable(lon);
  //this.text = ko.observable(text);
	var contentString = 
		'<div id="content">'+
	      	'<h4>'+name+'</h4>'+
	  //   	'<h5>'+address+'</h5>'+
	   //   	'<img class="markerImg" src='+src+'>'+
	    '</div>';
  marker = new google.maps.Marker({
    position: position,
    animation: google.maps.Animation.DROP,
    infoWindow: new google.maps.InfoWindow({
    	content: contentString
    })

  });

google.maps.InfoWindow.prototype.opened = false;
/*var infoWindow = ko.observable(
		new google.maps.InfoWindow({
			content: contentString
		})
	);
var infoArray = [];
infoArray.push(infoWindow());
console.log(infoArray);
console.log(infoWindow());
//console.log(infoWindow());*/
marker.addListener('click', function() {

	if(this.infoWindow.opened){
	   // do something
	   this.infoWindow.close(map, marker);
	   this.infoWindow.opened = false;
	}
	else{
	   // do something else
	   this.infoWindow.open(map, marker);
	   this.infoWindow.opened = true;
	}

	if(marker.icon == null)
	{
		marker.setIcon(image);
		marker.infoWindow.open(map, marker);
		marker.setAnimation(google.maps.Animation.BOUNCE);
		timeoutID = window.setTimeout(stopBouncing, 2200);
		function stopBouncing() {
			marker.setAnimation(null);
		};

	}
	else 
	{
		marker.setIcon(null);
		marker.infoWindow.close(map, marker);
		marker.setAnimation(null);
	}
});

/*marker.addListener('click', function() {
			marker.setIcon(null);
			infoWindow.open(map, marker);
		//	iWind.open(map, marker);
			if(infoWindow.opened){
   				infoWindow.close(map, marker);
		//   		iWind.close(map, marker);
			}
		else{
		   // do something else
		   infoWindow.open(map, marker);
		   infoWindow.opened = true;
		}

		});*/

//pop the clicked; make an array holding the last clicked infowindow
//and then pop() it




  this.isVisible = ko.observable(false);

  this.isVisible.subscribe(function(currentState) {
    if (currentState) {
      marker.setMap(map);
    } else {
      marker.setMap(null);
    }
  });

  this.isVisible(true);



}

var map;
function initMap() {
      var icon = 'img/marker-blue.png';
      var myLatLng = {lat: 40.220391, lng: -74.012082};
      var mapDiv = document.getElementById('map');
      var mapOptions = {
            center: myLatLng,
            scrollwheel: false,
            zoom: 15
      };
      map = new google.maps.Map(mapDiv, mapOptions);
	  
      	places().forEach(function(markerItem){
			var markOptsItem = markerItem.markOpts;
			var markLatLng = markerItem.position;
			var markName = markerItem.title
		});
			
			self.pins = ko.observableArray([
				new Pin(map, {lat: 40.216147, lng: -74.012914}, 'Johnny Mac House of Spirits', 
					'208 Main St, Asbury Park, NJ 07712', 'img/macs.jpg'),
				new Pin(map, {lat: 40.220001, lng: -74.000947}, 'The Stone Pony', 
					'913 Ocean Ave, Asbury Park, NJ 07712', 'img/pony.jpg'),
				new Pin(map, {lat: 40.220239, lng: -74.002344}, 'Porta Pizza/Wine Bar',
					'911 Kingsley St, Asbury Park, NJ 07712', 'img/porta.jpg'),
				new Pin(map, {lat: 40.2207, lng: -73.999884}, 'Silverball Museum', 
					'1000 Ocean Ave, Asbury Park, NJ 07712', 'img/silverball.jpg'),
				new Pin(map, {lat: 40.223796, lng: -73.998585}, 'Convention Hall',
					'1300 Ocean Ave, Asbury Park, NJ 07712', 'img/hall.jpg'),
				]);


//  	console.log(viewModel.query());


	  	self.filterPins = ko.computed(function() {
	  	  	var search = viewModel.query().toLowerCase();
	  	  	console.log(search);

	  	  	return ko.utils.arrayFilter(self.pins(), function(pin){
	  	  		var doesMatch = pin.name().toLowerCase().indexOf(search) >= 0;
	  	  		pin.isVisible(doesMatch);

	  	  		return doesMatch;
	  	  	});

	  	});
};



var places = ko.observableArray([ 
	{
		position: {lat: 40.216147, lng: -74.012914},
		title: 'Johnny Mac House of Spirits',
		address: '208 Main St, Asbury Park, NJ 07712',
		src: 'img/macs.jpg',
		nums: 1,
		icon: null,
		marker: marker = [],
		markOpts: {
	        position: {lat: 40.216147, lng: -74.012914},
	 //       animation: google.maps.Animation.DROP,
	 //       content: infoContent.contents,
	        icon: null

	      },
		href: 'http://www.johnnymacbar.com/',
		visible: true,
	}, {
		position: {lat: 40.220001, lng: -74.000947},
		title: 'The Stone Pony',
		address: '913 Ocean Ave, Asbury Park, NJ 07712',
		src: 'img/pony.jpg',
		nums: 2,
		icon: null,
		marker: marker = [],
		markOpts: {
	        position: {lat: 40.220001, lng: -74.000947},
	 //       animation: google.maps.Animation.DROP,
	 //       content: infoContent.contents,
	        icon: null
	      },
		href: 'http://stoneponyonline.com/',
		visible: true
	}, {
		position: {lat: 40.220239, lng: -74.002344},
		title: 'Porta Pizza/Wine Bar',
		address: '911 Kingsley St, Asbury Park, NJ 07712',
		src: 'img/porta.jpg',
		nums: 3,
		icon: null,
		marker: marker = [],
		markOpts: {
	        position: {lat: 40.220239, lng: -74.002344},
	 //       animation: google.maps.Animation.DROP,
	 //       content: infoContent.contents,
	        icon: null
	      },
		href: 'http://pizzaporta.com/ASBURY-PARK',
		visible: true
	}, {
		position: {lat: 40.2207, lng: -73.999884},
		title: 'Silverball Museum',
		address: '1000 Ocean Ave, Asbury Park, NJ 07712',
		src: 'img/silverball.jpg',
		nums: 4,
		icon: null,
		marker: marker = [],
		markOpts: {
	        position: {lat: 40.2207, lng: -73.999884},
	 //       animation: google.maps.Animation.DROP,
	 //       content: infoContent.contents,
	        icon: null
	      },
		href: 'http://silverballmuseum.com/',
		visible: true
	}, {
		position: {lat: 40.223796, lng: -73.998585},
		title: 'Convention Hall',
		address: '1300 Ocean Ave, Asbury Park, NJ 07712',
		src: 'img/hall.jpg',
		nums: 5,
		icon: null,
		marker: marker = [],
		markOpts: {
	        position: {lat: 40.223796, lng: -73.998585},
	 //       animation: google.maps.Animation.DROP,
	 //       content: infoContent.contents,
	        icon: null
	      },
		href: 'https://en.wikipedia.org/wiki/Asbury_Park_Convention_Hall',
		visible: true
	}		      
]);



function searched() {
	$(document).ready(function(){
	    $('#spot').keypress(function(e){
	      if(e.keyCode==13)
	      $('#button').click();
	    });
	});

	var places = [];
	var placeInput  = document.getElementById("spot");
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
};




var viewModel = {
	self: this, 

	initMap: initMap,
	place: ko.observable(places()),
//	points: point(),
	searched: searched(),
	query: ko.observable('')
};

//console.log(viewModel.place()[0].marker);
var test = viewModel.place();
//console.log(test);
//console.log(viewModel.place()[0].markOpts);





viewModel.place = ko.computed(function() {
    var search = this.query().toLowerCase();
	    return ko.utils.arrayFilter(places(), function(spot) {
	    	var doesMatch = spot.title.toLowerCase().indexOf(search) >= 0;

	    	if(doesMatch === false){	    		
	    		console.log(spot.title, 'false');
	    	}

	        return doesMatch;

    });       
}, viewModel);


function markSearch() {
	var markTest = ko.computed(function() {
		var search = viewModel.query().toLowerCase();
		console.log(search);
		return ko.utils.arrayFilter(newMark(), function(stuff) {

		});
		//console.log(markerList());
			//var doesMatch = spot.title.toLowerCase().indexOf(search) >= 0;
			//return doesMatch;
		
	}, viewModel);
};
/*
var filterPins = ko.computed(function () {
    var search  = viewModel.query().toLowerCase();
    return ko.utils.arrayFilter(self.pins(), function (pin) {
        var doesMatch = pin..toLowerCase().indexOf(search) >= 0;
        pin.isVisible(doesMatch);
        return doesMatch;
    });
});
$( "#spot" ).keypress(function() {
	//write a function clear newMark();
	//newMark = null;
	//markSearch();
});*/




///something worth playing with below

/*markerList = ko.computed(function() {
    var search = this.query().toLowerCase();
     
}, viewModel);*/
/*
viewModel.Marker = ko.computed(function() {
	var search = this.query().toLowerCase();
	return ko.utils.arrayFilter(...)
})
	    	/*if(doesMatch !== false){
	    		var stuff = spot.markOpts.position = null;
	    		console.log(spot.title, 'false');
	//    		places()[0].setMap(map);
	    	}*/



	/*places().forEach(function(markerItem){
		markerList.push( new Marker(markerItem) );
		console.log(markerItem);
		var markOptsItem = markerItem.markOpts;
//		console.log(markOptsItem);
		var marker = new google.maps.Marker(markOptsItem);
		marker.setMap(map);
		marker.setAnimation(google.maps.Animation.DROP);
		marker.setVisible(true);
	})*/
 


//console.log(viewModel.place);
//console.log(viewModel.marks);


/*    return ko.utils.arrayFilter(makeMark, function(stuff) {
    	console.log(stuff);
    });*/


ko.applyBindings(viewModel);