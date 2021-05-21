// Setup listeners
function initListeners() {
    // Hider listeners
    var hiders = document.getElementsByClassName("panelHider");
    for (var i = 0, l = hiders.length; i < l; i++) {
        addListenerAllBrswrs(hiders[i],"click",clickHider);
    }

    // Session listeners
    addListenerAllBrswrs(document.getElementById("sessionBox"),"click",clickSessionBox);
    addListenerAllBrswrs(document.getElementById("sessionBox"),"dblclick",chooseSessionDetail);
    addListenerAllBrswrs(document.getElementById("sessionDelete"),"click",clickSession);
    addListenerAllBrswrs(document.getElementById("sessionDisconnect"),"click",clickSession);
    addListenerAllBrswrs(document.getElementById("sessionClear"),"click",clickSession);

    // Set listeners
    addListenerAllBrswrs(document.getElementById("setsBox"),"click",clickSetsBox);
    addListenerAllBrswrs(document.getElementById("setsBox"),"dblclick",chooseSetToggle);
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

    // User Settings listeners
    addListenerAllBrswrs(document.getElementById("pwordEdit"),"click",clickPword);
    // Additional in SU Panel
}

// --- Other --- //

// Click show/hide buttons up top
function clickHider(e) {
    console.log("hit clickHider");
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var panelId = elem.id.replace("Hider","Container");
    var visible = elem.classList.contains("pressed");
    log("clicked: "+panelId+"."+(visible ? "hide" : "show"));
    
    var panel = document.getElementById(panelId);
    if (visible) {
        panel.setAttribute("style","max-width: 0rem;");
        elem.classList.remove("pressed");
    } else {
        panel.removeAttribute("style");
        elem.classList.add("pressed");
    }
}


// --- Session --- //

// Change draft settings
function clickSession(e) {
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var action = elem.value;
    log("clicked: session."+action);

    var data = {}, sessions = [0];
    if (action == "Clear") {
        data.clearDays = document.getElementById("clearDays").value;
        if (!confirm("Are you sure you wish to delete all drafts older than "+data.clearDays+" days?")) {return;}
    } else {
        sessions = getSelectedOptions(document.getElementById("sessionBox"));
    }

    updateMultiple(sessions,"session/",action,data).then( function(results) {
        if (!Array.isArray(results) || results.length == 0) {
            return log("Error updating session(s): "+action, results.error || "Response from server: "+JSON.stringify(resultsx));
        }

        // Only refresh session box
        setButtonStatus(false, ["sessionDetails","sessionDelete","sessionDisconnect"]);
        return updateServer("draftsList", null, ".", true).then( function(newOpts) {
            if (newOpts) { document.getElementById("sessionBox").innerHTML = newOpts; }
            else { log("No data returned"); }
        });
    });
}

// Clicking in multi-selection boxes
function clickSessionBox(e) {
    setButtonStatus(this || e.target || e.srcElemnt, ["sessionDetails","sessionDelete","sessionDisconnect"]);
}
function chooseSessionDetail() { document.getElementById("sessionDetails").click(); }




// --- Sets --- //

// Change set settings
function clickSets(e) {
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var action = elem.value.replace(/\s/g,"");
    log("clicked: set."+action);

    var data = {};
    if (action == "ToggleVisibility") {
        data.setCodes = getSelectedOptions(document.getElementById("setsBox"));
    } else if (action == "MakeDefault") {
        data.setCode = document.getElementById("setsBox").value;
    } else {
        loadingSplash();
        data.defaultVisible = document.getElementById("setsDefault").value;
    }

    updateServer(action,data,"set").then( function(result) {
        
        // Just update on MakeDefault
        if (result.action == "MakeDefault" && result.result && result.set) {
            var oldDefault = document.getElementsByClassName("setDef")[0];
            if (oldDefault) { oldDefault.classList.remove("setDef"); }
            
            var newDefault = getOption(document.getElementById("setsBox"), result.set);
            if (newDefault) { newDefault.classList.add("setDef"); }
            
        // Just update on ToggleVisibility
        } else if (result.action == "ToggleVisibility" && result.results && Array.isArray(result.set)) {
            var setBox = document.getElementById("setsBox");
            for (var i=0, e=result.set.length; i < e; i++) {
                if (result.results[i] < 0) { continue; }
                var setOpt = getOption(setBox, result.set[i]);
                if (!setOpt) { continue; }
                if (setOpt.classList.contains("setOff")) {
                    setOpt.classList.remove("setOff");
                    setOpt.classList.add("setOn");
                } else {
                    setOpt.classList.remove("setOn");
                    setOpt.classList.add("setOff");
                }
            }
        
        // Only refresh sets box
        } else if ((result.action == "UpdateAll" || result.action == "ResetAll") && result.result >= 0) {
            result.set = (result.result || "no")+" sets"
            
            setButtonStatus(false, ["setDetails","setToggle","setDefault"]);
            return updateServer("setsList", null, ".", true).then( function(newOpts) {
                if (newOpts) { document.getElementById("setsBox").innerHTML = newOpts; }
                else { log("No data returned"); }
                loadingSplash(false);
            });
        
        // Errors
        } else {
            loadingSplash(false);
            return log("Error updating set(s): "+action, result.error || "Response from server: "+JSON.stringify(result));
        }

        log("Completed "+result.action+" on: "+result.set);
    });
}

