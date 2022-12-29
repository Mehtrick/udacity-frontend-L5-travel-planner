import {activateLoading, deactivateLoading} from "./loading.js";
import {hideFeedback, showFeedback} from "./feedback.js";

function searchNewDestination(){
    event.preventDefault();

    activateLoading();
    deactivateLoading();
    showFeedback("alert","kaputt");
    hideFeedback();

}

export {
    searchNewDestination
};