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

    // Log hiders
    formatLogText();
    addListenerAllBrswrs(document.getElementById("hideTimeWrapper"),"click",clickHideLog);
    addListenerAllBrswrs(document.getElementById("hideUuidWrapper"),"click",clickHideLog);
}


// Click to hide board (Copied from 'draft-listeners')
function clickHideGroup(e) {
    // stopPropagationAllBrswrs(e);
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



// Split up log text and load CSS nodes
function formatLogText() {
    var timeTag = '<span class="logTime">';
    var uuidTag = '<span class="logUuid"> ';
    var closeTag = "</span>"
    var sliceIndex = 19;

    var textBox = document.getElementById("logTextBox").children;
    for (var i = 0, l = textBox.length; i < l; i++) {
        textBox[i].innerHTML = timeTag + textBox[i].innerHTML.slice(0,sliceIndex-1).replace(',','') + closeTag
            + textBox[i].innerHTML.slice(sliceIndex).replace(/ &lt;/g,uuidTag).replace(/&gt;/g,closeTag);
    }

    mtgDrafterGlobals.hideLog = {
        Time: document.createElement("style"),
        Uuid: document.createElement("style")
    };
    mtgDrafterGlobals.hideLog.Time.type = "text/css";
    mtgDrafterGlobals.hideLog.Time.innerText = "p .logTime { display: none; }";
    document.head.appendChild(mtgDrafterGlobals.hideLog.Time)
    mtgDrafterGlobals.hideLog.Uuid.type = "text/css";
    mtgDrafterGlobals.hideLog.Uuid.innerText = "p .logUuid { display: none; }";
    document.head.appendChild(mtgDrafterGlobals.hideLog.Uuid)
}

// Show/Hide based off of Log checkboxes
function clickHideLog(e) {
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    log("show/hide "+elem.id);

    var item = elem.id.slice("hide".length, -("Wrapper".length));

    if (item) {
        var hideIt = document.getElementById("hide"+item).checked;
        
        if (hideIt) {
            document.head.appendChild(mtgDrafterGlobals.hideLog[item]);
        } else {
            mtgDrafterGlobals.hideLog[item].remove();
        }
    }
}



addWindowListenerAllBrswrs("load", initListeners, false);