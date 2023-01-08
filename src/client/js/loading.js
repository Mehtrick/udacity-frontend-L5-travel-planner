/**
 * Shows / Hides the loader on the start page
 */


function activateLoading(){
    document.getElementById("loader").classList.remove("hidden");
}

function deactivateLoading(){
    document.getElementById("loader").classList.add("hidden");
}

export {
    activateLoading,
    deactivateLoading
};