// Setup listeners
function initListeners() {
    // Session listeners
    addListenerAllBrswrs(document.getElementById("sessionDisconnectAll"),"click",disconnectAll);

    // Player listeners
    var connectors = document.getElementsByClassName("connectionButton");
    for (var i = 0, l = connectors.length; i < l; i++) {
        addListenerAllBrswrs(connectors[i],"click",disconnectOne);
    }
}

// Change draft type
function disconnectAll(e) {
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    log("clicked: "+elem.value);
    
    updateServer("Disconnect",{},".").then( result => {
        console.log(result);
        location.reload();
    });
}

function disconnectOne(e) {
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    log("clicked: disconnect."+elem.id);

    if (!elem.classList.contains("connected")) {
        log("Player already disconnected");
        return;
    }

    updateServer("PlayerDisconnect",{playerId: elem.id},".").then( result => {
        console.log(result);
        location.reload();
    });
}

addWindowListenerAllBrswrs("load", initListeners, false);