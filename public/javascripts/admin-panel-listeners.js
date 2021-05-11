// Setup listeners
function initListeners() {
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
    addListenerAllBrswrs(document.getElementById("userAdd"),"click",addUser);
    addListenerAllBrswrs(document.getElementById("userRemove"),"click",removeUser);
    addListenerAllBrswrs(document.getElementById("userBox"),"click",clickUserBox);
}


// --- Session --- //

// Change draft settings
function clickSession(e) {
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var action = elem.value;
    log("clicked: session."+action);

    var data = {};
    if (action == "Clear") {
        data.clearDays = document.getElementById("clearDays").value;
    }
    
    var sessions = getSelectedOptions(document.getElementById("sessionBox"));
    updateMultiple(sessions,"session/",action,data).then(function() { location.reload(); });
}

// Clicking in multi-selection boxes
function clickSessionBox(e) {
    setButtonStatus(this || e.target || e.srcElemnt, ["sessionDetails","sessionDelete","sessionDisconnect"])
}
function chooseSessionDetail() { document.getElementById("sessionDetails").click(); }




// --- Sets --- //

// Change set settings
function clickSets(e) {
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var action = elem.value.replace(/\s/g,'');
    log("clicked: set."+action);

    var data = {};
    if (action == "ToggleVisibility") {
        data.setCodes = getSelectedOptions(document.getElementById("setsBox"));
    } else if (action == "MakeDefault") {
        data.setCode = document.getElementById("setsBox").value;
    } else {
        data.defaultVisible = document.getElementById("setsDefault").value;
    }

    updateServer(action,data,"set").then( result => {
        log("Completed "+result.action+" on set: "+result.set);
        location.reload();
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
    var formData = new FormData(document.getElementById("dbContainer"));

    // Calculate actual times better
    var msg = 0;
    if (formData.get('updateSets'))  { msg += 1; }
    if (formData.get('updateCards')) { msg += 3; }
    if (formData.get('fixCardAlts')) { msg += 6; }

    msg = "This could take up to " + msg + " minutes for which the site will be down."; 
    msg += "\n\nAre you sure you want to continue?";
    if (!confirm(msg)) {
        log("updateDatabase cancelled");
        return elem.removeAttribute("disabled");
    }

    document.getElementById("dbResult").innerText = "Updating database...";
    document.getElementsByTagName("body")[0].classList.add("noScroll")
    document.getElementById("dbLoading").classList.remove("hidden");

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

// Add user
function addUser(e) {
    var elem = this || e.target || e.srcElemnt;
    log("clicked: "+elem.id);

    elem.setAttribute("disabled","true");
    var formData = new FormData(document.getElementById("sudoContainer"));

    postFormData("add",formData,"user").then( result => {
        log(result.msg);
        if (!result.error) {  return location.reload(); }
        
        document.getElementById("addUsername").value = "";
        document.getElementById("addPassword").value = "";

        document.getElementById("currentUserResult").innerText = result.msg;
        elem.removeAttribute("disabled");
    });

}

// Remove user
function clickUserBox(e) {
    setButtonStatus(this || e.target || e.srcElemnt, ["userRemove"])
}
function removeUser(e) {
    var elem = this || e.target || e.srcElemnt;
    log("clicked: "+elem.id);

    var user = document.getElementById("userBox");
    user = user.value || user.text;
    if(!confirm("Are you sure you want to delete "+user+"?")) { return log("Remove user cancelled"); }

    updateServer("remove",{username: user},"user").then( result => {
        log(result.msg);
        if (!result.error) { return location.reload(); }

        document.getElementById("currentUserResult").innerText = result.msg;
    });
}

addWindowListenerAllBrswrs("load", initListeners, false);