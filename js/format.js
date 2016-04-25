
var map;
var filter = ko.observable('');

var model = {
	currentPlace: null,
	currentMarker: null,
	socrataInfo: [],
	kram: [],
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
            nums: '0',
          //  icon: null,
            marker: marker = [],
            notes: [],
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
            nums: '1',
           // icon: null,
            marker: marker = [],
            notes: [],          
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
            nums: '2',
          //  icon: null,
            marker: marker = [],
            notes: [], 
            infoWindow: infoWindow = [],
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
            nums: '3',
         //   icon: null,
            marker: marker = [],
            notes: [], 
            infoWindow: infoWindow = [],
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
            nums: '4',
        //    icon: null,
            marker: marker = [],
            notes: [], 
            infoWindow: infoWindow = [],
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
    ],
};

var viewModel = {

	init: function() {
		model.currentPlace = model.places[0];
		model.currentMarker = model.kram[0];
		socrataView.init();
	//	jamBaseView.init();
		listView.init();
		markView.init();
		searchedView.init();
		filterList.init();
		

	},

	getCurrentPlace: function() {
		return model.currentPlace;
		
	},

	getCurrentMarker: function() {
		return model.currentMarker;
	},

	getPlaces: function() {
		return model.places;
	},

	getMarkers: function() {
		return model.kram;	
	},

	setCurrentPlace: function(mark) {
		model.currentPlace = mark;
		
	},

	setCurrentMarker: function(pinned) {
		model.currentMarker = pinned;
	},

	query: ko.observable('')
}


var socrataView = {
	
	init: function() {
		var text, dataLabel, i;

		this.socrataElem = document.getElementById('socrata-header');
		this.socrataURL = 'https://odn.data.socrata.com/resource/uf4m-5u8r.json?' +
        'id=1600000US3401960';
        this.socrataUL = document.getElementById('socrata-info');
        this.socrataLI = document.getElementById('socrata-item');
        this.socrataInfo = model.socrataInfo;

        this.render();
    },

    render: function() {
    	var self=this;

		text = 'You were supposed to see some awesome census data ' +
	            'about Asbury Park, NJ, but the request failed. And its all. my.' +
	            ' fault. Im sorry to let you down.';

    	this.socrataTimeout = setTimeout(function() {
        	$('#socrata-header').append(text);
        }, 3000);
    	
        $.ajax({
        	url: this.socrataURL,
        	dataType: 'json',
        	success: function(response) {
      //  		console.log(response);
        		var infos = response;
  
        			var info = infos[0];
        		//	console.log(info);

        	//		console.log(self.socrataLI);
        		


        			self.socrataInfo.push(
        				{'Year': info.year, 
        				 'Associates': info.percent_associates_degree,
        				 'Bachelors': info.percent_bachelors_degree, 
        				 'HSGrad': info.percent_high_school_graduate
        				 }
        			);
        	//		console.log(self.socrataInfo[0]);
        	var census = self.socrataInfo[0];

        	var elem;
        	elem = document.createElement('li');
        	elem.className = 'info';
            elem.textContent = 'Asbury Park, NJ Census Facts Courtesy Socrata Open Data || ' +
            				   'Year: ' + census.Year + ' || ' +
            				   'Bachelors Degree: ' + census.Bachelors + '% || ' +
            				   'Associates Degree: ' + census.Associates + '% || ' +
            				   'High School Grad: ' + census.HSGrad + '%';

            self.socrataElem.appendChild(elem);
		        
		        clearTimeout(self.socrataTimeout);
        	}
        });
		$("#socrata-data").click(function() {
		    $(".info").toggle("slow", function() {});
		});
	}
};

