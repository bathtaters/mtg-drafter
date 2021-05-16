// Setup listeners
function initListeners() {
    // Fixes Box listeners
    addListenerAllBrswrs(document.getElementById("fixesBox"),"click",clickFixesBox);
    addListenerAllBrswrs(document.getElementById("fixesBox"),"dblclick",chooseFixDetail);

    addListenerAllBrswrs(document.getElementById("fixNew"),"click",clickFixButton);
    addListenerAllBrswrs(document.getElementById("fixEdit"),"click",clickFixButton);
    addListenerAllBrswrs(document.getElementById("fixDelete"),"click",clickFixButton);

    addListenerAllBrswrs(document.getElementById("fixUp"),"click",clickFixButton);
    addListenerAllBrswrs(document.getElementById("fixDown"),"click",clickFixButton);
    addListenerAllBrswrs(document.getElementById("fixRename"),"click",clickFixButton);
    
    addListenerAllBrswrs(document.getElementById("fixApply"),"click",clickFixButton);
    addListenerAllBrswrs(document.getElementById("fixRevert"),"click",clickFixButton);
    addListenerAllBrswrs(document.getElementById("fixClearAll"),"click",clickFixButton);

    addListenerAllBrswrs(document.getElementById("fixImport"),"click",clickFixButton);
    addListenerAllBrswrs(document.getElementById("fixFile"),"change", uploadFixList);
    

    // Fixes Editor listeners
    addListenerAllBrswrs(document.getElementById("key"),"change",enterKey);
    addListenerAllBrswrs(document.getElementById("uuid"),"blur",enterUuid);
    addListenerAllBrswrs(document.getElementById("uuid"),"keydown",enterUuid);

    addListenerAllBrswrs(document.getElementById("fixSave"),"click",clickEditorButton);
    addListenerAllBrswrs(document.getElementById("fixCancel"),"click",clickEditorButton);

}


// --- Shared Functions --- //

// Fetch data

function getCardData(uuid) {
    return updateServer("card",{uuid: uuid},"./editor").then( function(result) {
        if (!result || result.invalid) {
            setCardKeys(); setCardValue();
            return setCardName(null, result);
        }
        return result;
    });
}

function getSettingData(key, id = null) {
    // id = null if key contains id in fixString format
    return updateServer("setting",{key: key, id: id},"./editor").then( function (setting) {
        if (!setting || setting.invalid) { 
            setSettingValues();
            return setting ?
                log("Get setting: "+setting.result) :
                log("No response from server","Could not retrieve settings key: "+key+", id: "+id);
        }
        return setting;
    });
}


// Page setters

function setCardName(card = null, invalidMsg = false) {
    var cardName = document.getElementById("cardName");
    if (card) {
        cardName.innerText = card.printedName + " (" + card.setCode + ")";
        cardName.setAttribute("href","../card/"+card.uuid);
        cardName.setAttribute("target","_blank");
    } else {
        cardName.innerText = invalidMsg ? "Invalid UUID" : "";
        cardName.removeAttribute("href");
        cardName.removeAttribute("target");
    }
}

function setCardKeys(keys = null, defaultKey = null) {
    var keyMenu = document.getElementById("key");
    if (keys) {
        setSelectOptions(keyMenu, keys, varName);
        if (defaultKey) { selectOption(keyMenu, defaultKey); }
        keyMenu.removeAttribute("disabled");
    } else {
        keyMenu.setAttribute("disabled","true");
        setSelectOptions(keyMenu, ["Enter UUID"]);
    }
}

function setCardValue(card = null, key = null) {
    if (!card) {
        document.getElementById("current").innerText = ""; return;
    } if (!key) {
        var keys = getSelectedOptions(document.getElementById("key"));
        if (keys && keys.length > 0) { key = keys[0]; }
        if (!key) { return setCardValue() || setSettingValues(); }
    }
    document.getElementById("current").innerText = JSON.stringify(card[key]) || "Empty";
}

function setSettingValues(setting = null) {
    if (setting) {
        document.getElementById("value").value = JSON.stringify(setting.value) || "";
        document.getElementById("original").innerText = JSON.stringify(setting.original) || "Empty";
        document.getElementById("note").value = setting.note || "";
    } else {
        document.getElementById("value").value = "";
        document.getElementById("original").innerText = "";
        document.getElementById("note").value = "";
    }
}


// Updaters

function updateSettingData(key, id = null) {
    return getSettingData(key, id).then( function(setting) { if (setting) {
        setSettingValues(setting);
        return setting;
    } });
}

function updateCardData(uuid, onlyCurrent = false, withKey = null) {
    return getCardData(uuid).then( function(result) { if (result) {
        if (!onlyCurrent) {
            setCardName(result.card, true);
            setCardKeys(result.keys, withKey);
        }
        setCardValue(result.card, withKey);
        return result.card;
    } });
}

