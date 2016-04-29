
var map;

//stores all the info I'll use to build the site
var model = {
	currentPlace: null,
	//socrataInfo has all the info for the census open data network info
	socrataInfo: [],
	//jamBaseInfo is where I store the info for the live music API
	jamBaseInfo: ko.observableArray([]),
	//individual marker data gets pushed here (kram is mark backwards and I
		//though I'd be cute)
	surfInfo: ko.observableArray([]),
	kram: [],
	//info for the list view and info div
    places: [
        {
            position: {
                lat: 40.216147,
                lng: -74.012914
            },
            title: 'Johnny Mac House of Spirits',
            tag: ['', 'visit', 'bar', 'alcohol', 'beer', 'nightlife', 'night life', 'pizza', 'johnny', 'mac'],
            address: '208 Main St, Asbury Park, NJ 07712',
            src: 'img/macs.jpg',
            mkImg: 'img/beer.png',
            nums: '0',
            notes: [],
            href: 'http://www.johnnymacbar.com/',
            id: 'mac',
        }, {

            position: {
                lat: 40.220001,
                lng: -74.000947
            },
            title: 'The Stone Pony',
            tag: ['', 'visit', 'music', 'concert', 'live', 'stone', 'pony', 'entertainment'],
            address: '913 Ocean Ave, Asbury Park, NJ 07712',
            src: 'img/pony.jpg',
            mkImg: 'img/music.png',
            nums: '1',
            notes: [],
            href: 'http://stoneponyonline.com/',
            id: 'pony',
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
            notes: [],
            href: 'http://pizzaporta.com/ASBURY-PARK',
            id: 'porta',
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
            notes: [],
            href: 'http://silverballmuseum.com/',
            id: 'silver',
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
            notes: [],
            href: 'https://en.wikipedia.org/wiki/Asbury_Park_Convention_Hall',
            id: 'hall',
            visible: true
        }
    ],
};

var viewModel = {

	init: function() {
		//sets the clicked place to the first one in the array
		model.currentPlace = model.places[0];
		socrataView.init();
		jamBaseView.init();
		surfView.init();
		listView.init();
		markView.init();
		notesView.init();
		filterList.init();
	},
	//returns whichever place is currently active, whichever one
	//has been clicked in the list div (default is the first
		//one, Johnny Mac)
	getCurrentPlace: function() {
		return model.currentPlace;	
	},
	//returns the whole array of info for the places 
	getPlaces: function() {
		return model.places;
	},

	setCurrentPlace: function(mark) {
		model.currentPlace = mark;
		
	},

	query: ko.observable('')
}

//census Open Data Network API courtesy Socrata
//includes a failure timeout for the ajax request
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
        		var infos = response;
        		//I only wanted the most recent information on the site
        		//so I created the 'info' variable
  				var info = infos[0];

  					//sends the data to the socrataInfo array in the
  					//model, making it accessible outside of this variable
        			self.socrataInfo.push(
        				{'Year': info.year, 
        				 'Associates': info.percent_associates_degree,
        				 'Bachelors': info.percent_bachelors_degree, 
        				 'HSGrad': info.percent_high_school_graduate
        				 }
        			);
        	
        	//accesses the socrataInfo array 
        	var census = self.socrataInfo[0];

        	var elem;
        	elem = document.createElement('li');
        	elem.className = 'info';

        	//actually creates the text that will go into the Socrata info div
            elem.textContent = 'Asbury Park, NJ Census Facts Courtesy Socrata Open Data || ' +
            				   'Year: ' + census.Year + ' || ' +
            				   'Bachelors Degree: ' + census.Bachelors + '% || ' +
            				   'Associates Degree: ' + census.Associates + '% || ' +
            				   'High School Grad: ' + census.HSGrad + '%';

            self.socrataElem.appendChild(elem);
		    //if the request fails or takes too long, it times out
		    clearTimeout(self.socrataTimeout);

        	}
        });

		//makes the div visible when the bar graph up top is clicked
		$("#socrata-data").click(function() {
		    $(".info").toggle("slow", function() {});
		});
	}
};


