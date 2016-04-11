var Pin = function Pin(map, name, lat, lon, text) {
  var marker;

  this.name = ko.observable(name);
  this.lat  = ko.observable(lat);
  this.lon  = ko.observable(lon);
  this.text = ko.observable(text);

  marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lon),
    animation: google.maps.Animation.DROP
  });

  this.isVisible = ko.observable(false);

  this.isVisible.subscribe(function(currentState) {
    if (currentState) {
      marker.setMap(map);
    } else {
      marker.setMap(null);
    }
  });

  this.isVisible(true);
}