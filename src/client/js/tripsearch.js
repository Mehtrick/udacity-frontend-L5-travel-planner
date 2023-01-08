import {activateLoading, deactivateLoading} from "./loading.js";
import {hideFeedback, showFeedback} from "./feedback.js";
import {loadAndRenderAllExistingTrips, renderTripEntry} from "./tripentry.js";
import {saveTrip, searchTrip} from "./api.js";


let currentTripEntryPreview = {};

function renderTripEntryPreview(trip) {
    const container = document.getElementById("new-trip");
    container.innerHTML = "<h3>Preview of you next adventure</h3>";
    currentTripEntryPreview = trip;
    const footerContent = `
                <button class="error outlined" onclick="Client.cancelTripSearch()">
                <i class="fa-solid fa-ban"></i>
                    Cancel
                </button>
                <button onclick="Client.saveTripAndReload()">
                <i class="fa-solid fa-plus"></i>
                    Add to your trips
                </button>
    `;
    renderTripEntry(trip, container, footerContent);
}

async function searchNewTrip(event) {
    activateLoading();
    try{
        event.preventDefault();
        hideFeedback();
        const destination = document.getElementById("destination").value;
        const date = document.getElementById("searchdate").value;
        const newTrip = await searchTrip(destination, date);
        if (newTrip) {
            renderTripEntryPreview(newTrip);
        }
    }finally {
        deactivateLoading();
    }


}

function cancelTripSearch() {
    currentTripEntryPreview = {};
    const container = document.getElementById("new-trip");
    container.innerHTML = "";
}

async function saveTripAndReload() {
    activateLoading();
    try {
        await saveTrip(currentTripEntryPreview);
        showFeedback("success", `${currentTripEntryPreview.name} <br> was added to your upcoming trips`);
        cancelTripSearch();
        await loadAndRenderAllExistingTrips();
    } finally {
        deactivateLoading();
    }
}


export {
    cancelTripSearch,
    searchNewTrip,
    saveTripAndReload,
};