function updateAll(key, id = null) {
    return updateSettingData(key, id).then( function(setting) { if (setting) {
        document.getElementById("uuid").value = setting.id || "";
        return updateCardData(setting.id, false, setting.key);
    } });
}

function showEditor() {
    document.getElementById("fixEditBgd").classList.remove("hidden");
    document.getElementById("fixEditBox").classList.remove("hidden");
}

function hideEditor() {
    document.getElementById("fixEditBgd").classList.add("hidden");
    document.getElementById("fixEditBox").classList.add("hidden");
}

function resetEditor() {
    document.getElementById("uuid").value = "";
    setCardName(); setCardKeys(); setCardValue(); setSettingValues();
}

function reload() { location.reload(); }




// --- Listener Functions --- //

// Click button in main interface
function clickFixButton(e) {
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var action = elem.value;
    log("clicked: fixes."+action);

    if (action == "New") {
        resetEditor();
        return showEditor();

    } else if (action == "Edit") {
        var selected = getSelectedOptions(document.getElementById("fixesBox"));
        if (selected.length > 0) {
            return updateAll(selected[0]).then(showEditor);
        }

    } else if (action == "Delete") {
        var selected = getSelectedOptions(document.getElementById("fixesBox"));
        if (selected.length > 0) {
            if (confirm("Are you sure you want to revert & delete the selected setting(s): " + selected + "?")) {
                return updateServer("clear",{keys: selected}, ".").then(reload);
            }
        }
    
    }  else if (action == "Move Up" || action == "Move Down") {
        var selectBox = document.getElementById("fixesBox");
        var selected = getSelectedOptions(selectBox);
        if (selected.length > 0) {
            var offset = 1;
            if (action == "Move Up") { offset = -1; }
            return updateServer("move",{offset: offset, key: selected[0]},".")
                .then(function(res) { if (res.moved){ selectOptionMove(selectBox, offset); } });
        }
    
    }  else if (action == "Bulk Rename") {
        var newName = document.getElementById("fixNewName");
        newName.classList.remove("hidden");
        elem.value = "Apply Name"
    
    }  else if (action == "Apply Name") {
        var selected = getSelectedOptions(document.getElementById("fixesBox"));
        if (selected.length > 0) {
            var newName = document.getElementById("fixNewName").value;
            return updateServer("rename",{keys: selected, note: newName}, ".").then(reload);
        }

    }  else if (action == "Apply All") {
        return updateServer("applyAll",{}, ".").then(reload);

    }  else if (action == "Revert All") {
        return updateServer("revertAll",{}, ".").then(reload);

    }  else if (action == "Delete All") {
        if (confirm("Are you sure you want to delete all settings? They will not be recoverable.")) {
            return updateServer("revertAll",{}, ".")
                .then(_=>updateServer("clearAll",{}, ".")).then(reload);
        }
    
    }  else if (action == "Import") {
        var filePicker = document.getElementById("fixFile");
        if (filePicker.classList.contains("hidden")) { filePicker.classList.remove("hidden"); }
        else { filePicker.classList.add("hidden"); }

    } else {
        log("Not Implemented",action+" action has no implementation.");
    }
}

// Clicking in multi-selection box
function clickFixesBox(e) {
    setButtonStatus(this || e.target || e.srcElemnt, ["fixEdit","fixDelete","fixUp","fixDown"]);
}
function chooseFixDetail() { document.getElementById("fixEdit").click(); }



// Click button in editor interface
function clickEditorButton(e) {
    stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var action = elem.value;
    log("clicked: fixes."+action);

    if (action == "Save") {
        var editorForm = new FormData(document.getElementById("fixesEditor"))
        return postFormData("set",editorForm,".").then(reload);

    } else if (action == "Cancel") {
        return hideEditor();
    
    } else {
        log("Not Implemented",action+" action has no implementation.");
    }
}

function enterKey(e) {
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var key = elem.value;
    log("changed: fixes.key");

    var uuid = document.getElementById("uuid");
    uuid = uuid.innerText || uuid.value;
    return updateSettingData(key, uuid).then(updateCardData(uuid, true));
}

function enterUuid(e) {
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var uuid = elem.value;
    log("changed: fixes.uuid");

    return updateCardData(uuid).then(setSettingValues());
}

// Upload
function uploadFixList(e) {
    var elem = this || e.target || e.srcElemnt;
    var fileForm = new FormData();
    fileForm.append("fixList", elem.files[0]);
    elem.classList.add("hidden");

    if (confirm("Importing may overwrite conflicting settings. Are you sure?")) {
        uploadFile(fileForm, url='./import').then(reload);
    }
}

addWindowListenerAllBrswrs("load", initListeners, false);