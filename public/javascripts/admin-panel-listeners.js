// Setup listeners
function initListeners() {
    // Session listeners
    addListenerAllBrswrs(document.getElementById("sessionDelete"),"click",clickSession);
    addListenerAllBrswrs(document.getElementById("sessionDisconnect"),"click",clickSession);
    addListenerAllBrswrs(document.getElementById("sessionClear"),"click",clickSession);
    // Set listeners
    addListenerAllBrswrs(document.getElementById("setToggle"),"click",clickSets);
    addListenerAllBrswrs(document.getElementById("setDefault"),"click",clickSets);
    addListenerAllBrswrs(document.getElementById("setUpdate"),"click",clickSets);
    addListenerAllBrswrs(document.getElementById("setReset"),"click",clickSets);
}

// Change draft type
function clickSession(e) {
    stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var action = elem.value;
    log("clicked: session."+action);

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

// Change set stuff
function clickSets(e) {
    stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var action = elem.value.replace(/\s/g,'');
    log("clicked: set."+action);

    var data = {};
    if (action == "ToggleVisibility" || action == "MakeDefault") {
        data.setCode = document.getElementById("setsBox").value;
    } else {
        data.defaultVisible = document.getElementById("setsDefault").value;
    }
    
    updateServer(action,data,"sets").then( result => {
        console.log(result);
        location.reload();
    });
}

addWindowListenerAllBrswrs("load", initListeners, false);