import {showFeedback} from "./feedback.js";
const baseURL = "http://192.168.178.23:8081";
async function loadTravelBookEntries() {
    return  await fetch(`${baseURL}/destination`)
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
    return fetch(`${baseURL}/destination/search?destination=${destination}&date=${date} `)
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
    return fetch(`${baseURL}/destination`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(currentTravelEntryPreview),
    });
}

async function deleteTravelBookEntry(id){
    return fetch(`${baseURL}/destination?id=${id}`, {
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