var jamBaseView = {

	init: function() {
		var text;
		this.jamBaseElem = $('#jamBase-header');
		this.jamBaseURL = 'http://api.jambase.com/events?zipCode=07712' +
        '&radius=5&page=0&api_key=u34rze74n8752gcq7nt3bzn3';
  		this.slideOut = $('.slideout-menu-toggle')

	    this.render();
	},

	render: function() {
		var self = this;

		text = 'This was supposed to show a bunch of information ' +
	            'about concerts in the area, and the request failed. Im so, so sorry. ' +
	            'So instead, here is a picture of a microphone, which should make up for' +
	            ' it. Right?';

        this.jamBaseTimeout = setTimeout(function() {
        	var mic = '</br><img src="img/microphone.jpg" id="mic">';
    		$('#jamBase-header').append(text).append(mic);

	    }, 3000);

		$.ajax({
	    	url: self.jamBaseURL,
	    	dataType: "json",
	    	success: function(response) {
	    		var infos = response;
	    		//var info = infos[0]
	    		console.log(infos.Events.length);

	    		//jamBase requires this logo be present on sites where
	    		//their info is used
	    		var logoAttr = '<a href="http://www.JamBase.com"' +
	    			'target="_blank" title="JamBase Concert Search" id="tixImg">' +
	    			'<img src= "http://images.jambase.com/logos/jambase140x70.gif"' +
	    			'alt="Search JamBase Concerts" border="0" /></a>'
	    		self.jamBaseElem.text('Live Music in Asbury Park');
	    		self.jamBaseElem.append(logoAttr);
	    		//var infos = response.Events;
	    		var top = '</br><h3 id="jamHead">*Note: If tickets are not available online, you' +
	    			'will be directed back to this website</h7>';
	    		self.jamBaseElem.append(top);
	    		//self.jamBaseElem.prepend(close);

	    		//iterates through the info in the JSON so that it can be
	    		//formatted with the below code
	    		console.log('hey');
	    		///////////////PROBLEM INFOS DOESNT GET DEFINED///////
	    		for(i=0;i<infos.Events.length;i++){
	    			
	    			var info = infos.Events[i];
	    			console.log(info);
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
	    					self.jamBaseElem.append(jamBaseStuff);
	    				}
	    		};
	    		clearTimeout(jamBaseTimeout);
	    	}
	    });
		$(document).ready(function() {
			$('.slideout-menu-toggle').on('click', function(event) {
				event.preventDefault();

				var jamBaseElemWidth = $('#jamBase-header').width();

				$('#jamBase-header').toggleClass('open');

				if($('#jamBase-header').hasClass('open')) {
					$('#jamBase-header').animate({
						right: '0px'
					});
				} else {
					$('#jamBase-header').animate({
						right: -jamBaseElemWidth
					}, 250);
				}
			});
		})
	}
};

var markView = {

    init: function() {
        this.markElem = document.getElementById('mark');
        this.markNameElem = document.getElementById('mark-name');
        this.markAddElem = document.getElementById('mark-address');
        this.markImageElem = document.getElementById('mark-img');
        this.countElem = document.getElementById('mark-count');

        this.render();
    },

    render: function() {
        var currentPlace = viewModel.getCurrentPlace();
        var currentMarker = viewModel.getCurrentMarker();

        this.markNameElem.textContent = currentPlace.title;
        this.markAddElem.textContent = currentPlace.address;
        this.markImageElem.src = currentPlace.src;
    //    this.markNotedElem.textContent = currentMark.notes;

    }
};


var searchedView = {

	init: function() {
		var that = this;
		
	//	console.log(currentMark);
		this.placeInput = document.getElementById('mark-search');
		this.messageBox = document.getElementById('noted');
		this.br = '</br>';


		//this.ex = '<a href="#">&times;</a>';

		$(document).ready(function() {
			function clicked() {
				$('#mark-search').keypress(function(e) {
					if(e.keyCode == 13) {
						that.render();
					}
				})

			}
			clicked();

		})

	},

	render: function() {

		var self = this;
        this.currentPlace = viewModel.getCurrentPlace();
        this.currentMarker = viewModel.getCurrentMarker();


		$('#noted').show();
		$('#clear').show();

		if(self.placeInput.value !== ''){
			this.currentPlace.notes.push(self.placeInput.value);
		}

//		console.log(currentMark);

		self.placeInput.value = '';
		self.messageBox.innerHTML = '';

		self.messageBox.innerHTML = this.currentPlace.notes
			.join(self.br);

		if(this.currentPlace.notes[0] == ''){
			this.currentPlace.notes.shift();
		}

		$('#clear').click(function() {
	//		console.log('cleared');
			self.currentPlace.notes = [];
			self.messageBox.innerHTML = self.currentPlace.notes;
			$('#noted').hide();
		})

	},
};

var filterList = {
		
		init: function() {
			var self = this;
			var place = model.places;
			var places = ko.observableArray(place);

		//	console.log(places());

			this.tagged = ko.observableArray([]);
			places().forEach(function(placeItem){
				self.tagged.push(placeItem.tag);
				//console.log(self.tagged());
			})
		//	console.log(self.tagged());


		filterList:ko.computed(function() {
		        var search = viewModel.query().toLowerCase();
		       // console.log(search);

		        return ko.utils.arrayFilter(places(), function(placed) {
		//        	console.log(placed.marker);


		        	Array.prototype.contains = function ( searched ) {
		        		for(r in this) {
		        			if(this[r] == searched) return true;
		        		}
		        		return false;
		        	}

		        	var x = placed.tag;
		        	//console.log(x);
		        	var elemID = document.getElementById(placed.id);
		        	//console.log(elemID);
		        	if (x.contains(search)) {
		        	//	console.log(placed.title, 'contained!');
		        		elemID.style.display = 'block';
		        	}
		        	else {
		        	//	console.log(placed.title, 'NOPE');
		        		elemID.style.display = 'none';
		        	}
		        });
		    });

		}
}

