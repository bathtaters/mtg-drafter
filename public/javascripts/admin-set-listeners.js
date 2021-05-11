// Setup listeners
function initListeners() {
    // Set listeners
    addListenerAllBrswrs(document.getElementById("setToggle"),"click",clickSets);
    addListenerAllBrswrs(document.getElementById("setDefault"),"click",clickSets);
}


// Change set settings
function clickSets(e) {
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var action = elem.value.replace(/\s/g,'');
    log("clicked: set."+action);

    var data = { setCode: document.getElementById("setCodeValue").innerText };

    if (action == "ToggleVisibility") {
        data.setCodes = [data.setCode];
        delete data.setCode;
    } else if (action != "MakeDefault") {
        log("Invalid call.","Button "+action+" is not accounted for.");
    }

    updateServer(action,data,"../").then( result => {
        log("Completed "+result.action+" on set: "+result.set);
        location.reload();
    });
}


addWindowListenerAllBrswrs("load", initListeners, false);