// Clicking in multi-selection boxes
function clickSetsBox(e) {
    setButtonStatus(this || e.target || e.srcElemnt, ["setDetails","setToggle","setDefault"])
}
function chooseSetToggle() { document.getElementById("setDetails").click(); }




// --- Database --- //

// Edit Database URLs
function clickDbEdit(e) {
    var elem = this || e.target || e.srcElemnt;
    var urlName = elem.id; var button = elem.value;
    log("clicked: "+urlName);

    var urlId = {"setEdit": "setUrl", "cardEdit": "cardUrl"};
    var urlBox = document.getElementById(urlId[urlName]);
    var updateButton = document.getElementById("updateDbButton");

    if (button === "Edit") {
        updateButton.setAttribute("disabled","true");
        urlBox.removeAttribute("readonly");
        elem.value = "Save";

    } else if (button === "Save") {
        urlBox.setAttribute("readonly","true");
        elem.value = " ... ";

        var data = {urlKey: urlId[urlName], urlValue: urlBox.value};
        updateServer("updateUrl",data,"db").then( result => {
            if (result.result) { urlBox.value = result.result; }
            elem.value = "Edit";
            log("Updated URL to: "+result.result);
        });
    }

    if (
        document.getElementById("setUrl").hasAttribute("readonly")
        && document.getElementById("cardUrl").hasAttribute("readonly")
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
    var formData = new FormData(document.getElementById("databaseContainer"));

    // Calculate actual times better
    var msg = 0;
    if (formData.get("updateSets"))  { msg += 1; }
    if (formData.get("updateCards")) { msg += 3; }
    if (formData.get("fixCardAlts")) { msg += 7; }

    msg = "This could take up to " + msg + " minutes for which the site will be down."; 
    msg += "\n\nAre you sure you want to continue?";
    if (!confirm(msg)) {
        log("updateDatabase cancelled");
        return elem.removeAttribute("disabled");
    }

    document.getElementById("dbResult").innerText = "Updating database...";
    loadingSplash();

    postFormData("updateDb",formData,"db").then( result => {
        alert(result.result || "Database update completed with no message.");
        location.reload();
    });

}





// --- User --- //

// Change password
function clickPword(e) {
    var elem = this || e.target || e.srcElemnt;
    log("clicked: "+elem.id);

    elem.setAttribute("disabled","true");
    var formData = new FormData(document.getElementById("currentUserContainer"));
    if (!formData.get("currentPassword")) {
        elem.removeAttribute("disabled");
        return alert("Please enter Old Password first.");
    }

    postFormData("pass",formData,"user").then( result => {
        log(result.msg);

        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";

        document.getElementById("currentUserResult").innerText = result.msg;
        elem.removeAttribute("disabled");
    });

}

// Additional in SU Panel


// Turn on/off Loading graphic
function loadingSplash(enable = true) {
    if (enable) {
        document.getElementsByTagName("body")[0].classList.add("noScroll");
        document.getElementById("dbLoading").classList.remove("hidden");
    } else {
        document.getElementsByTagName("body")[0].classList.remove("noScroll");
        document.getElementById("dbLoading").classList.add("hidden");
    }
}

addWindowListenerAllBrswrs("load", initListeners, false);