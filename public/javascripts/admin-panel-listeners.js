// Setup listeners
function initListeners() {
    // Session listeners
    addListenerAllBrswrs(document.getElementById("sessionDelete"),"click",clickSession);
    addListenerAllBrswrs(document.getElementById("sessionDisconnect"),"click",clickSession);
    addListenerAllBrswrs(document.getElementById("sessionClear"),"click",clickSession);
}

// Change draft type
function clickSession(e) {
    stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var action = elem.value;
    log("clicked: "+action);

    var data = {};
    if (action == "Clear") {
        data.clearDays = document.getElementById("clearDays").value;
    }
    
    var sessionBox = document.getElementById("sessionBox");
    updateServer(action,data,"session/"+sessionBox.value).then( result => {
        console.log(result);
        location.reload();
    });
}

addWindowListenerAllBrswrs("load", initListeners, false);