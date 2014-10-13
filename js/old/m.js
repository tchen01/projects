// how can i make mobile swipes like keyboard events? > QuoJS ???


$(window).onload(function(){ // or replace this with window.onload for that matter
      // Your code here, e.g.
      $("document").on("vmousedown", function() { 
        alert("down");
      });
      // CAUTION: this won't work (see note below):
      // $("#button_img").vmousedown(function(){/*whatever*/}); // WON'T WORK
    });
	
$( document ).bind("vmousedown", function(e){
	alert("down");
});	
//works but how to swipe?

var x = 0; 
var y = 0;
var maxh = $( ".section" ).length - 1; //sets max horizontal travel
var	maxv = $( ".section" ).eq( -x ).children( ".subsec" ).length - 1; //sets max vertical travel

$(document).keyup(function(event) {
	var key = event.which;
	maxv = $( ".section" ).eq( -x ).children( ".subsec" ).length - 1; 

	if(key == 37) { // Left arrow key
		x = Math.min(x + 1, 0);
		y = 0;
	};
	
	if(key == 39) { //Right arrow key       
		x = Math.max(x - 1, -maxh)
		y = 0;
	};
				
	if(key == 38) { //Up arrow key
		y = Math.min(y + 1, 0);
	};
	
	if(key == 40) { //Down arrow key
		y = Math.max(y - 1, -maxv)
	};

	var mar = x + "00%"; // switch x to string of percent
	$( ".inner" ).animate({ "margin-left": mar }, 300);
	
	var sea = y + "00vh"
	$( ".section" ).animate({ "margin-top": sea}, 300);
	
});

$(".subsec").swipe({
  swipe:function(event, direction, distance, duration, fingerCount) {	
	maxv = $( ".section" ).eq( -x ).children( ".subsec" ).length - 1; 

	if(direction == "right") { // Left arrow key
		x = Math.min(x + 1, 0);
		y = 0;
	};
	
	if(direction == "left") { //Right arrow key       
		x = Math.max(x - 1, -maxh)
		y = 0;
	};
				
	if(direction == "down") { //Up arrow key
		y = Math.min(y + 1, 0);
	};
	
	if(direction == "up") { //Down arrow key
		y = Math.max(y - 1, -maxv)
	};

	var mar = x + "00%"; // switch x to string of percent
	$( ".inner" ).animate({ "margin-left": mar }, 300);
	
	var sea = y + "00vh"
	$( ".section" ).animate({ "margin-top": sea}, 300);
	

  },
});

//So much of the conditionals are duplicates. Might be easier to pass direction to a separate function
//or make functions for each movement
//that way i can add software buttons easily
//make it so that the swiping changes margin live so you see it moving