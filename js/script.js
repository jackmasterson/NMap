
var map;
var geocoder; 
var address= "Sea Girt, NJ";
      function initMap() {
      	geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.1407959, lng: -74.025581},
          zoom: 12
        });
    };
     

      	function Search() {
      		var bar = '<input></input>'
      		$('body').append(bar);
      	};
      	Search();

