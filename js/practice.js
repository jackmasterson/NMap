/*var model = {
  initMap: initMap(),

}*/
var map;
var places = ko.observableArray([ 
  {
    position: {lat: 40.216147, lng: -74.012914},
    title: 'Johnny Mac House of Spirits',
    address: '208 Main St, Asbury Park, NJ 07712',
    src: 'img/macs.jpg',
    nums: 1,
    icon: null,
    marker: marker = [],
    href: 'http://www.johnnymacbar.com/',
    visible: true
  }, {
    position: {lat: 40.220001, lng: -74.000947},
    title: 'The Stone Pony',
    address: '913 Ocean Ave, Asbury Park, NJ 07712',
    src: 'img/pony.jpg',
    nums: 2,
    icon: null,
    marker: marker = [],
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
    href: 'https://en.wikipedia.org/wiki/Asbury_Park_Convention_Hall',
    visible: true
  }         
]);
  function makeMark() {
      for(i in places()){
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
      var markOpts = {
        position: pos,
        map: map,
        animation: google.maps.Animation.DROP,
        content: infoContent.contents,
        icon: null
      }
      var marker = new google.maps.Marker(markOpts);
  //    marker.setMap(map);
  };
};

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
      makeMark();
      
};


var viewModel = {
  self: this, 
  initMap: initMap,
  //marks: makeMark(),
  place: ko.observable(places()),
  //searched: searched(),
  query: ko.observable('')
};

viewModel.place = ko.computed(function() {
    var search = this.query().toLowerCase();
    console.log(search);
    console.log(places,'Good');

    return ko.utils.arrayFilter(places(), function(spot) {
      console.log(spot.title.toLowerCase());
        return spot.title.toLowerCase().indexOf(search) >= 0;
    });
}, viewModel);