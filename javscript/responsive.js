const canvas = document.getElementById('canvas');
const BASE_CANVAS_WIDTH = parseInt(canvas.getAttribute('width')) || 720;
const BASE_CANVAS_HEIGHT = parseInt(canvas.getAttribute('height')) || 480;

function getTargetSize(baseWidth, baseHeight) {
    return [baseWidth, baseHeight];
}

function calculateCanvasSize() {
    let [width, height] = getTargetSize(BASE_CANVAS_WIDTH, BASE_CANVAS_HEIGHT);
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
    return { width, height };
}

function resizeGameArea() {
    console.log('resizeGameArea called'); // Debug
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
    updateCanvasCssVars();
    updateGameObjectScales();
} 

function setupResizeHandlers() {
    if (!setupResizeHandlers.isSetup) {
        window.addEventListener('resize', resizeGameArea);
        window.addEventListener('DOMContentLoaded', resizeGameArea);
        setupResizeHandlers.isSetup = true;
    }
}
setupResizeHandlers();

function updateCanvasCssVars() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const width = canvas.width;   
    const height = canvas.height; 
    document.documentElement.style.setProperty('--canvas-width', width + 'px');
    document.documentElement.style.setProperty('--canvas-height', height + 'px');
}

function updateGameObjectScales() {
    const gameObjects = window.game?.currentLevel?.gameObjects;
    if (gameObjects && Array.isArray(gameObjects)) {
        gameObjects.forEach(obj => {
            if (obj.updateDimensions) {
                obj.updateDimensions();
            }
        });
    } else {
        console.log('No gameObjects found or game not initialized yet');
    }
}

 

