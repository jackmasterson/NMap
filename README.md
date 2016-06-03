Neighborhood Map - Asbury Park, NJ

What is it?
-----------

An interactive map of Asbury Park, NJ powered by the Google Maps API. The app utilizes the MVVM layout and uses KnockoutJS to help organize and simplify code. The map includes 5 locations with 5 corresponding markers/pins that animate when either the marker or the location name in the list view is clicked. 

The markers bounce for a moment and change to a different icon once activated, then change back when another is clicked (The bar changes to a beer icon, the arcade to a Pacman, the pizza place to a slice, etc).

When one of these items is clicked, an info-window div pops up with unique information about each location.

There is a search bar in the list view, where you can type keywords or the name of a place and, once you hit enter, it will filter the list and markers. To clear, empty the search bar and hit enter again.


APIs
----

Google Maps API provides the maps, markers, marker animation.

Foursquare provides data for each individual location: name, address, website and twitter (if available), and Foursquare web page under the 'More Info' link.

JamBase provides the live music information for upcoming concerts in the area as well as a link to the online ticket purchase site if one is available.

Socrata Open Data Network provides the 2013 Census information for Asbury Park, NJ.

Magic Seaweed provides the local surf conditions information - wave height, wind and swell info and charts, etc. 

Installation
------------

Download or fork the application from:

	[https://github.com/jackmasterson/NMap];

Select index.html to start the app.

To Use
------

Click on any of the markers to animate them, show their individual info-div,
and to pull up a search bar and list view. Clicking the location name in the list view will likewise animate the corresponding marker/info-div.

The search bar in the list view filters the items based on hard-coded keywords that will autofill as you type. If you click on one of the autofill options, click enter twice to filter both the list and the markers.

Clicking any of the PNGs at the top will toggle the view of a part of the app. The magnifying glass toggles the list view/info-div, the microphone will animate a slideout bar that contains info on upcoming live music in the area using the JamBase API. The bar graph will pull up Census data using Socrata Open Data Network API. The surfer pulls up local surf conditions including water temp, wave height, wind and swell charts, and more.

After a certain number of requests per 24hr period, the JamBase API request will fail. That can be remedied by getting your own key at 

	[http://developer.jambase.com/];

The API requests all have a built in Fail function so that if the requests do in fact fail, a message will appear in place of the desired information explaining that there was a problem on our end.





