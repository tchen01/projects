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
    var x, y, x_init, y_init, tinit, dt, tfin, dx, dy; 
    var distance, direction, action, interval;
    var touch_init = [], touches = [], delta = [], ids = [], touchcount = 0;
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
    
    var param = merge(defaults, options);
    
    
    addListener('mousedown touchstart', swipe_start);
    // addListener('mouseup touchend', swipe_end); //only detects end if end is on swipearea
    addListener('mouseup touchend', swipe_end);
    window.addEventListener('mouseup', exit); 
    window.addEventListener('touchend', exit); 

    
    function swipe_start(e, i){
      action = e.type;

      if( action == 'mousedown' ){
        touch_init[0] = {x: e.clientX, y: e.clientY};
      } 

      else if (action == 'touchstart'){
        var tt = e.targetTouches;
        var ct = e.changedTouches;
        //assumes only one changed touches...
        //patch later
        var id = ct[0].identifier;
        // console.log("ct" +  ct[0].identifier );
        // console.log("tt" + tt)
        ids.push(id);
        console.log( ids );
        //not this simple because we don't want to reset everything when we have a new touch...
        touch_init.push( {
          id: tt[tt.length-1].identifier,
          x: tt[tt.length-1].clientX, 
          y: tt[tt.length-1].clientY
          });
        for(i=0; i<tt.length; i++){
          touches[i] = {
            id: tt[i].identifier,
            x: tt[i].clientX, 
            y: tt[i].clientY
          }
            
          delta[0] = {
            id: tt[i].identifier,
            x: touches[0].x - touch_init[0].x,
            y: touches[0].y - touch_init[0].y
          }
        }
      //  touches = touch_init;
      }
      
      // x_init = touch_init[0].x;
      // y_init = touch_init[0].y;
      // console.log(touch_init);
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
      zoom = 0;
      escape();
      // Why does swipe_move have to run?
      // If it doesn't then a tap will never end the interaval...
      swipe_move(e, i);
      interval = setInterval(function() {
      
      // dt as array?
        dt = getms() - tinit;
        direction = dir(delta[0].x, delta[0].y);
        // console.log( touches, delta[0] )  
        param.swipe(direction, action, dt, delta, zoom, touches);
        }, param.refresh);
    }
    
    function swipe_move(e, i){
      action = e.type; //why use this var?
      e.preventDefault();

      touches = [];
      delta = [];
      //if (x_init !== 0) {
      if (action == 'mousemove') {
        touches[0] = {x: e.clientX, y: e.clientY};
        delta[0] = {
            x: touches[0].x - touch_init[0].x,
            y: touches[0].y - touch_init[0].y}
      }
      else if (action == 'touchmove'){
        var tt = e.targetTouches;
        for(i=0; i<tt.length; i++){
          touches[i] = {
            id: tt[i].identifier,
            x: tt[i].clientX, 
            y: tt[i].clientY}
        
          delta[i] = {
            id: tt[i].identifier,
            x: touches[i].x - touch_init[i].x,
            y: touches[i].y - touch_init[i].y}
        } 
      }
      touchcount = touches.length;  
      
      //multi touch stuff ( rotation, pinch zoom)
      if( touchcount > 1){
        mx = touches[1].x - touches[0].x;
        my = touches[1].y - touches[0].y;
        md = Math.sqrt( mx * mx + my * my );
        zoom = md / mh;
        // console.log( "zoom: "+ zoom );
      }
      //}
      action = "move";
      
    }
    /* THIS NEEDS TO BE IMPROVED ALOT
        if mouseup is off element something needs to happen
        tap detection needs improved*/
    function swipe_end(e){
      console.log("end!!!");
      action = e.type; //why is this here?
      e.stopPropagation();
      
      if(action == "touchend"){
        var ct = e.changedTouches;
        //assume only one changed touches...
        var id = ct[0].identifier;
        var index = ids.indexOf( id );
        ids.splice(index, 1); //THIS IS WEAR To TEST.
        console.log( ids );
        touch_init.splice(index, 1);
        console.log(touch_init);  
      }
        // touc_init
      action = "end";
      if(  touchcount>1 ){ 
        console.log("keep goin'");
      }
      else{
        console.log("stop!");
        direction = dir(delta[0].x, delta[0].y);
        switch( direction ){
            case "right": param.swipe_r(); break; //need parameters??
            case "left": param.swipe_l(); break;
            case "up": param.swipe_u(); break;
            case "down": param.swipe_d(); break;
            case "cancel":  
              if ( tinit - tfin < param.times[1]){
                //console.log("doubletap");
                param.doubletap();
              } else if ( dt > param.times[0]) {
                console.log("longtap");
                //param.longtap();
              } else  { //avoid tap on first click of doubletap?
                //console.log("tap");
                param.tap();
              }
            break;        
          }
          param.swipe(direction, action, dt, delta, zoom, touches);
          reset();

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
      ids = [];
      touchcount = 0;
      mx = my = mh = 0;
      zoom = 0;
      //console.log( direction )
    }
    
    function exit(){
      reset();
      escape();
      action = "exit";
      direction = "cancel";
    }
    
    function escape() {
      document.removeEventListener('mousedown', escape);
      document.removeEventListener('touchstart', escape);
      console.log( "clear interval");
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
