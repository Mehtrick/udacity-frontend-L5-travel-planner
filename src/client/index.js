import {deleteDestinationSearch, saveDestination, searchNewDestination} from "./js/tripsearch.js";
import "./styles/index.scss";
import {loadAndRenderTravelbookEntries,deleteTravelEntry} from "./js/tripentry.js";

document.getElementById("searchdate").setAttribute("min", new Date().toISOString().split("T")[0]);
loadAndRenderTravelbookEntries();
export {
    deleteDestinationSearch,
    searchNewDestination,
    saveDestination,
    deleteTravelEntry
};