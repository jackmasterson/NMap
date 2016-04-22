var map;

var model = {
	currentMark: null,
    places: [
        {

            position: {
                lat: 40.216147,
                lng: -74.012914
            },
            query: ko.observable(''),
            title: 'Johnny Mac House of Spirits',
            tag: ['', 'visit', 'bar', 'alcohol', 'beer', 'nightlife', 'night life', 'pizza', 'johnny', 'mac'],
            address: '208 Main St, Asbury Park, NJ 07712',
            src: 'img/macs.jpg',
            mkImg: 'img/beer.png',
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
            query: ko.observable(''),
            title: 'The Stone Pony',
            tag: ['', 'visit', 'music', 'concert', 'live', 'stone', 'pony', 'entertainment'],
            address: '913 Ocean Ave, Asbury Park, NJ 07712',
            src: 'img/pony.jpg',
            mkImg: 'img/music.png',
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
            tag: ['', 'visit', 'bar', 'restaurant', 'pizza', 'nightclub', 'porta', 'wine'],
            address: '911 Kingsley St, Asbury Park, NJ 07712',
            src: 'img/porta.jpg',
            mkImg: 'img/beer.png',
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
            tag: ['', 'visit', 'vacation', 'pinball', 'silverball', 'museum', 'silver'],
            address: '1000 Ocean Ave, Asbury Park, NJ 07712',
            src: 'img/silverball.jpg',
            mkImg: 'img/pinball.png',
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
            tag: ['', 'visit', 'shopping', 'tourist', 'pictures', 'convention', 'hall'],
            address: '1300 Ocean Ave, Asbury Park, NJ 07712',
            src: 'img/hall.jpg',
            mkImg: 'img/shopping.png',
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
        }
    ]
};

var viewModel = {

	init: function() {
		model.currentMark = model.places[0];
		socrataView.init();
		jamBaseView.init();
		listView.init();
	}
}

var socrataView = {
	
	init: function() {
		var text;
		var self = this;
		this.socrataElem = document.getElementById('socrata-header');

		console.log(this.socrataElem);
		this.socrataURL = 'https://odn.data.socrata.com/resource/uf4m-5u8r.json?' +
        'id=1600000US3401960';



        this.render();
    },

    render: function() {
		text = 'You were supposed to see some awesome census data ' +
	            'about Asbury Park, NJ, but the request failed. And its all. my.' +
	            ' fault. Im sorry to let you down.';

    	this.socrataTimeout = setTimeout(function() {
        	$('#socrata-header').append(text);
        }, 3000);

        $.ajax({
        	url: self.socrataURL,
        	dataType: 'json',
        	success: function(response) {

        		var infos = response;
        		for(var i=0; i<infos.length; i++){
        			var info = infos[i];

        			self.socrataElem.prepend('<ul class="info">Asbury Park, NJ Census Facts | ' +
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
		        clearTimeout(self.socrataTimeout);
        	}
        });
	}
};

var jamBaseView = {

	init: function() {
		var self = this;
		this.jamBaseElem = $('#jamBase-header');
		this.jamBaseURL = 'http://api.jambase.com/events?zipCode=07712' +
        '&radius=5&page=0&api_key=u34rze74n8752gcq7nt3bzn3';

  		this.slideOut = $('.slideout-menu-toggle')

        this.jamBaseTimeout = setTimeout(function() {
    	
	        self.jamBaseElem.text('This was supposed to show a bunch of information ' +
	            'about concerts in the area, and the request failed. Im so, so sorry. ' +
	            'So instead, here is a picture of a microphone, which should make up for' +
	            ' it. Right?');
	        var mic = '</br><img src="img/microphone.jpg" id="mic">';
	        self.jamBaseElem.append(mic);

	    }, 3000);

	    this.render();
	},

	render: function() {
		$.ajax({
	    	url: self.jamBaseURL,
	    	dataType: "json",
	    	success: function(response) {

	    		//jamBase requires this logo be present on sites where
	    		//their info is used
	    		var logoAttr = '<a href="http://www.JamBase.com"' +
	    			'target="_blank" title="JamBase Concert Search" id="tixImg">' +
	    			'<img src= "http://images.jambase.com/logos/jambase140x70.gif"' +
	    			'alt="Search JamBase Concerts" border="0" /></a>'
	    		self.jamBaseElem.text('Live Music in Asbury Park');
	    		self.jamBaseElem.append(logoAttr);
	    		var infos = response.Events;
	    		var top = '</br><h3 id="jamHead">*Note: If tickets are not available online, you' +
	    			'will be directed back to this website</h7>';
	    		self.jamBaseElem.append(top);
	    		self.jamBaseElem.prepend(close);

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
	    });
		$(document).ready(function() {
			$('.slideout-menu-toggle').on('click', function(event) {
				event.preventDefault();

				var jamBaseElemWidth = this.jamBaseElem.width();

				this.jamBaseElem.toggleClass('open');

				if(this.jamBaseElem.hasClass('open')) {
					this.jamBaseElem.animate({
						right: '0px'
					});
				} else {
					this.jamBaseElem.animate({
						right: -jamBaseElemWidth
					}, 250);
				}
			});
		})
	}
};

var listView = {

	init: function (data, name, tag) {
		var i;
		var self = this;
		var len = model.places.length;

		for(i=0;i<len;i++){

			data = model.places[i];
			
			this.num = data.nums;
			this.href = data.href;
			this.title = data.title;
			this.id = data.id;
			this.name = ko.observable(name);
			this.tag = ko.observableArray(data.tag);

		};

		this.render();
	},

	render: function() {
		self.listText = '<a onClick="myClick' + this.num + '">' +
    					'<li class="noBullet" id="' +
        				this.id + '">' + this.title + '</li>' +
        			'</a>'

    	$('#listUL').append(listText);
	}
};



var pinView = {
	
	init: function(map, position, name, address, src, tag, href, mkImg) {
		var markers, i, t, infoWindow, data;
		var len = model.places.length;
		var image = mkImg;
		var mark = model.places[0].marker;
		var len = mark.length;
		
		for(t=0;t<len;t++) {
			data = model.places[t];

			this.name = ko.observable(data.name);
			console.log(this.name());

			this.position = ko.observable(position);
			this.address = ko.observable(address);
			this.tag = ko.observable(tag);
			this.href = ko.observable(href);
		}



		this.isVisible = ko.observable(false);

		this.render();
	},

	render: function() {
		var contentString = 'hey';
	    
	    model.places[0].marker.push(
	        markers = new google.maps.Marker({
	            position: self.place.position,
	            animation: google.maps.Animation.DROP,
	            infoWindow: new google.maps.InfoWindow({
	                content: contentString
	            })
	        })
	    );
	    markers.addListener('click', function() {
			clickPin();
		});

	    for(i=0; i<len; i++) {
	    	mark[i].setIcon(null);
	    	mark[i].infoWindow.close(map, markers);
	    }

	    if(markers.icon == null) {
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

	    this.isVisible.subscribe(function(currentState) {
	    	if(currentState) {
	    		markers.setMap(map);
	    	} else {
	    		markers.setMap(null);
	    	}
	    });

	    this.isVisible(true);
	}
}

var initMap = {
	
	init: function() {
		var self = this;
		this.icon = 'img/marker-blue.png';

		this.mapDiv = document.getElementById('map');

		this.mapOptions = {
			center: {lat: 40.220391, lng: -74.012082},
	        scrollwheel: false,
	        zoom: 14
		};

		this.render();	
	},

	render: function() {
		map = new google.maps.Map(this.mapDiv, this.mapOptions);
		pinView.init();
	}
};

viewModel.init();










