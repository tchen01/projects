//drag handler 
//WHY NO WORK ON MOBILE?????


/* LEL get obsoleted
$( document ).bind( "vmousedown touchstart mousedown", function(e){
		xinit = event.pageX;
		yinit = event.pageY;

});


$( document ).bind( "vmousemove touchmove mousemove", function(e){
	$( "p:first" ).text("init=(" + xinit + "," + yinit + "), del=(" + delx + "," + dely + "), mx=(" + mx + "," + my + "), ep=(" + event.pageX + "," + event.pageY +")");
//	$( "p:first" ).text(mx + "," + delx);

	
	if( xinit != 0){
	delx = event.pageX - xinit;
	dely = event.pageY - yinit;
	mx = Math.min(delx + ($( document ).width() * x),0);
	
	$( ".inner" ).css({ "margin-left":  mx });
//	$( ".section" ).eq( -x ).css({ "margin-top": my}, 0); // this breaks horizontal scroll to next section
	}
	
});

$( document ).bind( "vmouseup touchend mouseup", function(e){
	
		if( delx > threshold){
			move("left");
		}
		
		else if( delx < -threshold){
			move("right");
		}
		
		else if( dely > threshold){
			move("up");
		}
		
		else if( dely < -threshold){
			move("down");
		};
		
		move( "reset" );		
		xinit = yinit = 0;
		delx = dely = 0;

	});
*/