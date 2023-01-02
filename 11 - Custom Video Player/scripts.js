function initModel() {
    const [player, video, playButton, progressBar, volumeSlider, playbackSlider, skipBackButton, skipForwardButton] =
          ["div.player", "video", "button.player__button", ".progress", "input[name='volume']", "input[name='playbackRate']", "button[data-skip='-10']", "button[data-skip='25']"]
            .map(query => {return document.querySelector(query);});

    const model = new Map();

    model.set("isSeeking", false);

    model.set("player", player);
    model.set("video", video);
    model.set("playButton", playButton);
    model.set("progressBar", progressBar);
    model.set("volumeSlider", volumeSlider);
    model.set("playbackSlider", playbackSlider);
    model.set("skipBackButton", skipBackButton);
    model.set("skipForwardButton", skipForwardButton);

    return model;
}

function fetch(model, keys) {
    return keys.map(k => {return model.get(k);});
}

function togglePlay(model) {
    model.get("video").paused ? play(model) : pause(model);
}

function play(model) {
    const [video, playButton] = fetch(model, ["video", "playButton"]);

    video.play();
    playButton.textContent = "❚❚";
}

function pause(model) {
    const [video, playButton] = fetch(model, ["video", "playButton"]);

    video.pause();
    playButton.textContent = "►";
}

function handleTimeUpdate(model) {
    const video = model.get("video");

    setProgressBar(model, calculateProgress(video));
}

function calculateProgress(video) {
    return `${(video.currentTime / video.duration) * 100}%`;
}

function setProgressBar(model, value) {
    const progressBar = model.get("progressBar");
    const progressBarFilled = progressBar.firstElementChild;

    progressBarFilled.style.setProperty("flex-basis", value);
}

function toggleSeeking(model, value) {
    model.set("isSeeking", value);
}

function maybeSeek(model, event) {
    model.get("isSeeking") ? seek(model, event) : null;
}

function seek(model, event) {
    const video = model.get("video");
    const videoWidth = 640;
    const newTime = (event.layerX / videoWidth) * video.duration;

    video.fastSeek(newTime);
}

function setVolume(model) {
    const [video, volumeSlider] = fetch(model, ["video", "volumeSlider"]);

    video.volume = volumeSlider.value;
}

function setPlaybackRate(model) {
    const [video, playbackSlider] = fetch(model, ["video", "playbackSlider"]);

    video.playbackRate = playbackSlider.value;
}

function skip(model, value) {
    const video = model.get("video");

    video.fastSeek(video.currentTime + value);
}

function addEventListeners(model) {
    const [video, playButton, progressBar, volumeSlider, playbackSlider, skipBackButton, skipForwardButton] =
          fetch(model, ["video", "playButton", "progressBar", "volumeSlider", "playbackSlider", "skipBackButton", "skipForwardButton"]);

    video.addEventListener("click", () => togglePlay(model));
    video.addEventListener("timeupdate", () => handleTimeUpdate(model));
    playButton.addEventListener("click", () => togglePlay(model));
    progressBar.addEventListener("mousedown", () => toggleSeeking(model, true));
    progressBar.addEventListener("mouseup", () => toggleSeeking(model, false));
    progressBar.addEventListener("mousemove", e => maybeSeek(model, e))
    progressBar.addEventListener("click", e => seek(model, e));
    volumeSlider.addEventListener("change", () => setVolume(model));
    playbackSlider.addEventListener("change", () => setPlaybackRate(model));
    skipBackButton.addEventListener("click", () => skip(model, -10));
    skipForwardButton.addEventListener("click", () => skip(model, 25));
}

function init() {
    const model = initModel();

    setProgressBar(model, 0);
    addEventListeners(model);
}

init();
