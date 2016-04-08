var beers = [
  {name:"Blue", brewery:"Man", style:"Group"},
  {name:"Purple", brewery:"Is", style:"Cool"}
  // …
];

var viewModel = {
  beers: ko.observableArray(beers),
  query: ko.observable(''),
    search: function(value) {
    // remove all the current beers, which removes them from the view
    viewModel.beers.removeAll();

    for(var x in beers) {
      if(beers[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        viewModel.beers.push(beers[x]);
      }
    }
  }
};

viewModel.query.subscribe(viewModel.search);


ko.applyBindings(viewModel);