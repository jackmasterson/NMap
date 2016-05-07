//creates an interactive map of Asbury Park, NJ using the Google Maps API, 
//as well as other APIs to add to the user experience. More information available
//in the README

//Jack Masterson, May 6th, 2016

//Udacity, FEND Nanodegree, Project 5
'use strict';
//creates the map variable which will be initiated later in the script
var map;

//stores all the info I'll use to build the site
var model = {
    currentPlace: ko.observableArray([null]),
    //socrataInfo has all the info for the census open data network info
    socrataInfo: ko.observableArray([]),
    //jamBaseInfo is where I store the info for the live music API
    jamBaseInfo: ko.observableArray([]),

    surfInfo: ko.observableArray([]),
    dates: ko.observableArray([]),
    //individual marker data gets pushed here
    markArr: [],
    //info for the list view and info div
    places: [{
        position: {
            lat: 40.216147,
            lng: -74.012914
        },
        title: ko.observable('Johnny Mac House of Spirits'),
        tag: ['', 'visit', 'bar', 'alcohol', 'beer', 'nightlife', 'night life', 'pizza', 'johnny', 'mac'],
        address: '208 Main St, Asbury Park, NJ 07712',
        src: 'img/macs.jpg',
        mkImg: 'img/beer.png',
        nums: '0',
        href: 'http://www.johnnymacbar.com/',
        id: 'mac',
    }, {

        position: {
            lat: 40.220001,
            lng: -74.000947
        },
        title: ko.observable('The Stone Pony'),
        tag: ['', 'visit', 'music', 'concert', 'live', 'stone', 'pony', 'entertainment'],
        address: '913 Ocean Ave, Asbury Park, NJ 07712',
        src: 'img/pony.jpg',
        mkImg: 'img/music.png',
        nums: '1',
        href: 'http://stoneponyonline.com/',
        id: 'pony',
    }, {
        position: {
            lat: 40.220239,
            lng: -74.002344
        },
        title: ko.observable('Porta Pizza/Wine Bar'),
        tag: ['', 'visit', 'bar', 'restaurant', 'pizza', 'nightclub', 'porta', 'wine'],
        address: '911 Kingsley St, Asbury Park, NJ 07712',
        src: 'img/porta.jpg',
        mkImg: 'img/pizza.png',
        nums: '2',
        href: 'http://pizzaporta.com/ASBURY-PARK',
        id: 'porta',
    }, {

        position: {
            lat: 40.2207,
            lng: -73.999884
        },
        title: ko.observable('Silverball Museum'),
        tag: ['', 'visit', 'vacation', 'pinball', 'silverball', 'museum', 'silver'],
        address: '1000 Ocean Ave, Asbury Park, NJ 07712',
        src: 'img/silverball.jpg',
        mkImg: 'img/pinball.png',
        nums: '3',
        href: 'http://silverballmuseum.com/',
        id: 'silver',
    }, {
        position: {
            lat: 40.223796,
            lng: -73.998585
        },
        title: ko.observable('Convention Hall'),
        tag: ['', 'visit', 'shopping', 'tourist', 'pictures', 'convention', 'hall'],
        address: '1300 Ocean Ave, Asbury Park, NJ 07712',
        src: 'img/hall.jpg',
        mkImg: 'img/shopping.png',
        nums: '4',
        href: 'https://en.wikipedia.org/wiki/Asbury_Park_Convention_Hall',
        id: 'hall',
    }],
};

