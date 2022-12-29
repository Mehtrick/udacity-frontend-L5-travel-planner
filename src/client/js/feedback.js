function showFeedback(type, message) {
    document.getElementById(type).classList.remove("hidden");
    document.getElementById(`${type}-message`).innerText = message;
}

function hideFeedback(){
    const feedbacks = document.querySelector(".feedback-panel").children;
    for (const feedback of feedbacks) {
        feedback.classList.add("hidden");
    }
}

export {
    showFeedback,
    hideFeedback
};