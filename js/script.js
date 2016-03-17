



      function initMap() {
      	var mapDiv = document.getElementById('map');

      	
        var map = new google.maps.Map(mapDiv, {
          center: {lat: 40.220391, lng: -74.012082},
          scrollwheel: false,
          zoom: 14
        });


  var marker = new google.maps.Marker({
    			position: {lat: 40.216147, lng: -74.012914},
			title: 'Johnny Mac House of Spirits',
			map: map,
  });


    };

var	initialPlaces =  [
		 {
			position: {lat: 40.216147, lng: -74.012914},
			title: 'Johnny Mac House of Spirits',
			map: map,
			address: '208 Main St, Asbury Park, NJ 07712'

		}, {
			position: {lat: 40.220001, lng: -74.000947},
			title: 'The Stone Pony',
			map: map,
			address: ['913 Ocean Ave, Asbury Park, NJ 07712']
		}
	];


	
	

var Place = function(data) {
	this.position = ko.observable(data.position);
	this.title = ko.observable(data.title);
	this.map = ko.observableArray(data.map);
	this.address = ko.observableArray(data.address);

		this.title = ko.computed(function(){
		var title;
		var clicks = this.clickCount();
		if(clicks<10) {
			title = 'Newborn';
		} else if (clicks<50) {
			title = 'Infant';
		}
		return title;
	}, this);
};

var ViewModel = function() {

	var self = this;

	this.placeList = ko.observableArray([]);

	initialPlaces.forEach(function(placeItem){
		self.placeList.push( new Place(placeItem) );
	})

	this.currentPlace = ko.observable( this.placeList()[0] );








	this.setPlace = function(clickedPlace) {
		self.currentPlace(clickedPlace);
	};
};

ko.applyBindings(new ViewModel());








