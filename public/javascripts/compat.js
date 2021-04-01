function addListenerAllBrswrs(elem, listener, func, useCapture=false) {
    if (elem.addEventListener) {
        elem.addEventListener(listener,func,useCapture);
    } else if(elem.attachEvent) {
        elem.attachEvent("on"+listener,func);
    }
    //console.log('added '+listener+' listener to '+(elem.id||elem.tagName||'no-id'));
}
function addWindowListenerAllBrswrs(listener, func, useCapture=false) {
    if (window.addEventListener) {
        window.addEventListener(listener, func, useCapture);
    } else if (window.attachEvent) {
        if (listener.substring(0,2).toLowerCase() != "on") {
            listener = "on" + listener;
        }
        window.attachEvent(listener, func);
    } else {
       document.addEventListener(listener, func, useCapture);
    }
    //console.log('added '+listener+' listener to window');
}
function stopPropagationAllBrswrs(event) {
    if (!event) event = window.event;
    if (event.stopPropagation) event.stopPropagation();
    else event.cancelBubble = true;
}