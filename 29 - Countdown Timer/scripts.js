let countdown;
let start;
let end;

const timeLeft = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function update() {
    const secondsLeft = Math.round((end - Date.now()) / 1000);
    if (secondsLeft < 0) return clearInterval(countdown);
    displayTimeLeft(secondsLeft);
}

function timer(seconds) {
    clearInterval(countdown);
    start = Date.now();
    end = start + seconds * 1000;
    countdown = setInterval(update, 1000);
    displayTimeLeft(seconds)
    displayEndTime(end);
}

function displayTimeLeft(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const display = `${mins}:${pad(secs)}`
    timeLeft.textContent = display;
    document.title = display;
}

function displayEndTime(timestamp) {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const min = date.getMinutes();
    endTime.textContent = `Be back at ${twelveHourClock(hour)}:${pad(min)}`;
}

function twelveHourClock(hour) {
    if (hour > 12) return hour - 12;
    return hour;
}

function pad(num) {
    if (num < 10) return '0' + num;
    return num;
}

function startTimer() {
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));

document.customForm.addEventListener('submit', function(e) {
    e.preventDefault();
    timer(this.minutes.value * 60);
    this.reset();
});