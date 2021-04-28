// Setup listeners
function initListeners() {
    // Session listeners
    addListenerAllBrswrs(document.getElementById("sessionDisconnectAll"),"click",disconnectAll);

    // Player listeners
    var connectors = document.getElementsByClassName("connectionButton");
    for (var i = 0, l = connectors.length; i < l; i++) {
        addListenerAllBrswrs(connectors[i],"click",disconnectOne);
    }

    // Show/Hide main/side boards
    var boardHeaders = document.getElementsByClassName("boardHeader");
    for (var i = 0, l = boardHeaders.length; i < l; i++) {
        addListenerAllBrswrs(boardHeaders[i],"click",clickHideGroup);
    }
}


// Click to hide board (Copied from 'draft-listeners')
function clickHideGroup(e) {
    stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    log("show/hide "+elem.id);

    var prefix = elem.id.slice(0, -("Header".length));

    if (prefix) {
        var container = document.getElementById(prefix+"Container");
        var hideText = document.getElementById(prefix+"Hider");
        if (container.classList.contains("hiddenGroup")) {
            container.classList.remove("hiddenGroup");
            hideText.innerText = "–"; // en-dash
        } else {
            container.classList.add("hiddenGroup");
            hideText.innerText = "+";
        }
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