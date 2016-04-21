
var myViewModel = {
    personName: 'Bob',
    personAge: 123
};


//creates the 'places' observable Array, which contains all the needed
//information I'll be using to create the markers, infowindows, list items,
//etc

var model = {
	currentMark: null,
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
	],
	admin: ['Name', 'Counter']
};

var octopus = {
	init: function() {
		model.currentMark = model.places[0];
		console.log(model.currentMark);
		markListView.init();
		markView.init();
		AdminView.init();
	},

	getCurrentMark: function() {
		//the problem is right here ***********--------------//////
		console.log(model.currentMark);
		return model.currentMark;

	},

	getMarks: function() {
		console.log(model.places);
		return model.places;
	},

	adminInfo: function() {
		return model.admin;
	},

	setCurrentMark: function(mark) {
		console.log(model.currentMark);
		model.currentMark = mark;
		console.log(mark);
	},

    incrementCounter: function() {
        markView.render();
    }

};


var markView = {

	init: function() {
		this.markElem = document.getElementById('mark');
		this.markNameElem = document.getElementById('mark-name');
		this.markImageElem = document.getElementById('mark-img');
		this.countElem = document.getElementById('mark-count');

		this.markImageElem.addEventListener('click', function(){
            octopus.incrementCounter();
        });

		this.render();
	},

	render: function() {
		var currentMark = octopus.getCurrentMark();
		this.countElem.textContent = currentMark.clickCount;
		this.markNameElem.textContent = currentMark.title;
		this.markImageElem.src = currentMark.src;
	}
};

var AdminView = {

	init: function() {
		this.AdminElem = document.getElementById('admin');
		this.SaveElem = document.getElementById('saveButton');
		this.HiddenAdmin = document.getElementById('hiddenAdmin');
		this.inputDiv = document.getElementById('inputDiv');
		this.inputElem = document.getElementById('input');

		this.render();
	},

	render: function() {
		var buttons, i, elem, elemHead, nameElem;
		var admin = octopus.adminInfo();

		this.inputDiv.innerHTML = '';
		this.inputElem.innerHTML = '';
		var currentMark = octopus.getCurrentMark();

		for(i=0;i<admin.length;i++){

            admins = admin[i];
  
            elem = document.createElement('input');
            elem.className = 'input-class';

            elem.setAttribute('id', admins);
            elemHead = document.createElement('h3');
            elemHead.textContent = admins;

            this.inputDiv.appendChild(elemHead);
            this.inputDiv.appendChild(elem);
        }

        nameElem = document.getElementById('Name');
        	nameElem.value = currentMark.title;



        nameElem.onkeyup = function() {
        	var nameVal = nameElem.value;
        }


        Save = function() {
        	document.getElementById('mark-name')
        		.innerHTML = nameElem.value;
        };

        document.getElementById('saveButton').onclick = Save;

        $('#adminButton').click(function() {
        	$('#hiddenAdmin').toggle();
        });
        $('#saveButton').click(function() {
        	$('#hideAdmin').hide();
        });
	}
};

var markListView = {

	init: function() {
		this.markListElem = document.getElementById('mark-list');

		this.render();
	},

	render: function() {
		var mark, elem, i;

		var marks = octopus.getMarks();


		this.markListElem.innerHTML = '';

		for(i=0; i<marks.length; i++){
			mark = marks[i];


			elem = document.createElement('li');
			elem.textContent = mark.title;

			elem.addEventListener('click', (function(markCopy) {
				console.log(markCopy);
				return function() {
					octopus.setCurrentMark(markCopy);
					markView.render();
					AdminView.render();
				};
			})(mark));

			this.markListElem.appendChild(elem);
		}
	}
};

octopus.init();






 
