function fullscreen() {
    const elem = document.querySelector('.canvas-wrapper');
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
        return element.requestFullscreen(); 
    } else if (element.webkitRequestFullscreen) { 
        return element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { 
        return element.msRequestFullscreen(); 
    }
    return Promise.reject(new Error("Fullscreen API not supported"));
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

function getTargetSize(baseWidth, baseHeight, fullscreen) {
    const aspect = baseWidth / baseHeight;
    if (fullscreen) {
        let width = window.innerWidth;
        let height = window.innerHeight;
        if (width / height > aspect) {
            width = height * aspect;
        } else {
            height = width / aspect;
        }
        return [width, height];
    }
    return [baseWidth, baseHeight];
}

function resizeGameArea() {
    const canvasWrapper = document.querySelector('.canvas-wrapper');
    const canvas = document.getElementById('canvas');
    if (!canvasWrapper || !canvas) return;
    let [width, height] = getTargetSize(BASE_CANVAS_WIDTH, BASE_CANVAS_HEIGHT, isFullscreen());
    if (!isFullscreen()) {
        const maxViewportWidth = window.innerWidth;
        const maxViewportHeight = window.innerHeight;
        const scale = Math.min(
            maxViewportWidth / BASE_CANVAS_WIDTH,
            maxViewportHeight / BASE_CANVAS_HEIGHT
        );
        if (scale < 1) {
            width = Math.floor(BASE_CANVAS_WIDTH * scale);
            height = Math.floor(BASE_CANVAS_HEIGHT * scale);
        }
    }
    canvasWrapper.style.width = width + "px";
    canvasWrapper.style.height = height + "px";
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
}

/* function calculateCanvasSize() {
    let [width, height] = getTargetSize(BASE_CANVAS_WIDTH, BASE_CANVAS_HEIGHT, isFullscreen());
    
    if (!isFullscreen()) {
        const maxViewportWidth = window.innerWidth;
        const maxViewportHeight = window.innerHeight;
        const scale = Math.min(
            maxViewportWidth / BASE_CANVAS_WIDTH,
            maxViewportHeight / BASE_CANVAS_HEIGHT
        );
        if (scale < 1) {
            width = Math.floor(BASE_CANVAS_WIDTH * scale);
            height = Math.floor(BASE_CANVAS_HEIGHT * scale);
        }
    }
    return { width, height };
}

function resizeGameArea() {
    const canvasWrapper = document.querySelector('.canvas-wrapper');
    const canvas = document.getElementById('canvas');
    if (!canvasWrapper || !canvas) return;
    
    const { width, height } = calculateCanvasSize();
    
    canvasWrapper.style.width = width + "px";
    canvasWrapper.style.height = height + "px";
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
} */


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

function handleFullscreenChanges() {
    const isFs = isFullscreen();
    const elementsToToggle = {
        'game-button': 'game-button-fullscreen',
        'how-to-play-content': 'how-to-play-content-fullscreen',
        'keyboard-table': 'keyboard-table-fullscreen',
        'buttons-start-screen': 'buttons-start-screen-fullscreen',
        'buttons-end-screen': 'buttons-start-end-fullscreen',
        'buttons-game-started': 'buttons-game-started-fullscreen',
        'jump-btn': 'jump-btn-fullscreen',
        'throw-btn': 'throw-btn-fullscreen',
        'left-btn': 'left-btn-fullscreen',
        'right-btn': 'right-btn-fullscreen',
        'sound-btn': 'sound-btn-fullscreen',
        'pause-btn': 'pause-btn-fullscreen',
        'fullscreen-btn': 'fullscreen-btn-fullscreen',
        'quit-btn': 'quit-btn-fullscreen'
    };
    Object.entries(elementsToToggle).forEach(([baseClass, fsClass]) => {
        document.querySelectorAll(`.${baseClass}`).forEach(el => {
            el.classList.toggle(fsClass, isFs);
        });
    });
    const headline = document.getElementById('headline');
    if (headline) headline.classList.toggle('d-none', isFs);
}

 