//live music API --- shows the venue, band, location of upcoming
//shows in the area, and you can click through to the band or 
//ticket websites
var jamBaseView = {

	init: function() {
		
		this.jamBaseElem = $('#jamBase-header');
		this.jamBaseURL = 'http://api.jambase.com/events?zipCode=07712' +
        '&radius=5&page=0&api_key=u34rze74n8752gcq7nt3bzn3';
  		this.slideOut = $('.slideout-menu-toggle')

	    this.render();
	},

	render: function() {
		var self = this;

		var text = 'This was supposed to show a bunch of information ' +
	            'about concerts in the area, and the request failed. Im so, so sorry. ' +
	            'So instead, here is a picture of a microphone, which should make up for' +
	            ' it. Right?';

	    //establishes the timeout if the ajax request fails/takes too long
        this.jamBaseTimeout = setTimeout(function() {
        	var mic = '</br><img src="img/microphone.jpg" id="mic">';
    		$('#jamBase-header').append(text).append(mic);
	    }, 3000);

		$.ajax({
	    	url: self.jamBaseURL,
	    	dataType: "json",
	    	success: function(response) {
	    		var infos = response;

	    		//pushes the needed jamBase information to the
	    		//jamBaseInfo array in the model to make it more easily
	    		//accessible
	    		infos.Events.forEach(function(jamStuff) {				
	    			model.jamBaseInfo.push(
	    				jamStuff);
	    		});
	    		//initiates the timeout request
	    		clearTimeout(self.jamBaseTimeout);
	
	    	}
	    });

	    //puts the jamBase info into a slideout menu that comes in
	    //from the right side of teh screen when the microphone PNG
	    //up top is clicked
	    /*slideout menu courtesy of alijafarian.com/jquery-horizontal-slideout-menu*/
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

var surfView = {
    
    init: function() {
        var dataLabel, i;
        this.surfElem = document.getElementById('surf-header');
        this.surfURL = 'http://magicseaweed.com/api/00e1e43e51248a4cb3431f4b73aeb4b3/forecast/?spot_id=857';
        this.surfInfo = model.surfInfo;

        this.render();
    },

    render: function() {
        var self = this;
        var t;

        var text = 'Interested in surfing when you come to Asbury Park? ' +
                'This section was supposed to show you everything you needed to' +
                ' know, but for some reason something went wrong. Wurkin on it.';

        this.surfTimeout = setTimeout(function() {
            $('#surf-header').append(text);
        }, 3000);
        
        $.ajax({
            url: this.surfURL,
            dataType: 'jsonp',
            success: function(response) {
                var infos = response;
                	console.log(infos);
                //I only wanted the most recent information on the site
                //so I created the 'info' variable
                var sixAM = infos[10];
                var noon = infos[20];
                var sixPM = infos[30];
                var threeTimes = [];
                threeTimes.push(sixAM, noon, sixPM);
         //       console.log(threeTimes);
                for(t=0;t<threeTimes.length;t++){
                	var info = threeTimes[t];
                	console.log(info);
                
                //var info = infos[10]; //6am, infos[20] == noon, infos[30] === 
                	//6pm
                //console.log(info);
                var time = info.localTimestamp;
               // console.log(time, 'time');
                var swellChart = info.charts.swell;
             //   console.log(swellChart, 'swell');
                var swell = info.swell;
                var maxBreak = swell.maxBreakingHeight;
                var minBreak = swell.minBreakingHeight;
           //     console.log(maxBreak, minBreak);
                var temp = info.condition.temperature;
         //       console.log(temp, 'temp');
                var waveHeight = info.swell.components.combined.height;
       //         console.log(waveHeight, 'height');
                var wind = info.wind;
                var windChill = wind.chill;
     //           console.log(windChill, 'windChill');
                var windDirection = wind.compassDirection;
   //             console.log(windDirection, 'direction');
                var windGusts = wind.gusts;
 //               console.log(windGusts, 'windGusts');
                var windSpeed = wind.speed;
               // console.log(windSpeed, 'speed');
                var windUnit = wind.unit; //(mph)
             //   console.log(windUnit, 'mph');
                    //sends the data to the socrataInfo array in the
                    //model, making it accessible outside of this variable
                    model.surfInfo.push(info);
                }
           
            //accesses the socrataInfo array 
            var surf = model.surfInfo();
            console.log(surf);

            //if the request fails or takes too long, it times out
            clearTimeout(self.surfTimeout);

            }
        });

        //makes the div visible when the bar graph up top is clicked
        $("#surf-data").click(function() {
            $("#surf-header").toggle("slow", function() {});
		});
        
    }

};




//sets up the info div for places that will appear as markers 
//that will appear in the bottom right when the search 
//icon up top or a marker is clicked
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
    	//uses the currentPlace function defined in the viewModel
    	//to set the info div up
        var currentPlace = viewModel.getCurrentPlace();

        this.markNameElem.textContent = currentPlace.title;
        this.markAddElem.textContent = currentPlace.address;
        this.markImageElem.src = currentPlace.src;

    }
};

