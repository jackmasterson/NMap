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

JamBase provides the live music information for upcoming concerts in the area as well as a link to the online ticket purchase site if one is available.

Socrata Open Data Network provides the 2013 Census information for Asbury Park, NJ.

Magic Seaweed provides the local surf conditions information - wave height, wind and swell info and charts, etc. 

Installation
------------

Clone the repo from GitHub at 

	[https://github.com/jackmasterson/NMap]

Source Code
-----------

The minified code is available in the repo, or at the link below: 
	[]


