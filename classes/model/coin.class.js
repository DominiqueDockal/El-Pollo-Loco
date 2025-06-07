/**
 * Animated coin game object representing collectible coins
 * @class Coin
 * @extends AnimatedGameObject
 * @description Represents a coin in the game with animation and collection sound effects
 */
class Coin extends AnimatedGameObject {
     /**
     * Creates a new Coin instance
     * @constructor
     * @param {number} x - X position on the canvas
     * @param {number} y - Y position on the canvas
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading assets and sounds
     * @param {number} [animationSpeed=400] - Speed of animation frame changes in milliseconds
     * @description Initializes coin with scaling, animation properties, and sets initial image and dimensions
     */
    constructor(x, y, canvas, assetManager, animationSpeed = 400) {
        super(x, y, canvas, assetManager, 'coin', 0); 
        this.scale = 0.25;
        this.animationSpeed = animationSpeed; 
        this.currentImageIndex = 0;
        this.lastAnimationTime = 0;
        this.setCurrentImage();
        super.setDimensions(this.scale);
    }
    
    /**
     * Sets the current image frame for the coin
     * @description Updates the displayed image using the current animation frame index
     */
    setCurrentImage() {
        super.setImageByIndex(); 
    }
    
    /**
     * Animates the coin by cycling through available frames
     * @description Retrieves frame count from asset manager and delegates to parent animation method
     * @requires AssetManager with getAssetCount method for 'coin' type
     */
    animate() {
        const frameCount = this.assetManager.getAssetCount(this.type);
        super.animateFrames(frameCount);
    }
    
    /**
     * Plays the coin collection sound effect
     * @description Triggers audio feedback when the coin is collected by the player
     * @requires AssetManager with 'coin_collect' sound asset loaded
     */
    collected() {
        this.assetManager.playSound('coin_collect');
    }

}
