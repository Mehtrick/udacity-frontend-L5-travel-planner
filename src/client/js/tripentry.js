import {activateLoading, deactivateLoading} from "./loading.js";
import {deleteTravelBookEntry, getTripEntries} from "./api.js";
import {showFeedback} from "./feedback.js";

function renderTripEntry(trip, container, footerContent) {
    const daysuntil = calculateDaysUntilTrip(trip.date);
    const vdom = document.createDocumentFragment();
    const tripEntryDiv = document.createElement("div");

    tripEntryDiv.classList.add("card");
    if(!trip.id){
        tripEntryDiv.classList.add("preview");
    }
    tripEntryDiv.classList.add("trip-card");
    tripEntryDiv.id = trip.id ? trip.id : "trip-preview";
    tripEntryDiv.innerHTML = `
            <img alt="${trip.name}" class="card-image"
                 src="${trip.image}">
            <div class="card-content">
                <h2 class="card-title">${trip.name}, ${trip.country}</h2>
                <h4 class="card-subtitle">${new Date(trip.date).toLocaleDateString()}</h4>
                <p>Your trip starts in <strong class="accent">${daysuntil}</strong> days!</p>
                <div class="weather">
                    <h4 class="card-subtitle">
                    Your expected weather for the day:
                    </h4>
                    <div class="weather-info">
                        <div class="meta-weather-info">
                             <div>
                                <i class="fa fa-solid fa-sun"></i>Max temperature: ${trip.weather.max_temp} °C
                            </div>
        
                            <div>
                                <i class="fa fa-solid fa-snowflake"></i>Min temperature: ${trip.weather.min_temp} °C
                            </div>
                            <div>
                                <i class="fa fa-solid fa-temperature-three-quarters"></i>Average temperature: ${trip.weather.temp} °C
                            </div>
                            <div>
                                <i class="fa fa-solid fa-cloud-rain"></i>Precipitation: ${(trip.weather.pop !== undefined ? trip.weather.pop + "%" : trip.weather.precip + "mm")}
                            </div>
                        </div>
                        <div class="weather-icon">
                            <img height="70" width="70" alt="weather-icon" style="" src="https://www.weatherbit.io/static/img/icons/${trip.weather.icon.icon}.png">
                        </div>
                    </div>
                </div>
                <div class="historical-disclaimer ${trip.weather.type !== "historical" ? "hidden" : ""}">
                    *The weather data is based on historical information and might not actually be the weather of the day.
                </div>
            </div>
            <div class="card-footer">
               ${footerContent}
            </div>
                `;
    vdom.appendChild(tripEntryDiv);
    container.append(vdom);
    return trip;
}

function calculateDaysUntilTrip(date) {
    const tripDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(tripDate - today);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

async function loadAndRenderTripEntries() {
    activateLoading();
    const tripEntries = await getTripEntries();
    const container = document.getElementById("trip-entries");
    container.innerHTML = "<h3>Your upcoming trips</h3>";
    for (const tripEntry of tripEntries) {
        const footerContent = `
                <button class="error outlined" onclick="Client.deleteTripEntry('${tripEntry.id}')">
                <i class="fa-solid fa-trash" ></i>
                    Delete
                </button>
                `;
        renderTripEntry(tripEntry, container, footerContent);
    }
    deactivateLoading();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteTripEntry(id){
    activateLoading();
    await deleteTravelBookEntry(id);
    await loadAndRenderTripEntries();
    showFeedback("success", "Trip successfully deleted");
    deactivateLoading();
    window.scrollTo({ top: 0, behavior: "smooth" });
}


export {
    deleteTripEntry,
    renderTripEntry,
    loadAndRenderTripEntries
};