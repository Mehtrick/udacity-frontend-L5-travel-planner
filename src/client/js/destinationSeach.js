import {activateLoading, deactivateLoading} from "./loading.js";
import {hideFeedback, showFeedback} from "./feedback.js";

const baseURL = "http://192.168.178.23:8081";

let currentTravelEntryPreview = {};

function calculateDaysUntilTrip(date) {
    const tripDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(tripDate - today);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}


function renderTravelEntry(destination, container, footerContent,extraCardStyle) {
    const daysuntil = calculateDaysUntilTrip(destination.date);
    const vdom = document.createDocumentFragment();
    const travelEntryDiv = document.createElement("div");

    travelEntryDiv.classList.add("card");
    travelEntryDiv.classList.add(extraCardStyle);
    travelEntryDiv.id = destination.id ? destination.id : "destination-preview";
    travelEntryDiv.innerHTML = `
            <img alt="${destination.name}" class="card-image"
                 src="${destination.image}">
            <div class="card-content">
                <h2 class="card-title">${destination.name}, ${destination.country}</h2>
                <h4 class="card-subtitle">${new Date(destination.date).toLocaleDateString()}</h4>
                <p>Your trip starts in <strong class="accent">${daysuntil}</strong> days!</p>
                <div class="weather">
                    <h4 class="card-subtitle">
                    Your expected weather for the day:
                    </h4>
                    <div class="weather-info">
                        <div class="meta-weather-info">
                             <div>
                                <i class="fa fa-solid fa-sun"></i>Max temperature: ${destination.weather.max_temp} °C
                            </div>
        
                            <div>
                                <i class="fa fa-solid fa-snowflake"></i>Min temperature: ${destination.weather.min_temp} °C
                            </div>
                            <div>
                                <i class="fa fa-solid fa-temperature-three-quarters"></i>Average temperature: ${destination.weather.temp} °C
                            </div>
                            <div>
                                <i class="fa fa-solid fa-cloud-rain"></i>Precipitation: ${(destination.weather.pop !== undefined ? destination.weather.pop + "%" : destination.weather.precip + "mm")}
                            </div>
                        </div>
                        <div class="weather-icon">
                            <img height="70" width="70" alt="weather-icon" style="" src="https://www.weatherbit.io/static/img/icons/${destination.weather.icon.icon}.png">
                        </div>
                    </div>
                </div>
                <div class="historical-disclaimer ${destination.weather.type !== "historical" ? "hidden" : ""}">
                    *The weather data is based on historical information and might not actually be the weather of the day.
                </div>
            </div>
            <div class="card-footer">
               ${footerContent}
            </div>
                `;
    vdom.appendChild(travelEntryDiv);
    container.append(vdom);
    return destination;
}

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
    renderTravelEntry(destination, container, footerContent,"preview");
}

function searchNewDestination() {
    event.preventDefault();
    activateLoading();
    hideFeedback();
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("searchdate").value;
    fetch(`${baseURL}/destination/search?destination=${destination}&date=${date} `)
        .then(r => {
            if (!r.ok) {
                throw Error(r.statusText);
            }
            return r.json();
        })
        .then(r => renderTravelEntryPreview(r))
        .catch(error => showFeedback("alert", error))
        .finally(() => deactivateLoading());
}


function deleteDestinationSearch() {
    currentTravelEntryPreview = {};
    const container = document.getElementById("new-destination");
    container.innerHTML = "";
}

async function saveDestination() {
    activateLoading();
    await fetch(`${baseURL}/destination`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(currentTravelEntryPreview), // body data type must match "Content-Type" header
    }).finally(deactivateLoading);
    showFeedback("success", `${currentTravelEntryPreview.name} was added to your travel-book`);
    deleteDestinationSearch();
    await getTravelBookEntries();
}

async function getTravelBookEntries() {
    activateLoading();
    const travelEntries = await fetch(`${baseURL}/destination`)
        .then(r => {
            if (!r.ok) {
                throw Error(r.statusText);
            }
            return r.json();
        })
        .then(r => r)
        .catch(error => showFeedback("alert", error))
        .finally(() => deactivateLoading());
    const container = document.getElementById("travel-entries");
    container.innerHTML = "<h3>Your upcoming journeys</h3>";
    const footerContent = `
                <button class="error outlined">
                <i class="fa-solid fa-trash" ></i>
                    Delete
                </button>
                `;
    for (const travelEntry of travelEntries) {
        renderTravelEntry(travelEntry, container, footerContent);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export {
    deleteDestinationSearch,
    searchNewDestination,
    saveDestination,
    getTravelBookEntries
};