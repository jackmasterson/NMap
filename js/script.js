//an API using the Open Data Network that allows for any kind of census data
//compiled in recent years to be made available
//used here mostly for education information from the most recent available
//year, 2013
function socrataData() {
    var $socrataElem = $('#socrata-header');
    var socrataURL = 'https://odn.data.socrata.com/resource/uf4m-5u8r.json?' +
        'id=1600000US3401960';

    //what you see if the info fails to load
    var socrataTimeout = setTimeout(function() {
        $socrataElem.text('You were supposed to see some awesome census data ' +
            'about Asbury Park, NJ, but the request failed. And its all. my.' +
            ' fault. Im sorry to let you down.');
    }, 1000);

    $.ajax({
        url: socrataURL,
        dataType: "json",
        success: function(response) {
            var infos = response;
            for (var i = 0; i < infos.length; i++) {
                var info = infos[i];

                //formatting for the given info
                $socrataElem.prepend('<ul class="info">Asbury Park, NJ Census Facts | ' +
                    '<li id="infoHead"> Year: ' + info.year + ' | </li> ' +
                    '<li id="infoHead"> Population: ' + info.population + ' | </li> ' +
                    '<li id="infoHead"> High School Graduation Rate: ' +
                    info.percent_high_school_graduate + '% | </li> ' +
                    '<li id="infoHead"> Bachelors Degree: ' +
                    info.percent_bachelors_degree + '% | </li> ' +
                    '<li id="infoHead"> Associates Degree: ' +
                    info.percent_associates_degree + '% | </li> ' +
                    '<li id="infoHead"> Information Courtesy Socrata Open Data Network | </li> ' +
                    '</ul>')
            }
            clearTimeout(socrataTimeout);
        }
    });

};



//an API designed to give the upcoming live music events in a given area,
//in this case Asbury Park; provides tickets, dates, venue, band, etc
function jamBase() {

    var $jamBaseElem = $('#jamBase-header');
    var jamBaseURL = 'http://api.jambase.com/events?zipCode=07712' +
        '&radius=5&page=0&api_key=u34rze74n8752gcq7nt3bzn3';

    //what pops up after a failed ajax request
    var jamBaseTimeout = setTimeout(function() {
        $jamBaseElem.text('This was supposed to show a bunch of information ' +
            'about concerts in the area, and the request failed. Im so, so sorry. ' +
            'So instead, here is a picture of a microphone, which should make up for' +
            ' it. Right?');
        var mic = '</br><img src="img/microphone.jpg" id="mic">';
        $jamBaseElem.append(mic);
    }, 5000);

   /*$.ajax({
    	url: jamBaseURL,
    	dataType: "json",
    	success: function(response) {

    		//jamBase requires this logo be present on sites where
    		//their info is used
    		var logoAttr = '<a href="http://www.JamBase.com"' +
    			'target="_blank" title="JamBase Concert Search" id="tixImg">' +
    			'<img src= "http://images.jambase.com/logos/jambase140x70.gif"' +
    			'alt="Search JamBase Concerts" border="0" /></a>'
    		$jamBaseElem.text('Live Music in Asbury Park');
    		$jamBaseElem.append(logoAttr);
    		var infos = response.Events;
    		var top = '</br><h3 id="jamHead">*Note: If tickets are not available online, you' +
    			'will be directed back to this website</h7>';
    		$jamBaseElem.append(top);

    		//iterates through the info in the JSON so that it can be
    		//formatted with the below code
    		for(i=0;i<infos.length;i++){
    			
    			var info = response.Events[i];
    			var artists = info.Artists
    			var date = info.Date;
    			
    			for(t=0;t<artists.length;t++){
    				var artist = info.Artists[t];				
    				var jamBaseStuff = '<ul class="concerts">' +
    					'<li id="concertsHead">Artist: ' + artist.Name + '</li>' +
    					'<li id="concertsHead">Venue: ' + info.Venue.Name + '</li>' +
    					'<li id="concertsHead">Date: ' + date + '</li>' +
    					'<li id="concertsHead"><a target="_blank" href="' + info.TicketUrl +
    						'">Tickets</a></li>' +
    					'</ul>';
    					$jamBaseElem.append(jamBaseStuff);
    				}
    		};
    		clearTimeout(jamBaseTimeout);
    	}
    });*/

    //establishes the slideout menu for the jamBase info
    $(document).ready(function() {
        $('.slideout-menu-toggle').on('click', function(event) {
            event.preventDefault();
            // create menu variables
            var slideoutMenu = $('#jamBase-header');
            var slideoutMenuWidth = $('#jamBase-header').width();

            // toggle open class
            slideoutMenu.toggleClass("open");

            // slide menu
            if (slideoutMenu.hasClass("open")) {
                slideoutMenu.animate({
                    right: "0px"
                });
            } else {
                slideoutMenu.animate({
                    right: -slideoutMenuWidth
                }, 250);
            }
        });
    });
};



