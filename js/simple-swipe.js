;(function(undefined) {
  'use strict';

  var swipeArea = function( selector ) {
    //Special thanks to Jesse Mu
    this.elements = document.querySelectorAll( selector );
  }
  
  //need new names for stuff. 
  swipeArea.prototype.swipe = function( options ){
    //initialize variables
    //i'm probably doing something wrong if i have to do this?
    var elements = this.elements;
    var x_init, y_init, tinit, dt, tfin, dx, dy; 
    var distance, direction, action, interval;
    var touch_init = [], touches = [], touchcount = 0;
    var mx, my, md, mh, zoom = 1;
    
    var defaults = {
      //change swipe to only when swiping, add constant function?
      swipe: function(){},
      swipe_r: function(){}, //should these be able to have parameters?
      swipe_l: function(){},
      swipe_u: function(){},
      swipe_d: function(){},
      tap: function(){},
      doubletap: function(){}, //not implemented well
      longtap: function(){},
      times: [150, 75], //longtouch, doubletap
      threshold: 200,
      refresh: 50,
      ratio: 1 
    };
    
    
    function merge(a, b) {
      var m = {};
      for (var attrname in a) m[attrname] = a[attrname];
      for (attrname in b) m[attrname] = b[attrname];
      return m;
    }
    
    var param = merge(defaults, options);
    
    function addListener(e, f){
      var evts = e.split(" "), i, j; //why do i have to put i, j here???
      for(i=0;i<evts.length;i++){
        for(j=0;j<elements.length;j++){
          elements[j].addEventListener(evts[i], f);
        }
      }
    }
    
    function removeListener(e, f){
      var evts = e.split(" "), i, j;
      for(i=0;i<evts.length;i++){
        for(j=0;j<elements.length;j++){
          elements[j].removeEventListener(evts[i], f);
        }
      }
    }
    
    addListener('mousedown touchstart', swipe_start);
    // addListener('mouseup touchend', swipe_end); //only detects end if end is on swipearea
    addListener('mouseup touchend', swipe_end);
    window.addEventListener('mouseup', exit); 
    window.addEventListener('touchend', exit); 

    
    function swipe_start(e, i){
      action = e.type;

      if( action == 'mousedown' ){
        touch_init[0] = {x: e.clientX, y: e.clientY};
      } else if (action == 'touchstart') {
          var tt = e.targetTouches; 
          //do we need more touches?
          if(touch_init.length < 2){
          touch_init.push( {x: tt[tt.length - 1].clientX, 
                           y: tt[tt.length - 1].clientY} )
          }
        }
      x_init = touch_init[0].x;
      y_init = touch_init[0].x;
      //console.log(touch_init);
      tinit = getms();
      action = "start";
      
      if( touch_init.length > 1){
          mx = touch_init[1].x - touch_init[0].x;
          my = touch_init[1].y - touch_init[0].y;
          mh = Math.sqrt( mx * mx + my * my );
        }
        
      addListener('mousemove touchmove', swipe_move);
//      document.addEventListener('mousedown', escape); why were these here?
//      document.addEventListener('touchstart', escape);

      escape();
      interval = setInterval(function() {
        dt = getms() - tinit;
        direction = dir(dx, dy);
        param.swipe(direction, action, dt, dx, dy, zoom, x_init, y_init);
        }, param.refresh);
    }
    
    function swipe_move(e, i){
      action = e.type; //why use this var?
      touches = [];
      if (x_init !== 0) {
        if (action == 'mousemove') {
          touches[0] = {x: e.clientX, y: e.clientY};
        } else if (action == 'touchmove') {
          var tt = e.targetTouches;//console.log(tt);
          for(i=0; i<tt.length; i++){
            touches[i] = {x: tt[i].clientX, 
                          y: tt[i].clientY}
          } 
          }
        
        touchcount = touches.length;  
        //console.log(touches, touch_init[0]);
        dx = touches[0].x - touch_init[0].x;
        dy = touches[0].y - touch_init[0].y;
        console.log(dx, dy)
        
        //multi touch stuff ( rotation, pinch zoom)
        if( touchcount > 1){
          mx = touches[1].x - touches[0].x;
          my = touches[1].y - touches[0].y;
          md = Math.sqrt( mx * mx + my * my );
          zoom = md / mh;
          //console.log( zoom );
        }
      }
      action = "move";
      
    }
    /* THIS NEEDS TO BE IMPROVED ALOT
        if mouseup is off element something needs to happen
        tap detection needs improved*/
    function swipe_end(e){
      action = e.type; //why is this here?
      e.stopPropagation();
      action = "end";
      if(  touchcount>1 ){ 
        console.log("keep goin'");
      }
      else{
        console.log("stop!");
        direction = dir(dx, dy);
        switch( direction ){
            case "right": param.swipe_r(); break; //need parameters??
            case "left": param.swipe_l(); break;
            case "up": param.swipe_u(); break;
            case "down": param.swipe_d(); break;
            case "cancel":  
              if ( tinit - tfin < param.times[1]){
                console.log("doubletap");
                param.doubletap();
              } else if ( dt > param.times[0]) {
                console.log("longtap");
                param.longtap();
              } else  { //avoid tap on first click of doubletap?
                console.log("tap");
                param.tap();
              }
            break;        
          }
          reset();
          param.swipe(direction, action, dt, dx, dy, zoom, x_init, y_init);

          removeListener('mousemove touchmove', swipe_move);
          addListener('mousedown touchstart', swipe_start);
//          document.removeEventListener('mousedown', escape);
//         document.removeEventListener('touchstart', escape);

          escape();
        }
    }
    function reset(){
      tfin = getms();
      x_init = y_init = 0;
      dx = dy = 0;
      touch_init = [];
      touches = [];
      touchcount = 0;
      mx = my = mh = 0;
      zoom = 0;
      console.log( direction )
    }
    
    function exit(){
      reset();
      action = "exit";
      direction = "cancel";
    }
    
    function escape() {
      document.removeEventListener('mousedown', escape);
      document.removeEventListener('touchstart', escape);
      clearInterval(interval);
    }

    function getms() {
      return new Date().getTime();
    }

    function dir(x, y) {
      distance = x * x + y * y;
      //theta = Math.atan2(y, x);
      var xy = Math.abs(x / y);
      console.log( action )
      if (action == "end" && distance < param.threshold * param.threshold) {
        return "cancel";
      } 
      else if (xy > param.ratio) {
          if (x < 0) return "left";
          else return "right";
        } else {
          if (y > 0) return "down";
          else return "up";
        }      
    }
  }


  if (this.swipeAea)
    throw 'noob';
  this.swipeArea = swipeArea;
  
}).call(this);
