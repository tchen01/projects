  /*TODO:
Seperate into onload section and repeatedly called section
add button for vertical movement, remove swipe ability for that
-virtual buttons for horizonal???

get touch detection plugin working properly
  
CLEAN UP CODE
*/
var x = 0; 
var y = 0;
var maxh = $( ".section" ).length - 1; //sets max horizontal travel
var	maxv = $( ".section" ).eq( x ).children( ".subsec" ).length - 1; //sets max vertical travel
var hindpos = vindpos = 0;
var hindwidth = $( window ).width() / (maxh + 1);
var main_color = [ //indicator color
  'rgb(220,235,255)', //0
  'white', //1
  'red', //2
  'black', //3
  'rgb(220,235,255)', //4
  ]
var accent_1 = [ //light accent
  'rgb(65,110,165)', //0
  'rgb(220,235,255)', //1
  'green', //2
  'LightGrey', //3
  'rgb(220,235,255)', //4
  ]
var accent_2 = [ //indicator bg
  'rgb(50,55,70)', //0
  'grey', //1
  'blue', //2
  'LightGrey', //3
  'rgb(220,235,255)', //4
  ]

//get url hash and set initial position
for (i = 0; i < maxh + 1; i++) {
	id = $( ".section" ).eq( i ).attr('data');
	hash = window.location.hash.replace("#", "");

	if ( hash == id ) {
		x = i;
		break;
	}
}
draw();
hind();

$( window ).resize(function(){
	hind();
});


function hind(){
	$( "#hindholder>div" ).remove();
	hindwidth = $( window ).width() / (maxh + 1);
	for (var i = 0; i < maxh + 1; i++) { 
		$( "#hindholder" ).append("<div>" + $( ".section" ).eq( i ).attr('data') + "</div>");
	}
	$( "#hind, #hindholder>div" ).css({"width": hindwidth});
}


function vind(){
  //maybe not needed to run every time
  //have a resize detect function to reset all the height/withd stuff??
  var vindbottom = parseFloat($( '#vindholder' ).css( 'bottom' )) / parseFloat($( '#vindholder' ).css("font-size")) + 1;
	$( "#vindholder>div" ).remove();
	maxv = $( ".section" ).eq( x ).children( ".subsec" ).length - 1; //why do i has to do this??

	vindpos = maxv + vindbottom + y + "em";
	$( "#vind" ).css({ "bottom": vindpos }, speed);
	for (i = 0; i < maxv + 1; i++) { 
    $( "#vindholder" ).append("<div></div>");
	}
}


//custom easing function to reset y offset invisibly
$.easing.easeinJump = function(x, t, b, c, d) {
	if(t == d){
		return b + c;
	}
	else{
		return b;
	}
};
	
// changes frame in focus
// there is probably a lot of room for optimization here
var speed = 500;
function move( dir ) {

	maxv = $( ".section" ).eq( x ).children( ".subsec" ).length - 1; 

	if (dir == "right" || dir == 37){ //move left
		x = Math.max(x - 1, 0);
		y = 0;
		$( ".section" ).eq( x + 1 ).animate({ "top": 0}, speed, "easeinJump"); // switch this to do it on any draw
	}
	
	else if (dir == "left" || dir == 39){ //move right
		x = Math.min(x + 1, maxh);
		y = 0;
		$( ".section" ).eq( x - 1 ).animate({ "top": 0}, speed, "easeinJump");
	}
	
	else if (dir == "down" || dir == 38){
		y = Math.min(y + 1, 0);
	}
	
	else if (dir == "up" || dir == 40){
		y = Math.max(y - 1, -maxv);
	}

//prevents animations for piling up
	q = $( ".inner, .section, #hind, #vind" );
	if( q.queue( "fx" ).length > 1){
		q.stop( true, false);
	}
	draw();
	
}

  
function draw(){

  
	mar = -x + "00%"; // switch x to string of percent
	$( ".inner" ).animate({ "margin-left": mar }, speed);
	
	sea = y + "00%";
	$( ".section" ).eq( x ).animate({ "top": sea}, speed);
	
	//indicator stuff (what's the best place to put this stuff???)
	window.location.replace( "#" + $( ".section" ).eq( x ).attr('data') );

	hindpos = hindwidth * x + "px";
	$( "#hind" ).animate({ "left": hindpos }, speed);
	vind();

  //hides sections that are out of range so that they are not rendered
  //touch seems to lag with this but keyboard looks better with it
  
  //setTimeout(function() {$( ".section" ).css( "visibility", "hidden" )
  //  .eq( x ).css( "visibility", "visible" );}, speed); //le fix this
  //$( ".section" ).eq( x ).css( "visibility", "visible" );
      
  colorista([main_color[x]], {'#hind':['background'], '#vind':['background'], '#hindholder':['color'] });
  colorista([accent_2[x]], {'#vindholder>div':['background'], '#hindholder':['background']});
  colorista([accent_1[x]], {});
}


//INPUT HANDLERS

//indicator
$( "#hindholder" ).on("mousedown touchstart", "div", function( e ){
	x = $( this ).index();
	y = 0;
	draw();
});


$( "#vindholder" ).on("mousedown touchstart", "div", function( e ){
	y = -$( this ).index();
	draw();
});



//keyboard
$( document ).keydown(function( event ) {
	if( event.which >= 37 && event.which <= 40 ){ //conditional is not necessary but does it improve performance??
    move( event.which );
	}
});

//virtual buttons
$( "#left" ).click(function(){
	move("right");
});

$( "#right" ).click(function(){
	move("right");
});

$( "#intro" ).on("mouseup", function(){
	move("up");
});

$( "#share" ).click(function(){	
	console.log("some function here");
});

//touch and mouse
var mx = my = 0;
var xinit = 0;
var delx = 0;

var doc = new swipeArea( "body" );

//temporarily disable until swipe plugin is ready
/* doc.swipe({swipe:animate,
	threshold: 100, refresh: 30, }
); */

var dd = document.getElementById("dd")
//up down animations are really weird. need to block horizontal for vertical swipe.
//remove vertical move w/o keyboard??? -> but mobile
//virtual buttons?
function animate(direction, action, time, delta, zoom, pos){
  q = $( ".inner, .section, #hind, #vind" );
  dx = delta[0].x;
  dy = delta[0].y;

  dd.innerHTML = dx
  if( action == "move"){
		switch( direction ){
      case "left": $( ".section" ).eq( x + 1 ).css( "visibility", "visible" ); break;
      case "right": $( ".section" ).eq( x - 1).css( "visibility", "visible" ); break;

    }
    
    mx = Math.min(dx + ($( window ).width() * -x),0);
		hx = - mx / (maxh + 1);
    //how do i avoid lag on touch when touchmove isn't that often?
    //not really possible w/o forcing lag?
		$( ".inner" ).css({ "margin-left":  mx }); 
		$( "#hind" ).css({ "left":  hx }); 
    if( q.queue( "fx" ).length > 1){
		q.stop( true, false);
    
	}
	}
	if( action == "end"){
		//prevent side scrolling while scrolling overflow text
		if(time > 300 && (direction == "up" || direction == "down")){ // check for overflowing element rather than do this??? 
    draw();
		}
		else {console.log("time=" + time); move( direction );}
	}
	}








