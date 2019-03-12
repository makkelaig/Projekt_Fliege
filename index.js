window.onload = init;

function init(){
    
    var BODY = document.body;
    
    function _(ID){return document.getElementById(ID);}
    
    var BUTTON_ON = _('button_on');
    var BUTTON_OFF = _('button_off');
	var INPUT_FIELD = _('input');
	var BUTTON_SEND = _('button_send');
    
/*############################################################################################################################*/
    
    var patch
        $.get('patches/firstPatch.pd', function(patchStr) {
          patch = Pd.loadPatch(patchStr)
          
          BUTTON_ON.addEventListener('click', function(){Pd.start();}, false);
          BUTTON_OFF.addEventListener('click', function(){Pd.stop();}, false);
		  BUTTON_SEND.addEventListener('click', function(){Pd.send('frequency', [Number(INPUT_FIELD.value)])}, false);
          
		
    })
	
    
/*############################################################################################################################*/

}

/*############################################################################################################################*/

// https://github.com/sebpiq/WebPd