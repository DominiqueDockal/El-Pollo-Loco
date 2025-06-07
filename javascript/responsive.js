const canvas = document.getElementById('canvas');
const BASE_CANVAS_WIDTH = parseInt(canvas.getAttribute('width')) || 720;
const BASE_CANVAS_HEIGHT = parseInt(canvas.getAttribute('height')) || 480;

/**
 * Returns the target size for the canvas
 * @param {number} baseWidth - The base width to use
 * @param {number} baseHeight - The base height to use
 * @returns {number[]} Array containing [width, height]
 */
function getTargetSize(baseWidth, baseHeight) {
    return [baseWidth, baseHeight];
}

/**
 * Calculates the optimal canvas size based on viewport dimensions
 * @returns {{width: number, height: number}} Object containing calculated width and height
 * @description Scales down canvas proportionally if it doesn't fit in the viewport
 */
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

/**
 * Resizes the game area including canvas wrapper and canvas element
 * @description Updates both CSS dimensions and canvas internal dimensions, then triggers related updates
 * @requires DOM elements with class 'canvas-wrapper' and ID 'canvas' must exist
 */
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
    updateCanvasCssVars();
    updateGameObjectScales();
}  

/**
 * Sets up event listeners for window resize and DOM content loaded events
 * @description Uses a static property to prevent duplicate event listener registration
 * @static
 */
function setupResizeHandlers() {
    if (!setupResizeHandlers.isSetup) {
        window.addEventListener('resize', resizeGameArea);
        window.addEventListener('DOMContentLoaded', resizeGameArea);
        setupResizeHandlers.isSetup = true;
    }
}
setupResizeHandlers();

/**
 * Updates CSS custom properties with current canvas dimensions
 * @description Sets --canvas-width and --canvas-height CSS variables on document root
 * @requires DOM element with ID 'canvas' must exist
 */
function updateCanvasCssVars() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const width = canvas.width;   
    const height = canvas.height; 
    document.documentElement.style.setProperty('--canvas-width', width + 'px');
    document.documentElement.style.setProperty('--canvas-height', height + 'px');
}

/**
 * Updates dimensions of all game objects in the current level
 * @description Calls updateDimensions() method on each game object that supports it
 * @requires window.game.currentLevel.gameObjects array to exist
 */
function updateGameObjectScales() {
    const gameObjects = window.game?.currentLevel?.gameObjects;
    if (gameObjects && Array.isArray(gameObjects)) gameObjects.forEach(obj => {if (obj.updateDimensions) obj.updateDimensions();});
}


 

