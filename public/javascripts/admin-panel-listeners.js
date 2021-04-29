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
    // Database listeners
    addListenerAllBrswrs(document.getElementById("setEdit"),"click",clickDbEdit);
    addListenerAllBrswrs(document.getElementById("cardEdit"),"click",clickDbEdit);
    addListenerAllBrswrs(document.getElementById("updateCards"),"click",clickDbCheck);
    addListenerAllBrswrs(document.getElementById("updateSets"),"click",clickDbCheck);
    addListenerAllBrswrs(document.getElementById("fixCardAlts"),"click",clickDbCheck);
    addListenerAllBrswrs(document.getElementById("updateDbButton"),"click",updateDb);
}




// Change draft type
function clickSession(e) {
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var action = elem.value;
    log("clicked: session."+action);

    var data = {};
    if (action == "Clear") {
        data.clearDays = document.getElementById("clearDays").value;
    }
    
    var sessionBox = document.getElementById("sessionBox");
    updateServer(action,data,"session/"+(sessionBox.value||"null")).then( result => {
        log("Completed "+action+" on session: "+(result.sessionId || JSON.stringify(result.sessionIds)));
        location.reload();
    });
}



// Change set stuff
function clickSets(e) {
    // stopPropagationAllBrswrs(e);
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
        log("Completed "+result.action+" on set: "+result.set);
        location.reload();
    });
}




// --- Database --- //

// Edit Database URLs
function clickDbEdit(e) {
    var elem = this || e.target || e.srcElemnt;
    var urlName = elem.id, button = elem.value;
    log("clicked: "+urlName);

    var urlId = {"setEdit": "setUrl", "cardEdit": "cardUrl"};
    var urlBox = document.getElementById(urlId[urlName]);
    var updateButton = document.getElementById("updateDbButton");

    if (button === "Edit") {
        updateButton.setAttribute("disabled","true");
        urlBox.removeAttribute("disabled");
        elem.value = "Save";

    } else if (button === "Save") {
        urlBox.setAttribute("disabled","true");
        elem.value = " ... ";

        var data = {urlKey: urlId[urlName], urlValue: urlBox.value};
        updateServer("updateUrl",data,"db").then( result => {
            if (result.result) { urlBox.value = result.result; }
            elem.value = "Edit";
            log("Updated URL to: "+result.result);
        });
    }

    if (
        document.getElementById("setUrl").hasAttribute("disabled")
        && document.getElementById("cardUrl").hasAttribute("disabled")
    ) {
        updateButton.removeAttribute("disabled");
    }
    
}

// Disable card option when cards are de-selected
function clickDbCheck(e) {
    var elem = this || e.target || e.srcElemnt;
    log("clicked: "+elem.id);

    // Get other database box
    var boxes;
    if (elem.id === "updateCards") {
        boxes = ["updateSets", "fixCardAlts"];
    } else if (elem.id === "updateSets") {
        boxes = ["updateCards", "fixCardAlts"];
    } else if (elem.id === "fixCardAlts") {
        boxes = ["updateCards", "updateSets"];
    }

    // Check if they're all unchecked
    var disableUpdate = !elem.checked
        && !document.getElementById(boxes[0]).checked
        && !document.getElementById(boxes[1]).checked;

    // Enable/disable Update button
    var updateButton = document.getElementById("updateDbButton");
    if (disableUpdate) {
        updateButton.setAttribute("disabled","true");
    } else if (updateButton.hasAttribute("disabled")) {
        updateButton.removeAttribute("disabled");
    }
}

// Run database update
function updateDb(e) {
    var elem = this || e.target || e.srcElemnt;
    log("clicked: updateDatabase");

    elem.setAttribute("disabled","true");
    var formData = new FormData(document.getElementById("dbContainer"));

    // Calculate actual times better
    var msg = 0;
    if (formData.get('updateSets'))  { msg += 2; }
    if (formData.get('updateCards')) { msg += 5; }
    if (formData.get('fixCardAlts')) { msg += 5; }

    msg = "This could take up to " + msg + " minutes for which the site will be down."; 
    msg += "\n\nAre you sure you want to continue?";
    if (!confirm(msg)) {
        log("updateDatabase cancelled");
        return elem.removeAttribute("disabled");
    }

    var updateStatus = document.getElementById("dbResult");
    var progressBar = document.getElementById("dbLoading");
    progressBar.classList.remove("hidden");
    updateStatus.innerText = "Updating database...";

    postFormData("updateDb",formData,"db").then( result => {
        updateStatus.innerText = result.result || "Database updated.";
        progressBar.classList.add("hidden");
        elem.removeAttribute("disabled");
        console.log("updateDb Message: "+result.result);
    });

}

addWindowListenerAllBrswrs("load", initListeners, false);