var viewModel = {

    init: function() {
        //sets the clicked place to the first one in the array
        model.currentPlace.shift();
        model.currentPlace = model.places[0];
        socrataView.init();
        jamBaseView.init();
        surfView.init();
        listView.init();
        markView.init();
        filterList.init();
        animateView.init();
        initMap.fail();
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
};

//census Open Data Network API courtesy Socrata
//includes a failure timeout for the ajax request
var socrataView = {

    init: function() {

        this.socrataElem = document.getElementById('socrata-header');
        this.socrataURL = 'https://odn.data.socrata.com/resource/uf4m-5u8r.json?' +
            'id=1600000US3401960';
        this.socrataUL = document.getElementById('socrata-info');
        this.socrataLI = document.getElementById('socrata-item');
        this.socrataInfo = model.socrataInfo;

        this.render();
    },

    render: function() {
        var self = this;

        var text = 'You were supposed to see some awesome census data ' +
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
                self.socrataInfo.push({
                    'Year': info.year,
                    'Associates': info.percent_associates_degree,
                    'Bachelors': info.percent_bachelors_degree,
                    'HSGrad': info.percent_high_school_graduate
                });
                console.log(model.socrataInfo);

                //if the request fails or takes too long, it times out
                clearTimeout(self.socrataTimeout);

            }
        });

        //makes the div visible when the bar graph up top is clicked
        $("#socrata-data").click(function() {
            $("#socrata-header").toggle("slow", function() {});
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
        this.slideOut = $('.slideout-menu-toggle');

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

                if ($('#jamBase-header').hasClass('open')) {
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

//gets info on the local surf conditions for three times/day
var surfView = {

    init: function() {
        this.surfElem = document.getElementById('surf-header');
        this.surfURL = 'http://magicseaweed.com/api/00e1e43e51248a4cb3431f4b73aeb4b3/forecast/?spot_id=857';
        this.surfInfo = model.surfInfo;

        this.render();
    },

    render: function() {
        var self = this;
        var t;

        //appears when the request times out
        var text = 'Interested in surfing when you come to Asbury Park? ' +
            'This section was supposed to show you everything you needed to' +
            ' know, but for some reason something went wrong. Wurkin on it.';

        //sets the timeout parameters
        this.surfTimeout = setTimeout(function() {
            $('#white-back').append(text);
        }, 1000);

        $.ajax({
            url: this.surfURL,
            dataType: 'jsonp',
            success: function(response) {
                var infos = response;
                //I only wanted the certain information from the JSON
                //so I created the 'infos' variable and pushed them to
                //an array called threeTimes
                var sixAM = infos[3];
                var noon = infos[5];
                var sixPM = infos[7];
                var threeTimes = [];
                threeTimes.push(sixAM, noon, sixPM);

                //pushes the individual info into the model.surfInfo array
                for (t = 0; t < threeTimes.length; t++) {
                    var info = threeTimes[t];
                    model.surfInfo.push(info);
                }

                //if the request fails or takes too long, it times out
                clearTimeout(self.surfTimeout);

            }
        });

        //makes the div visible when the surf image is clicked
        $("#surf-data").click(function() {
            $("#surf-header").toggle("slow", function() {});
        });

    }

};

//sets up the info div for places that will appear as markers 
//that will appear in the bottom right when the search 
//icon up top or a marker is clicked

var title = ko.observableArray([]);
var markView = {

    init: function() {
        var self=this;


        //uses the currentPlace function defined in the viewModel
        //to set the info div up
        console.log(model.currentPlace);

        this.render();
    },

    render: function() {
        title.shift();
        title.push(model.currentPlace.title());
        console.log(title());
        return title;
    }
    
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
        places().forEach(function(placeItem) {
            self.tagged.push(placeItem.tag);
        });

        this.render();
    },

    render: function() {
        var place = model.places;
        var places = ko.observableArray(place);
        //creates a computed function for the given array
        filterList: ko.computed(function() {

            //uses knockout to check the value of the search bar
            //in the list view; this variable is logged as whatever
            //was in that search bar, all lower case
            var search = viewModel.query().toLowerCase();

            //filters the given array
            return ko.utils.arrayFilter(places(), function(placed) {

                //if the array contains the searched word, it will
                //return true
                Array.prototype.contains = function(searched) {
                    for (var r in this) {
                        if (this[r] == searched) return true;
                    }
                    return false;
                };

                //declares a variable 'x' for whichever place's
                //tags are being searched
                var x = placed.tag;
                var elemID = document.getElementById(placed.id);
                //if the tag exists within that array, then the
                //element will remain displayed with 'block' style,
                //otherwise, it will be 'hidden'
                if (x.contains(search)) {
                    elemID.style.display = 'block';
                } else {
                    elemID.style.display = 'none';
                }

            });

        });

    }
};

//creates the div with the list of places in it
var listView = {

    init: function() {
        this.markListElem = document.getElementById('mark-list');

        this.render();
    },

    render: function() {
        var mark, elem, i;
        var places = viewModel.getPlaces();

        //anytime the magnifying glass icon or a marker is clicked,
        //anything with the class 'list' is going to toggle,
        //including the list view 
        //and the info div
        $('#toggleListButton').click(function() {
            $('.list').slideToggle();
        });

        this.markListElem.innerHTML = '';

        for (i = 0; i < places.length; i++) {
            mark = places[i];

            elem = document.createElement('li');
            elem.textContent = mark.title();
            elem.setAttribute('id', mark.id);
            elem.className = 'classed';

            //when a specific list item/place is clicked, the 
            //action within this function occurs
            elem.addEventListener('click', (function(markCopy) {

                var copyArr = ko.observableArray(markCopy.tag);

                //creates a function to automatically suggest 
                //what the user is typing in the list search
                var autofill = ko.computed(function() {
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
                        var elemID = markCopy.id;

                        //checks the places[i] arrays for duplicates
                        //so as not to search them/autofill them twice
                        $.each(allTags, function(i, el) {
                            if ($.inArray(el, uniqueTags) === -1) uniqueTags.push(el);
                        });

                        //initiates the autocomplete search function, using the
                        //uniqueTags array 
                        $("#searchBar").autocomplete({
                            source: uniqueTags
                        });
                    });
                });

                return function() {

                    viewModel.setCurrentPlace(markCopy);
                    markView.render();
                };

            })(mark));

            this.markListElem.appendChild(elem);
        }
    }
};


