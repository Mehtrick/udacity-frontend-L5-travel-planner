import {deleteDestinationSearch, saveDestination, searchNewDestination} from "./js/destinationSeach.js";
import "./styles/index.scss";
import {loadAndRenderTravelbookEntries,deleteTravelEntry} from "./js/travelentry.js";

document.getElementById("searchdate").setAttribute("min", new Date().toISOString().split("T")[0]);
loadAndRenderTravelbookEntries();
export {
    deleteDestinationSearch,
    searchNewDestination,
    saveDestination,
    deleteTravelEntry
};