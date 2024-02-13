


window.onclick = function(event) {
    /*
    * Registro de clicks del cliente.
    * Se va a registrar cada click y sobre qué elemento se ha hecho click. El formato del log es el siguiente:
    * TAGNAME; ID; NAME; NUM_CLASSES; CLASSNAME (pueden ser varios, separados por ";")
    */
    elem = event.target
    /* 
    classNames = elem.className.split(" ")
    classNames.forEach( function(valor, indice) {
        console.log("Classe ", indice, ": ",  valor);
    });
    */

    sendClickInfo(`${elem.tagName}  ID:  ${elem.id}  Classname:  ${elem.className}  NAME:  ${elem.name}`)
}



var scrollTimer, lastScrollFireTime = 0;
var y_before = 0;
$(window).on('scroll', function() {

    var minScrollTime = 500;
    var now = new Date().getTime();

    function processScroll() {
        var y = window.scrollY;
        if (y > y_before){
            sendScrollInfo("SCROLL DOWN");
        }else if (y < y_before) {
            sendScrollInfo("SCROLL UP");   
        }
        y_before = y
    }
    if (!scrollTimer) {
        if (now - lastScrollFireTime > (3 * minScrollTime)) {
            processScroll();   // fire immediately on first scroll
            lastScrollFireTime = now;
        }
        scrollTimer = setTimeout(function() {
            scrollTimer = null;
            lastScrollFireTime = new Date().getTime();
            processScroll();
        }, minScrollTime);
    }
});