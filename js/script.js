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
    currentInfo: ko.observableArray([]),
    //socrataInfo has all the info for the census open data network info
    socrataInfo: ko.observableArray([]),
    //jamBaseInfo is where I store the info for the live music API
    jamBaseInfo: ko.observableArray([]),
    //uses info from Foursquare to populate the info-div for all the locations
    fourSqInfo: ko.observableArray([]),
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
        title: ko.observable('Johnny Mac House Of Spirits'),
        tag: ['', 'visit', 'bar', 'alcohol', 'beer', 'nightlife', 'night life', 'pizza', 'johnny', 'mac'],
        src: 'img/macs.jpg',
        mkImg: 'img/beer.png',
        nums: '0',
        href: 'http://www.johnnymacbar.com/',
        id: 'mac',
        visibility: ko.observable(true)
    }, {

        position: {
            lat: 40.220001,
            lng: -74.000947
        },
        title: ko.observable('The Stone Pony'),
        tag: ['', 'visit', 'music', 'concert', 'live', 'stone', 'pony', 'entertainment'],
        src: 'img/pony.jpg',
        mkImg: 'img/music.png',
        nums: '1',
        href: 'http://stoneponyonline.com/',
        id: 'pony',
        visibility: ko.observable(true)
    }, {
        position: {
            lat: 40.220239,
            lng: -74.002344
        },
        title: ko.observable('Porta Pizzeria'),
        tag: ['', 'visit', 'bar', 'restaurant', 'pizza', 'nightclub', 'porta', 'wine'],
        src: 'img/porta.jpg',
        mkImg: 'img/pizza.png',
        nums: '2',
        href: 'http://pizzaporta.com/ASBURY-PARK',
        id: 'porta',
        visibility: ko.observable(true)
    }, {

        position: {
            lat: 40.2207,
            lng: -73.999884
        },
        title: ko.observable('Silverball Museum'),
        tag: ['', 'visit', 'vacation', 'pinball', 'silverball', 'museum', 'silver'],
        src: 'img/silverball.jpg',
        mkImg: 'img/pinball.png',
        nums: '3',
        href: 'http://silverballmuseum.com/',
        id: 'silver',
        visibility: ko.observable(true)
    }, {
        position: {
            lat: 40.223796,
            lng: -73.998585
        },
        title: ko.observable('Asbury Park Convention Hall'),
        tag: ['', 'visit', 'shopping', 'tourist', 'pictures', 'convention', 'hall'],
        src: 'img/hall.jpg',
        mkImg: 'img/shopping.png',
        nums: '4',
        href: 'https://en.wikipedia.org/wiki/Asbury_Park_Convention_Hall',
        id: 'hall',
        visibility: ko.observable(true)
    }],
};

var viewModel = {

    init: function() {
        //sets the clicked place to the first one in the array
        model.currentPlace.shift();
        model.currentPlace = model.places[0];
        socrataView.init();
        jamBaseView.init();
        fourSqView.init();
        surfView.init();
        listView.init();
        animateView.init();
        initMap.failInit();
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

        this.socrataURL = 'https://odn.data.socrata.com/resource/uf4m-5u8r.json?' +
            'id=1600000US3401960';

        //the text that will appear if the request times out
        this.text =
            'You were supposed to see some awesome census data ' +
            'about Asbury Park, NJ, but the request failed. And it is all. my.' +
            ' fault. I am sorry to let you down.';

        this.render();
    },

    render: function() {
        var self = this;

        //sets the fail function to true, making the corresponding div in
        //index.html visible that includes the 'fail' text
        this.socrataTimeout = setTimeout(function() {
            self.fail(true);

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
                model.socrataInfo.push({
                    'Year': info.year,
                    'Associates': info.percent_associates_degree,
                    'Bachelors': info.percent_bachelors_degree,
                    'HSGrad': info.percent_high_school_graduate
                });

                //if the request fails or takes too long, it times out
                clearTimeout(self.socrataTimeout);

            }
        });

    },

    //sets the initial visibility of the div to false
    fail: ko.observable(false)
};


