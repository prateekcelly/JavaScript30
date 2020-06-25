const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress__filled");
const toggle = document.querySelector(".toggle");
const skipButtons = document.querySelectorAll("[data-skip]");
const ranges = document.querySelectorAll(".player__slider");
const enlarge = document.querySelector(".enlarge");

function togglePlay() {
  video.paused ? video.play() : video.pause();
}

function updateButton() {
  const icon = this.paused ? "►" : "❚ ❚";
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate(e) {
  video[e.target.name] = e.target.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

let volumeValue = 0;
function handleKeyBoardEvents(e) {
  switch (e.keyCode) {
    case 37:
      skipButtons[0].click();
      break;
    case 39:
      skipButtons[1].click();
      break;
    case 38:
      volumeValue = parseFloat(ranges[0].value);
      if (volumeValue < ranges[0].max)
        volumeValue += parseFloat(ranges[0].step);
      ranges[0].value = volumeValue;
      video[ranges[0].name] = volumeValue;
      break;
    case 40:
      volumeValue = parseFloat(ranges[0].value);
      if (volumeValue > ranges[0].min)
        volumeValue -= parseFloat(ranges[0].step);
      ranges[0].value = volumeValue;
      video[ranges[0].name] = volumeValue;
      break;
    case 32:
      toggle.click();
    default:
      break;
  }
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    video.requestFullscreen().catch((err) => {
      alert(
        `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
      );
    });
  } else {
    document.exitFullscreen();
  }
}

video.addEventListener("click", togglePlay);
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
video.addEventListener("timeupdate", handleProgress);
video.addEventListener("keydown", handleKeyBoardEvents);

toggle.addEventListener("click", togglePlay);

skipButtons.forEach((button) => {
  button.addEventListener("click", skip);
});

let mouseDownOnRange = false;
ranges.forEach((range) => {
  range.addEventListener("change", handleRangeUpdate);
  range.addEventListener("mousedown", () => (mouseDownOnRange = true));
  range.addEventListener("mouseup", () => (mouseDownOnRange = false));
  range.addEventListener(
    "mousemove",
    (e) => mouseDownOnRange && handleRangeUpdate(e)
  );
});

let mouseDownOnProgress = false;
progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", (e) => mouseDownOnProgress && scrub(e));
progress.addEventListener("mousedown", () => (mouseDownOnProgress = true));
progress.addEventListener("mouseup", () => (mouseDownOnProgress = false));

enlarge.addEventListener("click", toggleFullScreen);
