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
        visible: ko.observable(true)
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
        visible: ko.observable(true)
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
        visible: ko.observable(true)
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
        visible: ko.observable(true)
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
        visible: ko.observable(true)
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
        //toggle.init();
        listView.init();
      //  markView.init();
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

        this.socrataURL = 'https://odn.data.socrata.com/resource/uf4m-5u8r.json?' +
            'id=1600000US3401960';
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

                //if the request fails or takes too long, it times out
                clearTimeout(self.socrataTimeout);

            }
        });

    }
};



//live music API --- shows the venue, band, location of upcoming
//shows in the area, and you can click through to the band or 
//ticket websites
var jamBaseView = {

    init: function() {

        this.jamBaseURL = 'http://api.jambase.com/events?zipCode=07712' +
            '&radius=5&page=0&api_key=u34rze74n8752gcq7nt3bzn3';

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

    }

};

//sets up the info div for places that will appear as markers 
//that will appear in the bottom right when the search 
//icon up top or a marker is clicked
var toggle = {
    list: function() {
        $('.list').slideToggle();
    },

    socrata: function() {
        $("#socrata-header").toggle("slow", function() {});
    },

    hideList: function() {
      //when the 'hide list' button is clicked, the listview is hidden
        $('.list').hide('slow', function() {});
    },

    surf: function() {
        $("#surf-header").toggle("slow", function() {});
    }
};






var markView = {

    init: function() {

        this.render();
    },

    render: function() {
        var self = this;
        var title = this.title();
        var address = this.address;
        var src = this.src;

        model.currentInfo.shift();
        model.currentInfo.push({'currentTitle': title, 'currentAddress': address,
            'currentSRC': src});

        model.markArr.forEach(function(markArrCopy){
            console.log(markArrCopy.id);
            markArrCopy.setIcon(null);
            markArrCopy.setAnimation(null);

            if(markArrCopy.title === self.title()){

                var currentPin = markArrCopy;
                var timeoutID = window.setTimeout(stopBouncing, 2300);

                currentPin.setIcon(currentPin.image);
                currentPin.setAnimation(google.maps.Animation.BOUNCE);
                
                function stopBouncing() {
                    currentPin.setAnimation(null);
                }

            }
        })
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
                $("#searchBar").keypress(function(e) {
                    if (e.keyCode == 13) {
                        if (x.contains(search)) {
                 
                            placed.visible(true);
                          //  return true
                        } else {
                           // return false
                            placed.visible(false);
                        }
                        console.log(placed);
                    }
                    
                });

            });

        });

    }
};







//creates the div with the list of places in it
var listView = {

    init: function() {

        this.render();
    },

    render: function() {
        var mark, elem, i;
        var places = viewModel.getPlaces();

        places.forEach(function(markCopy){
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

                return ko.utils.arrayFilter(allTags, function(spot) {
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
        var self = this;
        var allMark = model.markArr;

        allMark.forEach(function(allMarkCopy){
                
            var timeOutId;

            allMarkCopy.addListener('click', function(){
                console.log(this);
                var title = this.title;
                var address = this.address;
                var src = this.src;

                $('.list').show('slow', function() {});

                model.currentInfo.shift();
                model.currentInfo.push(
                    {
                        'currentTitle': title, 
                        'currentAddress': address,
                        'currentSRC': src
                    }
                );

                allMark.forEach(function(resetMark){
                    console.log(resetMark);
                    resetMark.setIcon(null);
                    resetMark.setAnimation(null);
                })

                var currentPin = allMarkCopy;
                var timeoutID = window.setTimeout(stopBouncing, 2300);

                currentPin.setIcon(currentPin.image);
                currentPin.setAnimation(google.maps.Animation.BOUNCE);
                
                function stopBouncing() {
                    currentPin.setAnimation(null);
                }

            })
        })
    }
};

/////////next step --- figure out how to make markers/search
  /*  $("#searchBar").keypress(function(e) {
        model.markArr.forEach(function(markArrCopy){
            function timed() {
                var placeID = document.getElementById(markArrCopy.id);
                console.log(placeID);
                var disp = placeID.style.display === 'block';

                if(disp) {
                    markArrCopy.setMap(map);
                }
                else {
                    self.setMap(null);
                }
            };
            var timeoutId = window.setTimeout(timed, 200);
            console.log(markArrCopy.id);
        })
       /* if (e.keyCode == 13) {
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

        }*/

//    });


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


$("#searchBar").keypress(function(e) {
    console.log(filterList.render);
});


