(function ($) {
    'use strict';

    $.fn.swipe = function (options) {

        //some values and stuff
        //this can be cleaned up i'm guessing
        var xinit = yinit = 0;
        var tinit = dt = tfin = 0;
        var dx = dy = 0;
        var distance = 0;
        var direction = action = interval = null;

        //default parameters
        var param = $.extend({
            swipe: function(){},
			swipe_r: function(){},
			swipe_l: function(){},
			swipe_u: function(){},
			swipe_d: function(){},
			tap: function(){},
			doubletap: function(){}, //how to do?
			longtap: function(){},
			times: [150, 75], //longtouch, doubletap
			threshold: 200,
            refresh: 15, //refresh rate in ms
            ratio: 1 // is this even working?
        }, options);

        //why use jQuery?
        $(this).one('mousedown touchstart', touchstart);
		$(this).on('mouseup touchend touchcancel', end);
				

        function touchstart (e) {
            action = e.type;

            if (action == 'mousedown') {
                xinit = e.clientX;
                yinit = e.clientY;
            } else if (action == 'touchstart') {
                xinit = e.originalEvent.targetTouches[0].clientX;
                yinit = e.originalEvent.targetTouches[0].clientY;
                el = document.elementFromPoint(xinit, yinit);
            };
            tinit = getms();

            action = "start"

            $(this).on('mousemove touchmove', move);
            $(document).one('keydown', escape);
            escape();
			interval = setInterval(function() {
				console.log( "interval") 
                dt = getms() - tinit;
				direction = dir(dx, dy)
                param.swipe(direction, action, dt, dx, dy, xinit, yinit);
            }, param.refresh);
        }

        function escape() {
			console.log("escape");
            clearInterval(interval);
        }

        function getms() {
            return new Date().getTime();
        }

        function move(e) {

            action = e.type;

            if (xinit != 0) {

                if (action == 'mousemove') {
                    dx = e.clientX - xinit;
                    dy = e.clientY - yinit;
                } else if (action == 'touchmove') {
                    dx = e.originalEvent.targetTouches[0].clientX - xinit;
                    dy = e.originalEvent.targetTouches[0].clientY - yinit;
                }
            }

            action = "move"
        }

        function end(e) {
            action = e.type;
			
			//RUN TEST FOR EVENTS HERE
			
			//trade ease of use for size of program?
			if (direction == "right") param.swipe_r()
			else if (direction == "left") param.swipe_l()
			else if (direction == "up") param.swipe_u()
			else if (direction == "down") param.swipe_d()
			

			if (direction == "cancel"){//best way to check no move??
				if ( tinit - tfin < param.times[1]){
					console.log("doubletap");
					param.doubletap();
				}
				
				// longtap
				else if ( dt > param.times[0]) {
					console.log("longtap");
					param.longtap();
				}
			
				else  { //avoid tap on first click of doubletap?
					console.log("tap");
					param.tap();
				}
				
				
			}
			
			
			tfin = getms();
            xinit = yinit = 0;
            dx = dy = 0;
	
            //this prevents mousemove from always happening
            $(this).off('mousemove touchmove', move);

            action = "end";
            

            param.swipe(direction, action, dt, dx, dy, xinit, yinit);
            $(this).one('mousedown touchstart', touchstart);
            $(document).off('keydown', escape);
			console.log("end");
			escape();
        }


        function dir(dx, dy) {
            distance = dx * dx + dy * dy
            theta = Math.atan2(dy, dx);
            xy = Math.abs(dx / dy);

            if (distance > param.threshold * param.threshold) {
                if (xy > param.ratio) {
                    if (dx > 0) return "left"
                    else return "right"
                } else {
                    if (dy > 0) return "down"
                    else return "up"
                }
            } else return "cancel"
        }

    };

}(jQuery));