//creates the list view but doesn't initiate it yet
var List = function List(data, name) {
    this.num = data.nums;
    this.href = data.href;
    this.title = data.title;
    this.id = data.id;
    this.name = ko.observable(name);

    //this.num makes it so that the list items, when clicked, activate
    //the corresponding marker/infowindow
    var listText = '<a onClick="myClick' + this.num + '"><li class="noBullet" id="' +
        this.id + '">' + this.title + '</li></a>'

    $('#listUL').append(listText);

};

//creates the individual markers but doesn't initiate them yet
var Pin = function Pin(map, position, name, address, src) {
    var markers;
    var infowindow;
    var image = 'img/marker-blue.png';

    this.name = ko.observable(name);
    this.position = ko.observable(position);
    this.address = ko.observable(address);

    //content for the infoWindow
    var contentString =
        '<div id="content">' +
        '<h4>' + name + '</h4>' +
        '<h5>' + address + '</h5>' +
        '<img class="markerImg" src=' + src + '>' +
        '</div>';
    var markers;

    //pushes the markers, when created, into an accessible array
    places()[0].marker.push(
        markers = new google.maps.Marker({
            position: position,
            animation: google.maps.Animation.DROP,
            infoWindow: new google.maps.InfoWindow({
                content: contentString
            })
        }));

    //contains the code for when a pin is clicked; there's animations,
    //icon changes, infoWindow activation, etc
    function clickPin() {
        var mark = places()[0].marker;
        for (i in places()) {
            mark[i].setIcon(null);
            mark[i].infoWindow.close(map, markers);
        }
        if (markers.icon == null)

        {
            markers.setIcon(image);
            markers.infoWindow.open(map, markers);
            markers.setAnimation(google.maps.Animation.BOUNCE);
            timeoutID = window.setTimeout(stopBouncing, 2200);

            function stopBouncing() {
                markers.setAnimation(null);
            };

        } else {
            markers.setIcon(null);
            markers.infoWindow.close(map, markers);
            markers.setAnimation(null);
        }
    }

    //makes it so that the above function will activate when a marker
    //is clicked
    markers.addListener('click', function() {
        clickPin();
    });

    //makes the markers' visibility a parameter contingent on code below,
    //where I use knockout to create a computed function and an 
    //arrayFilter
    this.isVisible = ko.observable(false);

    this.isVisible.subscribe(function(currentState) {
        if (currentState) {
            markers.setMap(map);

        } else {
            markers.setMap(null);
        }
    });

    this.isVisible(true);

}


var map;

//initiates the map
function initMap() {

    //this is the icon the marker changes to when clicked
    var icon = 'img/marker-blue.png';

    //center of the map being called, Asbury Park, NJ
    var myLatLng = {
        lat: 40.220391,
        lng: -74.012082
    };

    var mapDiv = document.getElementById('map');

    //sets the center of the map, makes it unscrollable, sets the
    //zoom level
    var mapOptions = {
        center: myLatLng,
        scrollwheel: false,
        zoom: 15
    };

    //actually creates the map with the above components
    map = new google.maps.Map(mapDiv, mapOptions);

    //where the markers are initiated, pushed into the observable
    //array, self.pins()
    self.pins = ko.observableArray([]);
    places().forEach(function(placeItem) {
        self.pins.push(new Pin(map, placeItem.position,
            placeItem.title, placeItem.address, placeItem.src));

    })

    //initiates the list view items
    self.takers = ko.observableArray([]);
    places().forEach(function(listClick) {
        var listTitle = listClick.title;
        self.takers.push(new List(listClick, listTitle));

    });


    //search function for the pins using knockout's computed functions,
    //arrayFilters, and the isVisible 'subscribe' parameter I created
    //earlier
    self.filterPins = ko.computed(function() {
        var search = viewModel.query().toLowerCase();

        return ko.utils.arrayFilter(self.pins(), function(pin) {
            var doesMatch = pin.name().toLowerCase().indexOf(search) >= 0;
            pin.isVisible(doesMatch);

        });

    });

    //similar search function for the list view items
    self.filterList = ko.computed(function() {
        var search = viewModel.query().toLowerCase();
        console.log(search);

        return ko.utils.arrayFilter(self.takers(), function(spot) {

            var doesMatch = spot.title.toLowerCase().indexOf(search) >= 0;
            var elemID = document.getElementById(spot.id);

            if (doesMatch === true) {
                elemID.style.display = 'block';
            } else {
                elemID.style.display = 'none';
            }

        });
    });

    ///media queries

	var mq = window.matchMedia('@media all and (min-width: 360px)');
	if(mq.matches) {

	} else {

	    map.setZoom(14);
	}

    //toggles the info when the link in the list view is clicked
    //so that it's not too info-oversaturated
    $("#socrata-data").click(function() {
        $(".info").toggle("slow", function() {});
    });

};



