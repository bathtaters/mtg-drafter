// Setup listeners
function initListeners() {
    // Sudo User Settings listeners
    addListenerAllBrswrs(document.getElementById("userAdd"),"click",addUser);
    addListenerAllBrswrs(document.getElementById("userRemove"),"click",removeUser);
    addListenerAllBrswrs(document.getElementById("userBox"),"click",clickUserBox);
}



// --- User --- //

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