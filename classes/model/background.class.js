/**
 * Background game object representing the static background image
 * @class Background
 * @extends GameObject
 * @description Represents the background layer in the game, typically static and scaled to full size
 */
class Background extends GameObject {
    /**
     * Creates a new Background instance
     * @constructor
     * @param {number} x - X position on the canvas
     * @param {number} y - Y position on the canvas
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading assets
     * @description Initializes background with position and full scale
     */
    constructor(x, y, canvas, assetManager) {
        super(x, y, canvas, assetManager, 'background');
        this.scale = 1;
        this.setDimensions(this.scale);
    }

}



