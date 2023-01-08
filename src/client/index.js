import {cancelTripSearch, saveTripAndReload, searchNewTrip} from "./js/tripsearch.js";
import "./styles/index.scss";
import {loadAndRenderAllExistingTrips,deleteTripEntry} from "./js/tripentry.js";

//Sets the minimum search date so that you cannot select a date in the past
document.getElementById("searchdate").setAttribute("min", new Date().toISOString().split("T")[0]);

//load all existing trips
loadAndRenderAllExistingTrips();
export {
    cancelTripSearch,
    searchNewTrip,
    saveTripAndReload,
    deleteTripEntry
};