//sets up the div that saves the notes taken to each individual 
//place
var notesView = {

	init: function() {
		var that = this;
		
		this.placeInput = document.getElementById('mark-search');
		this.messageBox = document.getElementById('noted');
		this.br = '</br>';

		//code is only initiated when enter is pressed
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

        //shows and hides the info when the proper button is
        //clicked
		$('#noted').show();
		$('#clear').show();

		//if the input field is not empty when the user presses
		//enter, then the value is pushed to the array of notes 
		//for the selected place, saving it so that when you click
		//on a different place, that place's notes come up 
		if(self.placeInput.value !== ''){
			this.currentPlace.notes.push(self.placeInput.value);
		}

		//resets the search bar's value to empty
		self.placeInput.value = '';
		self.messageBox.innerHTML = '';
		//adds a break in between individual notes
		self.messageBox.innerHTML = this.currentPlace.notes
			.join(self.br);

		//removes blank searches from the notes
		if(this.currentPlace.notes[0] == ''){
			this.currentPlace.notes.shift();
		}

		//when the clear notes button is pressed, then the notes 
		//for that chosen place are deleted and the notes section
		//is hidden until a new note is added
		$('#clear').click(function() {
			self.currentPlace.notes = [];
			self.messageBox.innerHTML = self.currentPlace.notes;
			$('#noted').hide();
		})
	},
};

//establishes a filter for the list of places so that when 
//you search and then hit enter, only the places on the list
//with the searched keyword will remain
var filterList = {
		
		init: function() {
			var self = this;
			var place = model.places;
			var places = ko.observableArray(place);

			//creates the array and then pushes the tags created to 
			//each place's 'tag' array
			this.tagged = ko.observableArray([]);
			places().forEach(function(placeItem){
				self.tagged.push(placeItem.tag);
			})

			this.render();
		},

		render: function() {
			var place = model.places;
			var places = ko.observableArray(place);
			//creates a computed function for the given array
			filterList:ko.computed(function() {

				//uses knockout to check the value of the search bar
				//in the list view; this variable is logged as whatever
				//was in that search bar, all lower case
		        var search = viewModel.query().toLowerCase();

		        //filters the given array
		        return ko.utils.arrayFilter(places(), function(placed) {

		        	//if the array contains the searched word, it will
		        	//return true
		        	Array.prototype.contains = function ( searched ) {
		        		for(r in this) {
		        			if(this[r] == searched) return true;
		        		}
		        		return false;
		        	}

		        	//declares a variable 'x' for whichever place's
		        	//tags are being searched
		        	var x = placed.tag;
		        	var elemID = document.getElementById(placed.id);
		        	//if the tag exists within that array, then the
		        	//element will remain displayed with 'block' style,
		        	//otherwise, it will be 'hidden'
		        	if (x.contains(search)) {
		        		elemID.style.display = 'block';
		        	}
		        	else {
		        		elemID.style.display = 'none';
		        	}

		        });

		    });

		}
}

