import {deleteDestinationSearch, getTravelBookEntries, saveDestination, searchNewDestination} from "./js/destinationSeach.js";

import "./styles/index.scss";

document.getElementById("searchdate").setAttribute("min", new Date().toISOString().split("T")[0]);
getTravelBookEntries();
export {
    deleteDestinationSearch,
    searchNewDestination,
    saveDestination
};