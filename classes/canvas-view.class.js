/**
 * Canvas-based view implementation for rendering game objects
 * @class CanvasView
 * @extends View
 * @description Concrete implementation of View that renders game objects to an HTML5 Canvas element
 */
class CanvasView extends View {
    /**
     * Canvas-based view implementation for rendering game objects
     * @class CanvasView
     * @extends View
     * @description Concrete implementation of View that renders game objects to an HTML5 Canvas element
     */
    constructor(canvasElement) {
        super();
        this.canvas = canvasElement;
        this.context = canvasElement.getContext('2d');
        this.camera_x = -50;
    }
    
    /**
     * Renders all game objects to the canvas with camera translation
     * @param {Array} gameObjects - Array of game objects to render
     * @description Renders in two passes: world objects with camera translation, then fixed UI objects
     * @override
     */
    render(gameObjects) {
        this.clear();
        this.translateCamera(); 
        gameObjects.filter(obj => !obj.isFixed).forEach(gameObject => {
            this.renderGameObject(gameObject);
        });
        this.resetCameraTranslation();
        gameObjects.filter(obj => obj.isFixed).forEach(gameObject => {
            this.renderGameObject(gameObject);
        });
    }
    
     /**
     * Renders a single game object to the canvas
     * @param {Object} gameObject - The game object to render
     * @param {HTMLImageElement} gameObject.img - Image to render
     * @param {number} gameObject.x - X position
     * @param {number} gameObject.y - Y position
     * @param {number} gameObject.width - Width of the object
     * @param {number} gameObject.height - Height of the object
     * @param {boolean} [gameObject.otherDirection] - Whether to flip the image horizontally
     * @description Skips rendering if image is not loaded or width is zero, handles image flipping
     */
    renderGameObject(gameObject) {
        if (!gameObject.img?.complete || gameObject.width === 0) return;
        if (gameObject.otherDirection) this.flipImage(gameObject);  
        else this.context.drawImage(gameObject.img,gameObject.x,gameObject.y,gameObject.width,gameObject.height);
    }
    
    /**
     * Clears the entire canvas
     * @description Removes all drawn content from the canvas
     * @override
     */
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Applies camera translation to the rendering context
     * @description Saves current context state and translates by camera offset
     */
    translateCamera() {
        this.context.save();
        this.context.translate(this.camera_x, 0);
    }
    
    /**
     * Resets camera translation to original state
     * @description Restores the previously saved context state
     */
    resetCameraTranslation() {
        this.context.restore(); 
    }

     /**
     * Renders a game object with horizontal flipping
     * @param {Object} gameObject - The game object to render flipped
     * @param {HTMLImageElement} gameObject.img - Image to render
     * @param {number} gameObject.x - X position
     * @param {number} gameObject.y - Y position
     * @param {number} gameObject.width - Width of the object
     * @param {number} gameObject.height - Height of the object
     * @description Creates a horizontally mirrored version of the image using canvas transformations
     */
    flipImage(gameObject) {
        this.context.save();
        this.context.translate(gameObject.x + gameObject.width, gameObject.y);
        this.context.scale(-1, 1);
        this.context.drawImage(gameObject.img, 0, 0, gameObject.width, gameObject.height);
        this.context.restore();
    }    
}

