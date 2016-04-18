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
var Take = function Take(data, name){
      this.num = data.nums;

      this.href = data.href;
      this.title = data.title;

      this.id = data.id;
      this.name = ko.observable(name);


    var listText = '<a onClick="myClick' + this.num + '"><li class="noBullet" id="'+
    this.id + '">' + this.title + '</li></a> ||'
	
	$('#listUL').append(listText);


   // console.log(noClue);
  var pony = document.getElementById('pony');


   };

var Pin = function Pin(map, position, name, address, src) {
  var markers;
  var infowindow;
  var image = 'img/marker-blue.png';


  this.name = ko.observable(name);
  this.position  = ko.observable(position);
  this.address = ko.observable(address);



 // this.lon  = ko.observable(lon);
  //this.text = ko.observable(text);
	var contentString = 
		'<div id="content">'+
	      	'<h4>'+name+'</h4>'+
	     	'<h5>'+address+'</h5>'+
	      	'<img class="markerImg" src='+src+'>'+
	    '</div>';
	    var markers;
//	    console.log(places().marker);
	    places()[0].marker.push(
 		 markers = new google.maps.Marker({
		    position: position,
		    animation: google.maps.Animation.DROP,
		    infoWindow: new google.maps.InfoWindow({
		    	content: contentString
		    })
  		}));



	//google.maps.event.trigger(clickPin(), click);


	function clickPin(){
			var mark = places()[0].marker;
			for(i in places()){
			//	console.log(i);
//				console.log(mark[i]);
			mark[i].setIcon(null);
			mark[i].infoWindow.close(map, markers);
		}
			if(markers.icon == null)
		
			{
				markers.setIcon(image);
				markers.infoWindow.open(map, markers);
				markers.setAnimation(google.maps.Animation.BOUNCE);
				timeoutID = window.setTimeout(stopBouncing, 2200);
				function stopBouncing() {
					markers.setAnimation(null);
				};

			}
			else 
			{
				markers.setIcon(null);
				markers.infoWindow.close(map, markers);
				markers.setAnimation(null);
			}
	}
	markers.addListener('click', function() {
		clickPin();
	});
	//if a href is clicked, run clickPin();

	//$('#mac').click(function(){
	//	clickPin();
	//})

  this.isVisible = ko.observable(false);

  this.isVisible.subscribe(function(currentState) {
    if (currentState) {
      markers.setMap(map);
  //    console.log(markers);
    } else {
      markers.setMap(null);
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
	  	
			self.pins = ko.observableArray([]);
			places().forEach(function(placeItem){
				self.pins.push( new Pin(map, placeItem.position, 
					placeItem.title, placeItem.address, placeItem.src));
	//			console.log(placeItem);
			})

   			//self.currentPlace = ko.observable(self.pins());
   		//	var clicked = ko.observable(self.currentPlace());
			self.takers = ko.observableArray([]);
      		places().forEach(function(listClick){
		        var listTitle = listClick.title;
		        self.takers.push( new Take(listClick, listTitle));
	//	        console.log(listTitle);

      		});



	  	self.filterPins = ko.computed(function() {
	  	  	var search = viewModel.query().toLowerCase();
	 // 	  	console.log(search);

	  	  	return ko.utils.arrayFilter(self.pins(), function(pin){
	 // 	  		console.log(pin);
	  	  		var doesMatch = pin.name().toLowerCase().indexOf(search) >= 0;
	  	  		pin.isVisible(doesMatch);

	  	  	//	return doesMatch;
	  	  	});

	  	});

		self.filterList = ko.computed(function() {
			var search = viewModel.query().toLowerCase();
			console.log(search);
	//		console.log(self.takers());

	    	return ko.utils.arrayFilter(self.takers(), function(spot) {
	    		
	//    		console.log(takers());
	    		var doesMatch = spot.title.toLowerCase().indexOf(search) >= 0;
	 //   		console.log(doesMatch);
	    	//	console.log(spot.title);
	    		//spot.isVisible(doesMatch);
	    		var elemID = document.getElementById(spot.id);
	    		console.log(elemID);
	    		if(doesMatch === true){
	    			console.log(spot.title, 'true')
	    			console.log(elemID);
	    			elemID.style.visibility='visible';
	    		} else {
	    			console.log(spot.title, 'false')
	    			elemID.style.visibility='hidden';
	    		}


	    		//return doesMatch;


    		});       
		});

};




var places = ko.observableArray([ 
	{
		position: {lat: 40.216147, lng: -74.012914},
		title: 'Johnny Mac House of Spirits',
		address: '208 Main St, Asbury Park, NJ 07712',
		src: 'img/macs.jpg',
		nums: '(0)',
		icon: null,
		marker: marker = [],
		markOpts: {
	        position: {lat: 40.216147, lng: -74.012914},
	 //       animation: google.maps.Animation.DROP,
	 //       content: infoContent.contents,
	        icon: null

	      },
		href: 'http://www.johnnymacbar.com/',
		id: 'mac',
		visible: true,
	}, {
		position: {lat: 40.220001, lng: -74.000947},
		title: 'The Stone Pony',
		address: '913 Ocean Ave, Asbury Park, NJ 07712',
		src: 'img/pony.jpg',
		nums: '(1)',
		icon: null,
		marker: marker = [],
		markOpts: {
	        position: {lat: 40.220001, lng: -74.000947},
	 //       animation: google.maps.Animation.DROP,
	 //       content: infoContent.contents,
	        icon: null
	      },
		href: 'http://stoneponyonline.com/',
		id: 'pony',
		visible: true
	}, {
		position: {lat: 40.220239, lng: -74.002344},
		title: 'Porta Pizza/Wine Bar',
		address: '911 Kingsley St, Asbury Park, NJ 07712',
		src: 'img/porta.jpg',
		nums: '(2)',
		icon: null,
		marker: marker = [],
		markOpts: {
	        position: {lat: 40.220239, lng: -74.002344},
	 //       animation: google.maps.Animation.DROP,
	 //       content: infoContent.contents,
	        icon: null
	      },
		href: 'http://pizzaporta.com/ASBURY-PARK',
		id: 'porta',
		visible: true
	}, {
		position: {lat: 40.2207, lng: -73.999884},
		title: 'Silverball Museum',
		address: '1000 Ocean Ave, Asbury Park, NJ 07712',
		src: 'img/silverball.jpg',
		nums: '(3)',
		icon: null,
		marker: marker = [],
		markOpts: {
	        position: {lat: 40.2207, lng: -73.999884},
	 //       animation: google.maps.Animation.DROP,
	 //       content: infoContent.contents,
	        icon: null
	      },
		href: 'http://silverballmuseum.com/',
		id: 'silver',
		visible: true
	}, {
		position: {lat: 40.223796, lng: -73.998585},
		title: 'Convention Hall',
		address: '1300 Ocean Ave, Asbury Park, NJ 07712',
		src: 'img/hall.jpg',
		nums: '(4)',
		icon: null,
		marker: marker = [],
		markOpts: {
	        position: {lat: 40.223796, lng: -73.998585},
	 //       animation: google.maps.Animation.DROP,
	 //       content: infoContent.contents,
	        icon: null
	      },
		href: 'https://en.wikipedia.org/wiki/Asbury_Park_Convention_Hall',
		id: 'hall',
		visible: true
	}		      
]);

//console.log(places()[0].marker)
//console.log(viewModel.place()[0].marker)
var tried = places()[0].marker;


var listView = function() {


};




    function myClick(id){
        google.maps.event.trigger(tried[id], 'click');
    };

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
	//listView: listView(),
	query: ko.observable('')
};


//console.log(viewModel.place()[0].marker);
var test = viewModel.place();
//console.log(test);
//console.log(viewModel.place()[0].markOpts);



var currentSpot;




	 /*   var markers;
//	    console.log(places().marker);
	    places()[0].marker.push(
 		 markers = new google.maps.Marker({
		    position: position,
		    animation: google.maps.Animation.DROP,
		    infoWindow: new google.maps.InfoWindow({
		    	content: contentString
		    })
  		}));*/

/*
var Pin = function Pin(map, position, name, address, src) {
  var markers;
  var infowindow;
  var image = 'img/marker-blue.png';


  this.name = ko.observable(name);
  this.position  = ko.observable(position);
  this.address = ko.observable(address);*/




ko.applyBindings(viewModel);