var fourSqView = {
    init: function() {
        var that = this;

        this.squareTimeout = setTimeout(function() {
            that.fail(true);
        }, 3000);

        model.places.forEach(function(place) {
            that.title = place.title();

            that.fourSqURL = 'https://api.foursquare.com/v2/venues/search' +
                '?client_id=Q4GS4EPCPCFTINXSCJO0HZ33UX1CS555SC0B1NSM2UNJZTRM' +
                '&client_secret=MWNXI2MIQXXMEUUTVRHMIAXMIHYUDMVGOBQFX225K1X0ZCHJ' +
                '&v=20130815' +
                '&near=Asbury Park, NJ' +
                '&query=' + that.title;
            //Johnny Mac
            //Porta
            //Stone Pony
            //Pinball Museum
            //Convention Hall
            that.render();
        });


    },

    render: function() {
        var self = this;

        $.ajax({
            url: this.fourSqURL,
            dataType: 'json',
            success: function(response) {
                var place = response.response.venues[0];
                var name = place.name;
                var address = place.location.address;
                var phone = place.contact.formattedPhone;
                var twitter = place.contact.twitter;
                var url = place.url;
                var sqUrl = 'http://foursquare.com/v/' + place.id;

                model.fourSqInfo.push({
                    'Name': name,
                    'Address': address,
                    'Twitter': twitter,
                    'Phone': phone,
                    'url': url,
                    'sqUrl': sqUrl
                });

                clearTimeout(self.squareTimeout);
            }
        });

    },

    fail: ko.observable(false)

};




//live music API --- shows the venue, band, location of upcoming
//shows in the area, and you can click through to the band or 
//ticket websites
var jamBaseView = {

    init: function() {
        var that = this;
        this.jamBaseURL = 'http://api.jambase.com/events?zipCode=07712' +
            '&radius=5&page=0&api_key=u34rze74n8752gcq7nt3bzn3';

        //same functionality as the socrata timeout detailed above
        this.text = 'This was supposed to show a bunch of information ' +
            'about concerts in the area, and the request failed. Im so, so sorry. ' +
            'So instead, here is a picture of a microphone, which should make up for' +
            ' it. Right?';

        //establishes the timeout if the ajax request fails/takes too long
        this.jamBaseTimeout = setTimeout(function() {
            that.fail(true);
        }, 3000);
        this.render();
    },

    fail: ko.observable(false),

    render: function() {
        var self = this;

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

                var jamBaseElemWidth = $('.jamBase-header').width();

                $('.jamBase-header').toggleClass('open');

                if ($('.jamBase-header').hasClass('open')) {
                    $('.jamBase-header').animate({
                        right: '0px'
                    });
                } else {
                    $('.jamBase-header').animate({
                        right: -jamBaseElemWidth
                    }, 250);
                }
            });
        });
    }
};

//gets info on the local surf conditions for three times/day
var surfView = {

    init: function() {
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
            $('.white-back').append(text);
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

    },

    fail: ko.observable(false)

};

//allows me to show, hide, or toggle whatever div I want using 
//knockouts 'click' binding in index.html
var toggle = {
    list: function() {
        $('.list').slideToggle();
    },

    socrata: function() {
        $(".socrata-header").toggle("slow", function() {});
    },

    hideList: function() {
        $('.list').hide('slow', function() {});
    },

    surf: function() {
        $(".surf-header").toggle("slow", function() {});
    },

    //applies the filter when the 'enter' button is pressed
    //on the corresponding searchBar in index.html
    filter: function(d, e) {
        e.keyCode === 13 && filterList.render();
        return true;
    }
};


