const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(mediaStream => {
            video.src = window.URL.createObjectURL(mediaStream);
            video.play();
        })
        .catch(e => console.log('User denied webcam acces.', e));
}

function paintToCanvas() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    return setInterval(draw, 16);
}

function draw() {
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    let pixels = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight);
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i+0] = pixels.data[i+0] + 100; // red
        pixels.data[i+1] = pixels.data[i+1] - 50; // green
        pixels.data[i+2] = pixels.data[i+2] * 0.5; // blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i-150] = pixels.data[i+0]; // red
        pixels.data[i+100] = pixels.data[i+1]; // green
        pixels.data[i-150] = pixels.data[i+2]; // blue
    }
    return pixels
}

function greenScreen(pixels) {
    let levels = {};

    document.querySelectorAll('.rgb input').forEach(input => {
        levels[input.name] = input.value;
    });

    for (let i = 0; i < pixels.data.length; i += 4) {
        const red = pixels.data[i+0];
        const green = pixels.data[i+1];
        const blue = pixels.data[i+2];
        const redInRange = (levels.rmin <= red && red <= levels.rmax);
        const greenInRange = (levels.gmin <= green && green <= levels.gmax);
        const blueInRange = (levels.bmin <= blue && blue <= levels.bmax);
        if (redInRange && greenInRange && blueInRange) pixels.data[i+3] = 0;
    }

    return pixels;
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    strip.insertBefore(link, strip.firstChild);
}

getVideo();
video.addEventListener('canplay', paintToCanvas);