//creates the 'places' observable Array, which contains all the needed
//information I'll be using to create the markers, infowindows, list items,
//etc
var places = ko.observableArray([{
    position: {
        lat: 40.216147,
        lng: -74.012914
    },
    title: 'Johnny Mac House of Spirits',
    address: '208 Main St, Asbury Park, NJ 07712',
    src: 'img/macs.jpg',
    nums: '(0)',
    icon: null,
    marker: marker = [],
    markOpts: {
        position: {
            lat: 40.216147,
            lng: -74.012914
        },
        icon: null

    },
    href: 'http://www.johnnymacbar.com/',
    id: 'mac',
    visible: true,
}, {
    position: {
        lat: 40.220001,
        lng: -74.000947
    },
    title: 'The Stone Pony',
    address: '913 Ocean Ave, Asbury Park, NJ 07712',
    src: 'img/pony.jpg',
    nums: '(1)',
    icon: null,
    marker: marker = [],
    markOpts: {
        position: {
            lat: 40.220001,
            lng: -74.000947
        },
        icon: null
    },
    href: 'http://stoneponyonline.com/',
    id: 'pony',
    visible: true
}, {
    position: {
        lat: 40.220239,
        lng: -74.002344
    },
    title: 'Porta Pizza/Wine Bar',
    address: '911 Kingsley St, Asbury Park, NJ 07712',
    src: 'img/porta.jpg',
    nums: '(2)',
    icon: null,
    marker: marker = [],
    markOpts: {
        position: {
            lat: 40.220239,
            lng: -74.002344
        },
        icon: null
    },
    href: 'http://pizzaporta.com/ASBURY-PARK',
    id: 'porta',
    visible: true
}, {
    position: {
        lat: 40.2207,
        lng: -73.999884
    },
    title: 'Silverball Museum',
    address: '1000 Ocean Ave, Asbury Park, NJ 07712',
    src: 'img/silverball.jpg',
    nums: '(3)',
    icon: null,
    marker: marker = [],
    markOpts: {
        position: {
            lat: 40.2207,
            lng: -73.999884
        },
        icon: null
    },
    href: 'http://silverballmuseum.com/',
    id: 'silver',
    visible: true
}, {
    position: {
        lat: 40.223796,
        lng: -73.998585
    },
    title: 'Convention Hall',
    address: '1300 Ocean Ave, Asbury Park, NJ 07712',
    src: 'img/hall.jpg',
    nums: '(4)',
    icon: null,
    marker: marker = [],
    markOpts: {
        position: {
            lat: 40.223796,
            lng: -73.998585
        },
        icon: null
    },
    href: 'https://en.wikipedia.org/wiki/Asbury_Park_Convention_Hall',
    id: 'hall',
    visible: true
}]);


//function to activate the markers when the list items are clicked
function myClick(id) {
    var tried = places()[0].marker;
    google.maps.event.trigger(tried[id], 'click');
};

//function that makes it so when enter or search are clicked,
//it adds the input value to a list of searched items
function searched() {

    $(document).ready(function() {
        $('#spot').keypress(function(e) {
            if (e.keyCode == 13)
                $('#button').click();
        });
    });

    var places = [];
    var placeInput = document.getElementById("spot");
    var messageBox = document.getElementById("display");
    var br = '</br>'

    function insert() {
        places.push(placeInput.value);
        clearAndShow();

    }

    function clearAndShow() {
        placeInput.value = "";
        messageBox.innerHTML = "";
        messageBox.innerHTML = places.join(br);
    }

    $('#button').click(function() {
        insert();
    });

};



var viewModel = {
    self: this,
    socrataData: socrataData(),
    jamBase: jamBase(),
    initMap: initMap,
    place: ko.observable(places()),
    searched: searched(),
    query: ko.observable('')
};

//binds my HTML to knockoutjs info in the viewModel
ko.applyBindings(viewModel);