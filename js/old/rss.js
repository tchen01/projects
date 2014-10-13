
	
(function ( $ ) {
	$.fn.swipe = function ( func, options ){
	
	//some values and stuff
	//this can be cleaned up i'm guessing
	var xinit = yinit = 0;
	var dx = dy = 0;
	var mx = my = 0;
	var theta = null;
	var distance = 0;
	var direction = action = interval = null;
	var PI = 3.141592;

	//default parameters
	var param = $.extend({
		threshold: 200
	}, options);
	
	//why use jQuery?
	$( this ).on( 'mousedown touchstart', touchstart);
	//mouse move in mouse down
	$( this ).on( 'mouseup touchend touchcancel', end);

	function touchstart(e){
		action = e.type;

		if(action == 'mousedown'){
			xinit = e.clientX;
			yinit = e.clientY;
		}
		else if( action == 'touchstart'){
			xinit = e.originalEvent.targetTouches[0].clientX; 
			yinit = e.originalEvent.targetTouches[0].clientY;                             
			el = document.elementFromPoint(xinit, yinit);
		};
		
		action = "start"
		
		$( this ).on( 'mousemove touchmove', move);
		interval = setInterval(function(){
			console.log("fdsa");
			func(direction, action, dx, dy, xinit, yinit);
		}, 15);
	}

	function move(e){
		action = e.type;
		
		$( "div" ).css("marginLeft", dx + 300);

		if( xinit != 0){
			
	//		console.log(e.type);
			if(action == 'mousemove'){
				dx = e.clientX - xinit;
				dy = e.clientY - yinit;
			}
			else if( action == 'touchmove'){
				dx = e.originalEvent.targetTouches[0].clientX - xinit;
				dy = e.originalEvent.targetTouches[0].clientY - yinit;
			}
		}
		action = "move"
	//	func(direction, action, dx, dy, xinit, yinit);
	}

	function end(e){
		action = e.type;

		var direction = dir(dx, dy)

		xinit = yinit = 0;
		dx = dy = 0;
	//this prevents mousemove from always happening
	$( this ).off( 'mousemove touchmove', move);

	action = "end"
	clearInterval( interval );

	func(direction, action, dx, dy, xinit, yinit);
	}

	function dir(dx, dy){
		distance =  dx * dx + dy * dy
		theta = Math.atan2(dy, dx);

		if( distance > param.threshold * param.threshold){
			if(  -PI/4 < theta && theta < PI/4 ){
				return "right"
			}
			else if( PI/4 < theta && theta < 3*PI/4 ){
				return "down"
			}
			else if( 3*PI/4 < theta || theta < -3*PI/4 ){
				return "left"
			}
			else if(-PI/4 > theta && theta > -3*PI/4 ){
				return "up"
			}
		}
		else return "cancel";
	}
	
	
	
	};

}( jQuery ));

$( document ).swipe(function(direction, action, dx, dy, xinit, yinit){
		$( "h1" ).text( dx );
	},
	{threshold: 10}
);

/* USE AND STUFF

$( document ).swipe({
	threshold: 10
});

*/