var listView = {

	init: function() {
		this.markListElem = document.getElementById('mark-list');

		this.render();

	},

    render: function() {
        var mark, elem, i;
        var places = viewModel.getPlaces();

    	$('#toggleListButton').click(function(){
		    $('.list').slideToggle();
		});


        this.markListElem.innerHTML = '';

        for(i=0; i<places.length; i++){
            mark = places[i];

            elem = document.createElement('li');
            elem.textContent = mark.title;
			elem.setAttribute('id', mark.id);

            elem.addEventListener('click', (function(markCopy) {
 //           	console.log(markCopy);
            	var filter, copyArr;

            	copyArr = ko.observableArray(markCopy.tag);

            	var autofill = ko.computed(function(){
            		var search = viewModel.query().toLowerCase();
            		//console.log(search);
            		var places = model.places;
				    var allTags = places[0].tag
				    	.concat(places[1].tag)
				    	.concat(places[2].tag)
				    	.concat(places[3].tag)
				    	.concat(places[4].tag);
            		
            		return ko.utils.arrayFilter(copyArr(), function(spot) {
	            			var uniqueTags = [];
	            			var x = copyArr();
	            			var elemID = markCopy.id;

					   	$.each(allTags, function(i, el){
						    if($.inArray(el, uniqueTags) === -1) uniqueTags.push(el);
						});	
						//initiates the autocomplete search function, using the
						//uniqueTags array 
				        $( "#searchBar" ).autocomplete({
					      source: uniqueTags
					    });
	            	})
            	});
            	
                return function() {
                	
                    viewModel.setCurrentPlace(markCopy);
                    markView.render();
                    searchedView.render();
                };

            })(mark));

            this.markListElem.appendChild(elem);
        }
    }
};

var pinView = {
	
	init: function(map, position, name, address, src, tag, href, mkImg) {
		var self = this;
		var markers, i, t, infoWindow, data;
		var len = model.places.length;
		var marked = model.places[0].marker;
		var len = marked.length;
		var pinned;
		//console.log(marked);

		
		for(t=0;t<len;t++) {
			data = model.places[t];
	//		console.log(data);
			this.image = data.mkImg;
	//		console.log(data.mkImg);
			this.name = ko.observable(data.name);
			

			this.position = ko.observable(data.position);
			this.address = ko.observable(data.address);
			this.tag = ko.observable(data.tag);
			this.href = ko.observable(data.href);
	//		console.log(this.tag);
		}

		this.render();
	},

	render: function() {
	//	console.log(self.tag);
		
		var i, t, data, contentString, elem;
		var len = model.places.length;
		var marked = model.places[0].marker;
    	var markLen = marked.length;

		for(t=0;t<len;t++){
			data = model.places[t];

		    model.kram.push(
		    	new google.maps.Marker({
		    		title: data.title,
		    		src: data.src,
		    		address: data.address,
			    	position: data.position,
			    	map: map,
			    	image: data.mkImg,
			    	animation: google.maps.Animation.DROP,
			    	icon: null,
			    	id: data.id
			    })
		    );
		};
		animateView.init();
	}
}

var animateView = {

	init: function() {
		var self = this;
		this.markElem = document.getElementById('mark');
		this.markNameElem = document.getElementById('mark-name');
        this.markAddElem = document.getElementById('mark-address');
        this.markImageElem = document.getElementById('mark-img');
        console.log(this.markElem);


	    var markAnimate = model.kram;
	    var modelPlace = model.places;

		for(w=0;w<model.kram.length;w++){
			

			var eachPlace = document.getElementById(modelPlace[w].id);

			markAnimate[w].addListener('click', function(pinCopy) {
				

				for(n=0;n<markAnimate.length;n++){

					var that = this;
			//	
					var icon = markAnimate[n].icon;
					markAnimate[n].setIcon(null);
					console.log(this);
					
						self.markNameElem.textContent = this.title;
				        self.markAddElem.textContent = this.address;
				        self.markImageElem.src = this.src;

			//		console.log(markAnimate[n]);
					if(icon === null){

						this.setIcon(this.image);
						this.setAnimation(google.maps.Animation.BOUNCE);
			            timeoutID = window.setTimeout(stopBouncing, 2300);

			            function stopBouncing() {
			                that.setAnimation(null);
			            };
					}

				}
				$('.list').show('slow', function(){});
			})



			$(eachPlace).click(function(){

				var curr = viewModel.getCurrentPlace();
				
				for(var g=0;g<model.kram.length;g++){

					var skram = markAnimate[g].id;
					var icon = markAnimate[g].icon;
					var ecalp = curr.id;
					var pic = curr.mkImg;
					markAnimate[g].setIcon(null);
					if(ecalp === skram){

						var that = markAnimate[g];
						if(icon === null){
							that.setAnimation(google.maps.Animation.BOUNCE);		
							timeoutID = window.setTimeout(function(){
								that.setAnimation(null);
							}, 2300);

							that.setIcon(pic);
						}

					}
				}
			})




		};		
	}
			
}
animateView.init();

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


ko.applyBindings(viewModel);