//creates and renders the pins (google maps markers) and their
//animations
var markView = {

    init: function() {

        this.render();
    },

    render: function() {
        var self = this;
        var title = this.title();
        var sq = model.fourSqInfo();

        model.currentInfo.shift();

        sq.forEach(function(sqInf) {

            var sqTitle = sqInf.Name;

            if (title === sqTitle) {

                model.currentInfo.push({
                    'currentTitle': sqInf.Name,
                    'currentAddress': sqInf.Address,
                    'currentTwitter': sqInf.Twitter,
                    'currentURL': sqInf.url,
                    'currentSqUrl': sqInf.sqUrl
                });
            }
        });


        model.markArr.forEach(function(markArrCopy) {

            markArrCopy.setIcon(null);
            markArrCopy.setAnimation(null);

            if (markArrCopy.title === self.title()) {

                var currentPin = markArrCopy;
                var timeoutID = window.setTimeout(stopBouncing, 2300);

                currentPin.setIcon(currentPin.image);
                currentPin.setAnimation(google.maps.Animation.BOUNCE);

                function stopBouncing() {
                    currentPin.setAnimation(null);
                }

            }
        });
        animateView.init();
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
        var that = this;
        var place = model.places;
        var places = ko.observableArray(place);

        //uses knockout to check the value of the search bar
        //in the list view; this variable is logged as whatever
        //was in that search bar, all lower case
        //creates a computed function for the given array
        filterList: ko.computed(function() {
            that.search = viewModel.query().toLowerCase();

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

            });
        });

        that.searched();

        

    },

    //actually initiates the search functionality for each place
    searched: function() {
        var self = this;
        console.log(self.search);
        var q = self.search;




        model.places.forEach(function(placed) {
            var x = placed.tag;
            var placeArr = ko.observableArray([]);

          //  console.log(x);
         //   placed.visibility(true);


            x.filter(function(i){
                console.log(i.indexOf(q) > -1);

                var searchTrue = i.indexOf(q) > -1;

                    placeArr.push(searchTrue);

            })
           console.log(placeArr());

           if(placeArr().contains(true)){
                placed.visibility(true);
           }
           else {
            placed.visibility(false);
           }


          /*  model.markArr.forEach(function(markArrCopy) {
                var placeTitle = placed.title();
                var markTitle = markArrCopy.title;
                console.log(markArrCopy);

                //if the place's tag is contained in the 
                //search when enter is hit, then the list
                //view item will
                //remain visible according to knockout's
                //visible binding
                if (x.contains(self.search)) {
                    placed.visibility(true);

                    //this if statement compares 
                    //the visible list view titles to the
                    //titles of the markers; if they're equal,
                    //then that marker will also remain visible
                    if (placeTitle === markTitle) {
                        markArrCopy.setMap(map);
                    }

                } else {
                    placed.visibility(false);

                    if (placeTitle === markTitle) {
                        markArrCopy.setMap(null);
                    }

                }
            });*/
        });
    }
};


//creates the div with the list of places in it
var listView = {

    init: function() {

        this.render();
    },

    render: function() {
      
        var places = model.places;

        var allTags = places.reduce(function(prev, curr) {
            return prev.concat(curr.tag);
        }, []);

        var uniqueTags = [];

        //checks the tag arrays for duplicates
        //so as not to search them/autofill them twice
        $.each(allTags, function(i, el) {
            if ($.inArray(el, uniqueTags) === -1) uniqueTags.push(el);
        });

        //initiates the autocomplete search function, using the
        //uniqueTags array 
        $(".searchBar").autocomplete({
            source: uniqueTags
        });
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
                    visibility: data.visibility,
                    tags: data.tag
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

        this.render();
    },

    render: function() {
        var allMark = model.markArr;

        //uses knockout to iterate through all the markers
        allMark.forEach(function(allMarkCopy) {

            //initiates a click function to each marker
            allMarkCopy.addListener('click', function() {
                var sq = model.fourSqInfo();
                var title = this.title;

                $('.list').show('slow', function() {});

                //pushes the current info for the info-div
                model.currentInfo.shift();
                sq.forEach(function(sqInf) {
                    var sqTitle = sqInf.Name;
                    if (title === sqTitle) {
                        model.currentInfo.push({
                            'currentTitle': sqInf.Name,
                            'currentAddress': sqInf.Address,
                            'currentTwitter': sqInf.Twitter,
                            'currentURL': sqInf.url,
                            'currentSqUrl': sqInf.sqUrl
                        });
                    }
                });

                //resets the markers on each click, so that
                //they stop bouncing and switch back to 
                //their original icon image
                allMark.forEach(function(resetMark) {
                    resetMark.setIcon(null);
                    resetMark.setAnimation(null);
                });

                var currentPin = allMarkCopy;
                var timeoutID = window.setTimeout(stopBouncing, 2300);

                currentPin.setIcon(currentPin.image);
                currentPin.setAnimation(google.maps.Animation.BOUNCE);

                function stopBouncing() {
                    currentPin.setAnimation(null);
                }

            });
        });
    }
};


//initiates the map
var initMap = {

    failInit: function() {
        var self = this;

        //same functionality as the socrata, jambase, and 
        //surfView timeouts described above
        this.text = 'Shoot. An interactive map of a beach town was supposed to' +
            ' show up but something went wrong. Try re-loading the page,' +
            ' and if that does nothing' +
            ' rest assured if the problem is on our end, we will have' +
            ' it figured out as soon as possible.';


        this.mapTimeout = setTimeout(function() {
            self.fail(true);

        }, 3000);
    },

    fail: ko.observable(false),

    init: function() {

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

        this.render();

    },

    render: function() {
        var that = this;

        //actually renders the map, and the pinView, which, if put
        //in the viewModel, would throw the error that "google" is
        //not defined
        map = new google.maps.Map(this.mapDiv, this.mapOptions);
        pinView.init();
        filterList.init();
        clearTimeout(that.mapTimeout);


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