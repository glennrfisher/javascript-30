const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = progress.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

function togglePlay() {
    video.paused ? video.play() : video.pause();
}

function skip() {
    const skip = this.dataset.skip;
    video.currentTime += parseFloat(skip);
}

function updateRange() {
    video[this.name] = this.value;
}

function updateProgress() {
    const percent = video.currentTime / video.duration * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    const fraction = e.offsetX / progress.offsetWidth;
    video.currentTime = fraction * video.duration;
}

video.addEventListener('click', togglePlay);
video.addEventListener('play', _ => toggle.textContent = '❚ ❚');
video.addEventListener('pause', _ => toggle.textContent = '►');
video.addEventListener('timeupdate', updateProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', updateRange));
ranges.forEach(range => range.addEventListener('mousemove', updateRange));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', e => mousedown && scrub(e));
progress.addEventListener('mousedown', _ => mousedown = true);
progress.addEventListener('mouseup', _ => mousedown = false);