window.onload = init;

function init(){
    
    var BODY = document.body;
    
    function _(ID){return document.getElementById(ID);}
    
    var CONTAINER = _('fullscreen_background_image');
    var FREQUENCY_VALUE;
    
/*############################################################################################################################*/
    
    var patch
        $.get('patches/firstPatch.pd', function(patchStr) {
          patch = Pd.loadPatch(patchStr)
    })
        
	Pd.start();
/*############################################################################################################################*/
    
//TOGGLE FULLSCREEN
    function toggle_fullscreen(ELEMENT) {
      ELEMENT = ELEMENT || document.documentElement;
      if (!document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) 
      {if(ELEMENT.requestFullscreen){ELEMENT.requestFullscreen();} 
        else if(ELEMENT.msRequestFullscreen){ELEMENT.msRequestFullscreen();} 
        else if(ELEMENT.mozRequestFullScreen){ELEMENT.mozRequestFullScreen();} 
        else if (ELEMENT.webkitRequestFullscreen){ELEMENT.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);}} 
        else {if(document.exitFullscreen){document.exitFullscreen();}
        else if (document.msExitFullscreen){document.msExitFullscreen();} 
        else if (document.mozCancelFullScreen){document.mozCancelFullScreen();} 
        else if (document.webkitExitFullscreen) {document.webkitExitFullscreen();}}}

    document.addEventListener('keydown', function(e){if (e.keyCode == 70){toggle_fullscreen(BODY);}}, false);
    
/*############################################################################################################################*/
    
//RESIZE FUNCTION
    var WINDOW_INNERWIDTH, WINDOW_INNERHEIGHT;
    function resize(){
        WINDOW_INNERWIDTH = window.innerWidth; 
        WINDOW_INNERHEIGHT = window.innerHeight;}
    window.addEventListener('resize', resize, false);
    window.addEventListener('orientationchange', resize, false);
    resize();
    
//MAP
    function getProportionalValue(VARIABLE1, MIN1, MAX1, MIN2, MAX2){
        return MIN2 + (MAX2 - MIN2) * ((VARIABLE1 - MIN1)/(MAX1 - MIN1));}
    
//RETURN RANDOM
    function returnRandom(MIN, MAX){return Math.floor(Math.random() * (MAX - MIN + 1) + MIN);}
    
/*############################################################################################################################*/
    
//VEHICLE OBJECT
    function Fly(){
        
        this.position = new Vector(500, 400);
        
        this.fly = document.createElement('DIV');
        this.fly.className = 'fly';
        this.flyWidth = 50;
        this.flyHeight = 50;
        
        this.fly.style.top = this.position.y - this.flyHeight/2;
        this.fly.style.left = this.position.x - this.flyWidth/2;
        this.fly.style.width = this.flyWidth;
        this.fly.style.height = this.flyHeight;
        
        this.randomAngle;
        this.angle;
        this.rotationValue;
        this.currentStep = new Vector();
        this.lastAngle = Math.random() * Math.PI * 2;
        this.nextPosition;
        this.vectorLength = 20;
        
        this.walkTime = returnRandom(5000, 10000);
        this.pauseTime = returnRandom(2000, 3000);
        this.walking = false;
        
        CONTAINER.appendChild(this.fly);
        
    /*####################################################################*/
        
    //GET NEXT POSITION
        this.getNextPosition = function(){
            
            //Hier Radians drauf geben keine Grad!
            this.randomAngle = returnRandom((this.lastAngle - Math.PI/10), (this.lastAngle + Math.PI/10));
            
            this.currentStep.x = Math.cos(this.randomAngle) * this.vectorLength;
            this.currentStep.y = Math.sin(this.randomAngle) * this.vectorLength; 
            
        //STAY WITHIN SCREEN
            if(this.position.x + this.currentStep.x < this.flyWidth/2 || 
               this.position.x + this.currentStep.x > (WINDOW_INNERWIDTH - this.flyWidth/2)){
                this.currentStep.x *= -1;
                this.randomAngle = Math.acos(this.currentStep.x/this.vectorLength);
                this.currentStep.y = Math.sin(this.randomAngle) * this.vectorLength; 
            }
            if(this.position.y + this.currentStep.y < this.flyHeight/2 || 
               this.position.y + this.currentStep.y > (WINDOW_INNERHEIGHT - this.flyHeight/2)){
                this.currentStep.y *= -1;
                this.randomAngle = Math.asin(this.currentStep.y/this.vectorLength);
                this.currentStep.x = Math.cos(this.randomAngle) * this.vectorLength;
            }
            
        //GET NEXT POS VALUES
            this.nextPosition.x = this.position.x + this.currentStep.x;
            this.nextPosition.y = this.position.y + this.currentStep.y; 
        }
        
    /*####################################################################*/
        
    //GET SOUND VALUES (Proportional zur X-Achse)
        this.setSoundValues = function(){
            FREQUENCY_VALUE = getProportionalValue(this.position.x, 0, WINDOW_INNERWIDTH, 400, 700);
			Pd.send('frequency', [FREQUENCY_VALUE]);}
        
    /*####################################################################*/
        
    //WALK
        this.walk = function(){
            
            this.vectorLength = returnRandom(10, 20);
            
            if(!this.nextPosition){
                this.nextPosition = new Vector();}
            else{
                this.fly.style.left = this.nextPosition.x - this.flyWidth/2;;
                this.fly.style.top = this.nextPosition.y - this.flyHeight/2;;
                this.position.x = this.nextPosition.x;
                this.position.y = this.nextPosition.y;
            
            }
            
            this.getNextPosition();
            this.setSoundValues();
            
            this.angle = this.currentStep.getDirection() + Math.PI/2; //in Radians
            this.rotationValue = 'rotate(' + (this.angle * (180/Math.PI)) + 'deg)';
            this.fly.style.transform = this.rotationValue;
            
            this.lastAngle = this.randomAngle;
        }
        
    /*####################################################################*/
        
    //PAUSE
        this.pause = function(){
            this.walking = false;
            setTimeout(() => {
                       this.walking = true;
                       this.pauseTime = returnRandom(2000, 3000);
                       this.move();
                        }, this.pauseTime);
        }
        
    /*####################################################################*/
        
    //MOVE 
        this.move = function(){
            this.walking = true;
            setTimeout(() => {
                       this.walking = false;
                       this.walkTime = returnRandom(5000, 10000);
                       this.pause();
                       }, this.walkTime);
        }

    /*####################################################################*/

    //CHECK CURSOR COLLISION
        this.fly.addEventListener('mouseenter', () => {this.fly.classList.add('collision');}, false);
        this.fly.addEventListener('mouseleave', () => {this.fly.classList.remove('collision');}, false);
        
    /*####################################################################*/

    //UPDATE
        this.update = function(){
            
            if(this.walking){
                this.walk();
            }
        }
    
    }
    
/*############################################################################################################################*/
    
    var FLY = new Fly();

    FLY.move();

    var SPEEDTIME = 200;

    //FLY.walk();
    setInterval(function(){
        FLY.update();
        
        SPEEDTIME = returnRandom(100, 400);}, SPEEDTIME);
    
/*############################################################################################################################*/

}

/*############################################################################################################################*/

/*############################################################################################################################*/
