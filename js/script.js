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
var makeMark = function() {

      for(i in places()) {
        var positions = places()[i];
        var pos = positions.position;
        var src = positions.src;
        var nums = positions.nums;
        var infoContent = {
          contents: 
            '<div id="content">' +
                '<h4>' + positions.title + '</h4>' +
                '<h5>' + positions.address + '</h5>' +
                '<img class="markerImg" src=' + positions.src +'>' +
              '</div>'  
      };
      console.log();

     // positions.marker.push(new google.maps.Marker());
      console.log(positions.marker);
      console.log(positions.title);
 //     var marker = positions.marker[0];
  //    marker.setMap(map);
  };
};

var madeMark = {
	//create a JSON, maybe you can access it/fool around with it?
	//if possible, create the marker within the 'places' JSON
	//that way you can use setMap: null at some point
	//mess with making makeMark() an observable/obs array
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
     	for(p in places()){ 
     		console.log([p]);
      		console.log(places()[p].marker);
  		


		  console.log(places()[p].markOpts);
		  var markOptsTest = places()[p].markOpts
		  var marker = new google.maps.Marker(markOptsTest);
		  marker.setMap(map);
		}
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
		setMap: map
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
	marks: makeMark,
	searched: searched(),
	query: ko.observable('')
};
	//console.log(places()[0].marker.map);
/* *************************
			var mapSet = places()[0].marker;
			mapSet.setMap(null)
			console.log(mapSet);
		
			mapSet.setMap();
			mapSet.setMap(map);
		 ************************* */

//console.log(viewModel.place()[0].marker);
var test = viewModel.place();
//console.log(test);

viewModel.place = ko.computed(function() {
    var search = this.query().toLowerCase();
  //  console.log(search);
    //console.log(self.marker);
    //marker.setMap(null);
  //  console.log(places,'Good');

    return ko.utils.arrayFilter(places(), function(spot) {
 //   	console.log(spot.title.toLowerCase());
   // 	console.log(spot);
        return spot.title.toLowerCase().indexOf(search) >= 0;
    });
}, viewModel);

//console.log(viewModel.place);
//console.log(viewModel.marks);


/*    return ko.utils.arrayFilter(makeMark, function(stuff) {
    	console.log(stuff);
    });*/


ko.applyBindings(viewModel);