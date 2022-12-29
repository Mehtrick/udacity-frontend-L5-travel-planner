import {activateLoading, deactivateLoading} from "./loading.js";
import {hideFeedback, showFeedback} from "./feedback.js";

function searchNewDestination() {
    event.preventDefault();
    activateLoading();
    hideFeedback();
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("date").value;
    fetch(`http://localhost:8081/destination/search?destination=${destination}&date=${date} `)
        .then(r => {
            if (!r.ok) {
                throw Error(r.statusText);
            }
            return r.json();
        })
        .then(r => console.log(r))
        .catch(error => showFeedback("alert", error))
        .finally(() => deactivateLoading());
}


export {
    searchNewDestination
};