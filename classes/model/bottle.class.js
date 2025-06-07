/**
 * Collectible bottle game object representing bottles scattered on the ground
 * @class Bottle
 * @extends GameObject
 * @description Represents a collectible bottle with random appearance and collection sound effects
 */
class Bottle extends GameObject {
    /**
     * Creates a new Bottle instance
     * @constructor
     * @param {number} x - X position on the canvas
     * @param {number} y - Y position on the canvas
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading assets and sounds
     * @description Initializes bottle with random appearance, scaling, and sets dimensions
     */
    constructor(x, y, canvas, assetManager) {
        super(x, y, canvas, assetManager, 'bottle_ground');
        this.scale = 0.2;
        this.setCurrentImage(); 
        super.setDimensions(this.scale);
    }
    
    /**
     * Sets a random bottle image from available bottle ground assets
     * @description Randomly selects one of the available bottle variants to create visual variety
     * @requires AssetManager with getAssetsMetadata method and 'bottle_ground' assets
     * @private
     */
    setCurrentImage() {
        const bottleAssets = this.assetManager.getAssetsMetadata('bottle_ground');
        if (bottleAssets.length > 0) {
            const randomIndex = Math.floor(Math.random() * bottleAssets.length);
            super.setImageByIndex(randomIndex, 'bottle_ground');
        }
    }
    
     /**
     * Plays the bottle collection sound effect
     * @description Triggers audio feedback when the bottle is collected by the player
     * @requires AssetManager with 'bottle_collect' sound asset loaded
     */
    collected() {
        this.assetManager.playSound('bottle_collect');
    }
}