//establishes the markers, or pins, that will appear on the map
var pinView = {

    init: function() {
        var t, data;
        var len = model.places.length;

        for (t = 0; t < len; t++) {
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
        for (t = 0; t < len; t++) {
            data = model.places[t];

            model.markArr.push(
                new google.maps.Marker({
                    title: data.title(),
                    src: data.src,
                    address: data.address,
                    position: data.position,
                    map: map,
                    image: data.mkImg,
                    animation: google.maps.Animation.DROP,
                    icon: null,
                    id: data.id,
                })
            );
        }
        animateView.init();
    }
};


//a lot of the map/marker/list functionality comes from here;
//when you click a marker, it changes to represent the place it
//stands for (johnny mac is a bar, the pin changes to an image of beer, etc)
var animateView = {

    init: function() {
        
        this.markElem = document.getElementById('mark');
        this.markNameElem = document.getElementById('mark-name');
        this.markAddElem = document.getElementById('mark-address');
        this.markImageElem = document.getElementById('mark-img');
        this.placeInput = document.getElementById('mark-search');
        this.modelPlace = model.places;
        this.markAnimate = model.markArr;
        this.br = '</br>';

        this.render();
    },

    render: function() {
        var self = this;

        for (var w = 0; w < model.markArr.length; w++) {

            var timeOutId;
            //when you hit enter on the search bar, it searches
            //the list view for what has been filtered;
            //if the name of the place is visible, then the marker
            //stays visible and the others are setMap'd to null;
            
            //there's a timeout on it so that it delays a beat,
            //otherwise it would be searching while the list view is
            //still empty
            $("#searchBar").keypress(function(e) {
                if (e.keyCode == 13) {
                    function timed() {
                        for (var g = 0; g < model.markArr.length; g++) {
                            var placeID = document.getElementById(self.modelPlace[g].id);
                            var disp = placeID.style.display === 'block';

                            if (disp) {
                                self.markAnimate[g].setMap(map);
                            } 
                            else {
                                self.markAnimate[g].setMap(null);
                            }
                        }
                    }

                    var timeoutId = window.setTimeout(timed, 200);

                }

            });

            //gets each place by its ID
            var eachPlace = document.getElementById(self.modelPlace[w].id);

            //if you click a marker, the below function will activate
            self.markAnimate[w].addListener('click', function(pinCopy) {

                var currentPlace = viewModel.getCurrentPlace();

                this.searchElem = document.getElementById('mark-search');

                //sets the current marker to whichever has been clicked
                var currentMark = this;
                viewModel.setCurrentPlace(currentMark);

                //handles the different animations for the markers
                for (var n = 0; n < self.markAnimate.length; n++) {

                    var that = this;
                    self.markAnimate[n].setIcon(null);
                    self.markNameElem.textContent = this.title;
                    self.markAddElem.textContent = this.address;
                    self.markImageElem.src = this.src;

                    //if the marker icon is nothing, then it sets
                    //the image to the assigned picture
                    //it also makes it bounce, and stop bouncing after
                    //a short time
                    //that way the user sees which has been selected


                    this.setIcon(this.image);
                    this.setAnimation(google.maps.Animation.BOUNCE);
                    var timeoutID = window.setTimeout(stopBouncing, 2300);

                    function stopBouncing() {
                        that.setAnimation(null)
                    };
                }

                //when a marker is clicked, the list view is displayed
                $('.list').show('slow', function() {});
            });

            //when the 'hide list' button is clicked, the listview is hidden
            $('#hide').click(function() {
                $('.list').hide('slow', function() {});
            });

            //links the list view to the marker; if one is clicked, 
            //both activate
            $(eachPlace).click(function() {

                //variable for the current place
                var curr = viewModel.getCurrentPlace();


                for (var g = 0; g < model.markArr.length; g++) {
                    var marksID = self.markAnimate[g].id;
                    var icon = self.markAnimate[g].icon;
                    var placeID = curr.id;
                    var pic = curr.mkImg;
                    self.markAnimate[g].setIcon(null);

                    //if the current place ID matches the current
                    //marker ID, then we establish the variable 'that'
                    if (placeID === marksID) {
                        var that = self.markAnimate[g];

                        //if the icon is null, then the below occurs;
                        //the marker bounces and stops and the marker
                        //icon is set to the proper image
                        if (icon === null) {
                            that.setAnimation(google.maps.Animation.BOUNCE);
                            var timeoutID = window.setTimeout(function() {
                                that.setAnimation(null);
                            }, 2300);

                            that.setIcon(pic);
                        }

                    }
                }
            });
        }
    }
};




//initiates the map
var initMap = {

    fail: function() {

        //text that appears if the request times out
        var text = 'Shoot. An interactive map of a beach town was supposed to' +
            ' show up but something went wrong, so all you get is a boring' +
            ' picture. Try re-loading the page, and if that does nothing' +
            ' rest assured if the problem is on our end, we will have' +
            ' it figured out as soon as possible.';
        var staticMap = '</br><img id="static" src="img/static.jpg">';
        this.initMapTimeout = setTimeout(function() {
            $('#failure').append(text).append(staticMap);
        }, 2000);

    },

    init: function() {
        var self = this;
        this.icon = 'img/marker-blue.png';

        this.mapDiv = document.getElementById('map');
        //establishes the map properties
        this.mapOptions = {
            center: {
                lat: 40.220391,
                lng: -74.012082
            },
            scrollwheel: false,
            zoom: 15
        };

        clearTimeout(self.initMapTimeout);

        this.render();

    },

    render: function() {
        //actually renders the map, and the pinView, which, if put
        //in the viewModel, would throw the error that "google" is
        //not defined
        map = new google.maps.Map(this.mapDiv, this.mapOptions);
        pinView.init();

        //activates the information for the LatLng and Zoom attributes
        //depending on screen size
        this.resize();

    },

    resize: function() {
        var that = this;
        var latLng;
        var zoom;
        var smLat = 40.220391;
        var smLng = -74.005082;

        //realigns the zoom and center if the min-width is 315px
        if (window.matchMedia("(min-device-width: 315px)").matches) {
            latLng = new google.maps.LatLng(smLat, smLng);
            zoom = 14;
        }

        //if min-width is 710px, it reverts to the normal parameters
        //for the map
        if (window.matchMedia("(min-device-width: 710px)").matches) {
            latLng = that.mapOptions.center;
            zoom = that.mapOptions.zoom;
        }
        map.setCenter(latLng);
        map.setZoom(zoom);


    }
};

//runs the viewModel code, and everything within it
viewModel.init();

//applies the knockoutjs bindings to the viewModel info
ko.applyBindings(viewModel);