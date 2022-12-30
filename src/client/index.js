import {cancelTripSearch, saveTripAndReload, searchNewTrip} from "./js/tripsearch.js";
import "./styles/index.scss";
import {loadAndRenderTripEntries,deleteTripEntry} from "./js/tripentry.js";

document.getElementById("searchdate").setAttribute("min", new Date().toISOString().split("T")[0]);
loadAndRenderTripEntries();
export {
    cancelTripSearch,
    searchNewTrip,
    saveTripAndReload,
    deleteTripEntry
};