//creates the div with the list of places in it
var listView = {

	init: function() {
		this.markListElem = document.getElementById('mark-list');
		
		this.render();
	},

    render: function() {
        var mark, elem, i;
        var places = viewModel.getPlaces();

        //anytime the magnifying glass up top is clicked,
        //anything with the class 'list' is going to toggle,
        //including the list view, the note section,
        //and the info div
    	$('#toggleListButton').click(function(){
		    $('.list').slideToggle();
		});


        this.markListElem.innerHTML = '';

        for(i=0; i<places.length; i++){
            mark = places[i];

            elem = document.createElement('li');
            elem.textContent = mark.title;
			elem.setAttribute('id', mark.id);

			//when a specific list item/place is clicked, the 
			//action within this function occurs
            elem.addEventListener('click', (function(markCopy) {

            	var filter, copyArr;
            	copyArr = ko.observableArray(markCopy.tag);

            	//creates a function to automatically suggest 
            	//what the user is typing in the list search
            	var autofill = ko.computed(function(){
            		//search function relies on knockout, as above
            		var search = viewModel.query().toLowerCase();
            		var places = model.places;
            		//adds all the individual place's tags together
            		//so that the function can search through them all
            		//at once
				    var allTags = places[0].tag
				    	.concat(places[1].tag)
				    	.concat(places[2].tag)
				    	.concat(places[3].tag)
				    	.concat(places[4].tag);
            		
            		return ko.utils.arrayFilter(copyArr(), function(spot) {
	            			var uniqueTags = [];
	            			var x = copyArr();
	            			var elemID = markCopy.id;

	            		//checks the places[i] arrays for duplicates
	            		//so as not to search them/autofill them twice
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
                    notesView.render();
                };

            })(mark));

            this.markListElem.appendChild(elem);
        }
    }
};

//establishes the markers, or pins, that will appear on the map
var pinView = {
	
	init: function() {
		var self = this;
		var t, data;
		var len = model.places.length;
		var pinned;

		for(t=0;t<len;t++) {
			data = model.places[t];
			this.image = data.mkImg;
			this.name = ko.observable(data.name);
			this.position = ko.observable(data.position);
			this.address = ko.observable(data.address);
			this.tag = ko.observable(data.tag);
			this.href = ko.observable(data.href);
		}

		this.render();
	},

	render: function() {

		var t, data;
		var len = model.places.length;

		//iterates through the places in the model
		//creates a new google map marker for it 
		//containing the information from the model
		//as well as the animation to make the markers drop instead
		//of appearing stagnantly on the map
		for(t=0;t<len;t++){
			data = model.places[t];

		    model.kram.push(
		    	new google.maps.Marker({
		    		title: data.title,
		    		src: data.src,
		    		notes: ko.observableArray([]),
		    		address: data.address,
			    	position: data.position,
			    	notes: data.notes,
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

//a lot of the map/marker/list functionality comes from here;
//when you click a marker, it changes to represent the place it
//stands for (johnny mac is a bar, the pin changes to an image of beer, etc)
var animateView = {

	init: function() {
		var self = this;
		this.markElem = document.getElementById('mark');
		this.markNameElem = document.getElementById('mark-name');
        this.markAddElem = document.getElementById('mark-address');
        this.markImageElem = document.getElementById('mark-img');
        this.placeInput = document.getElementById('mark-search');
        this.messageBox = document.getElementById('noted');
        this.br = '</br>';

	    var markAnimate = model.kram;
	    var modelPlace = model.places;
		var currentMark;
		var currentPlace;
		var placeID;

		for(w=0;w<model.kram.length;w++){
			
			var timeOutId;
				//when you hit enter on the search bar, it searches
				//the list view for what has been filtered;
				//if the name of the place is visible, then the marker
				//stays visible and the others are setMap'd to null;
				//there's a timeout on it so that it delays a beat,
				//otherwise it would be searching while the list view is
				//still empty
				$("#searchBar").keypress(function(e) {
					if(e.keyCode == 13) {
						function timed(){
							for(g=0;g<model.kram.length;g++){
								placeID = document.getElementById(modelPlace[g].id);
								var disp = placeID.style.display === 'block';
				
								if(disp){
									markAnimate[g].setMap(map);
								} else{

									markAnimate[g].setMap(null);
								}
							}
					}

					timeoutId = window.setTimeout(timed, 200);

					}
	
				});

			//gets each place by its ID
			var eachPlace = document.getElementById(modelPlace[w].id);

			//if you click a marker, the below function will activate
			markAnimate[w].addListener('click', function(pinCopy) {

				currentPlace = viewModel.getCurrentPlace();


			//close but not working**********		

				//sets the current marker to whichever has been clicked
				currentMark = this;
				viewModel.setCurrentPlace(currentMark);
				//console.log(currentMark);
				//if the current place does not equal the current marker,
				//then the current place is set to the current marker
				//using the setCurrentPlace function found in the viewModel
				if(currentPlace.title !== currentMark.title){
					
					

					
				}
				console.log(currentPlace.notes);
					$('#clear').click(function() {
						
							currentPlace.notes = [];
							currentMark.notes = [];
							console.log(currentMark.notes);
							console.log(currentPlace.notes);

					
					//	$('#noted').hide();
	
					})
					notesView.render();

				//handles the different animations for the markers
				for(n=0;n<markAnimate.length;n++){
									
					var that = this;	
					var icon = markAnimate[n].icon;
					markAnimate[n].setIcon(null);
					self.markNameElem.textContent = this.title;
			        self.markAddElem.textContent = this.address;
			        self.markImageElem.src = this.src;

			        //if the marker icon is nothing, then it sets
			        //the image to the assigned picture
			        //it also makes it bounce, and stop bouncing after
			        //a short time
			        //that way the user sees which has been selected
					if(icon === null){

						this.setIcon(this.image);
						this.setAnimation(google.maps.Animation.BOUNCE);
			            timeoutID = window.setTimeout(stopBouncing, 2300);

			            function stopBouncing() {
			                that.setAnimation(null);
			            };
					}

				}

				//when a marker is clicked, the list view is displayed
				$('.list').show('slow', function(){});
			})

			//when the 'hide list' button is clicked, the listview is hidden
			$('#hide').click(function(){
				$('.list').hide('slow', function(){});
			})

			//links the list view to the marker; if one is clicked, 
			//both activate
			$(eachPlace).click(function(){

				//variable for the current place
				var curr = viewModel.getCurrentPlace();
				

				for(var g=0;g<model.kram.length;g++){
					var skram = markAnimate[g].id;
					var icon = markAnimate[g].icon;
					var ecalp = curr.id;
					var pic = curr.mkImg;
					markAnimate[g].setIcon(null);

					//if the current place ID matches the current
					//marker ID, then we establish the variable 'that'
					if(ecalp === skram){
						var that = markAnimate[g];

						//if the icon is null, then the below occurs;
						//the marker bounces and stops and the marker
						//icon is set to the proper image
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


//initiates the map
var initMap = {
	
	init: function() {
		var self = this;
		this.icon = 'img/marker-blue.png';

		this.mapDiv = document.getElementById('map');
		//establishes the map properties
		this.mapOptions = {
			center: {lat: 40.220391, lng: -74.012082},
	        scrollwheel: false,
	        zoom: 14
		};

		this.render();	
	},

	render: function() {
		//actually renders the map, and the pinView, which, if put
		//in the viewModel, would throw the error that "google" is
		//not defined
		map = new google.maps.Map(this.mapDiv, this.mapOptions);
		pinView.init();

	}
};

//runs the viewModel code, and everything that is within it
viewModel.init();

//applies the knockoutjs bindings to the viewModel info
ko.applyBindings(viewModel);








