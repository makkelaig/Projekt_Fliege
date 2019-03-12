window.onload = init;

function init(){
    
    var BODY = document.body;
    
    function _(ID){return document.getElementById(ID);}
    
    var BUTTON_ON = _('button_on');
    var BUTTON_OFF = _('button_off');
    
/*############################################################################################################################*/
    
    var patch
        $.get('patches/firstPatch.pd', function(patchStr) {
          patch = Pd.loadPatch(patchStr)
          
          BUTTON_ON.addEventListener('click', function(){Pd.start();}, false);
          BUTTON_OFF.addEventListener('click', function(){Pd.stop();}, false);
          
    })
    
/*############################################################################################################################*/

}

/*############################################################################################################################*/

// https://github.com/sebpiq/WebPd