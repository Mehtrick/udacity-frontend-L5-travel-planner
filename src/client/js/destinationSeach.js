import {activateLoading, deactivateLoading} from "./loading.js";
import {hideFeedback, showFeedback} from "./feedback.js";
import {loadAndRenderTravelbookEntries, renderTravelEntry} from "./travelentry.js";
import {saveDestinationToEntries, searchDestination} from "./api.js";


let currentTravelEntryPreview = {};

function renderTravelEntryPreview(destination) {
    const container = document.getElementById("new-destination");
    container.innerHTML = "<h3>Preview of you next adventure</h3>";
    currentTravelEntryPreview = destination;
    const footerContent = `
                <button class="error outlined" onclick="Client.deleteDestinationSearch()">
                <i class="fa-solid fa-trash" ></i>
                    Cancel
                </button>
                <button onclick="Client.saveDestination()">
                <i class="fa-solid fa-plus"></i>
                    Add to your journeys
                </button>
    `;
    renderTravelEntry(destination, container, footerContent);
}

async function searchNewDestination() {
    event.preventDefault();
    activateLoading();
    hideFeedback();
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("searchdate").value;
    const newDestination = await searchDestination(destination, date);
    if (newDestination) {
        renderTravelEntryPreview(newDestination);
    }
    deactivateLoading();
}

function deleteDestinationSearch() {
    currentTravelEntryPreview = {};
    const container = document.getElementById("new-destination");
    container.innerHTML = "";
}

async function saveDestination() {
    activateLoading();
    await saveDestinationToEntries(currentTravelEntryPreview);
    showFeedback("success", `${currentTravelEntryPreview.name} <br> was added to your travel-book`);
    deleteDestinationSearch();
    await loadAndRenderTravelbookEntries();
    deactivateLoading();
}


export {
    deleteDestinationSearch,
    searchNewDestination,
    saveDestination,
};