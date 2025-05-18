function fullscreen() {
    const elem = document.querySelector('.content-wrapper');
    if (!isFullscreen()) {
        enterFullscreen(elem)
            .then(() => {
                resizeGameArea();
                handleFullscreenChanges();
            }) 
            .catch((err) => console.error("Fullscreen error:", err));
    } else {
        exitFullscreen();
        resizeGameArea();
        handleFullscreenChanges();
    }
}

function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { 
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { 
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { 
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { 
        document.msExitFullscreen();
    }
}

function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}


const canvas = document.getElementById('canvas');
const BASE_CANVAS_WIDTH = parseInt(canvas.getAttribute('width')) || 720;
const BASE_CANVAS_HEIGHT = parseInt(canvas.getAttribute('height')) || 480;

function resizeGameArea() {
    const contentWrapper = document.querySelector('.content-wrapper');
    const canvas = document.getElementById('canvas');
    if (!contentWrapper || !canvas) return;
    const aspect = BASE_CANVAS_WIDTH / BASE_CANVAS_HEIGHT;
    let width, height;
    if (isFullscreen()) {
        width = window.innerWidth;
        height = window.innerHeight;
        if (width / height > aspect) {
            width = height * aspect;
        } else {
            height = width / aspect;
        }
    } else {
        width = BASE_CANVAS_WIDTH;
        height = BASE_CANVAS_HEIGHT;
    }
    contentWrapper.style.width = width + "px";
    contentWrapper.style.height = height + "px";
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
} 

function setupFullscreenHandlers() {
    if (!setupFullscreenHandlers.isSetup) {
        document.addEventListener('fullscreenchange', () => {
            resizeGameArea();
            handleFullscreenChanges();
        });
        window.addEventListener('resize', resizeGameArea);
        window.addEventListener('DOMContentLoaded', resizeGameArea);
        setupFullscreenHandlers.isSetup = true;
    }
}
setupFullscreenHandlers();

function setButtonFullscreenStyle(isFs) {
    document.querySelectorAll('.game-button').forEach(btn => {
        btn.classList.toggle('fullscreen-size', isFs);
    });
}

function handleFullscreenChanges() {
    const headline = document.getElementById('headline');
    const isFs = isFullscreen();
    if (headline) headline.classList.toggle('d-none', isFs);
    setButtonFullscreenStyle(isFs);
} 

