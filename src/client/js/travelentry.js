import {activateLoading, deactivateLoading} from "./loading.js";
import {deleteTravelBookEntry, loadTravelBookEntries} from "./api.js";
import {showFeedback} from "./feedback.js";

function renderTravelEntry(destination, container, footerContent) {
    const daysuntil = calculateDaysUntilTrip(destination.date);
    const vdom = document.createDocumentFragment();
    const travelEntryDiv = document.createElement("div");

    travelEntryDiv.classList.add("card");
    if(!destination.id){
        travelEntryDiv.classList.add("preview");
    }
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

function calculateDaysUntilTrip(date) {
    const tripDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(tripDate - today);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

async function loadAndRenderTravelbookEntries() {
    activateLoading();
    const travelEntries = await loadTravelBookEntries();
    const container = document.getElementById("travel-entries");
    container.innerHTML = "<h3>Your upcoming journeys</h3>";
    for (const travelEntry of travelEntries) {
        const footerContent = `
                <button class="error outlined" onclick="Client.deleteTravelEntry(${travelEntry.id})">
                <i class="fa-solid fa-trash" ></i>
                    Delete
                </button>
                `;
        renderTravelEntry(travelEntry, container, footerContent);
    }
    deactivateLoading();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteTravelEntry(element){
    activateLoading();
    const id = element.attributes.id.value;
    await deleteTravelBookEntry(id);
    await loadAndRenderTravelbookEntries();
    showFeedback("success", "Trip successfully deleted");
    deactivateLoading();
    window.scrollTo({ top: 0, behavior: "smooth" });
}


export {
    deleteTravelEntry,
    renderTravelEntry,
    loadAndRenderTravelbookEntries
};