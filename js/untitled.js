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