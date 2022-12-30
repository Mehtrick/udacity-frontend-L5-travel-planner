import {showFeedback} from "./feedback.js";
const baseURL = "http://192.168.178.23:8081";
async function loadTravelBookEntries() {
    return  await fetch(`${baseURL}/trip`)
        .then(r => {
            if (!r.ok) {
                throw Error(r.statusText);
            }
            return r.json();
        })
        .then(r => r)
        .catch(error => showFeedback("alert", error));
}

async function searchDestination(destination,date){
    return fetch(`${baseURL}/trip/search?destination=${destination}&date=${date} `)
        .then(r => {
            if (!r.ok) {
                throw Error(r.statusText);
            }
            return r.json();
        })
        .then(r =>r)
        .catch(error => showFeedback("alert", error));
}
async function saveDestinationToEntries(currentTravelEntryPreview){
    return fetch(`${baseURL}/trip`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(currentTravelEntryPreview),
    });
}

async function deleteTravelBookEntry(id){
    return fetch(`${baseURL}/trip?id=${id}`, {
        method: "DELETE",
        credentials: "same-origin",
    });
}


export {
    deleteTravelBookEntry,
    loadTravelBookEntries,
    searchDestination,
    saveDestinationToEntries
};