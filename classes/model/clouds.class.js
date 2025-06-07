/**
 * Animated cloud game object representing moving clouds in the game
 * @class Cloud
 * @extends AnimatedGameObject
 * @description Represents a cloud that moves horizontally across the canvas with animation and level-based appearance
 */
class Cloud extends AnimatedGameObject {
     /**
     * Creates a new Cloud instance
     * @constructor
     * @param {number} x - X position on the canvas
     * @param {number} y - Y position on the canvas
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading assets
     * @param {number} [level=1] - Level number to determine cloud appearance
     * @param {number} [cloudIndex=1] - Index to select specific cloud variant
     * @param {number} [speed=0.15] - Horizontal movement speed of the cloud
     * @description Initializes cloud with position, appearance based on level and index, and movement speed
     */
    constructor(x, y, canvas, assetManager, level = 1, cloudIndex = 1, speed = 0.15) {
        super(x, y, canvas, assetManager, 'clouds', speed);
        this.level = level;
        this.cloudIndex = cloudIndex; 
        this.scale = 1; 
        this.setCurrentImage();
        super.setDimensions(this.scale);
    }
    
    /**
     * Sets the current image of the cloud based on level and cloud index
     * @description Selects the appropriate cloud asset from asset manager metadata using level and index parameters
     * @requires AssetManager with getAssetsMetadata method and cloud assets with naming pattern '{cloudIndex}_level{level}'
     * @private
     */
    setCurrentImage() {
        const clouds = this.assetManager.getAssetsMetadata(this.type);
        const cloudAsset = clouds.find(cloud => 
            cloud.src.includes(`${this.cloudIndex}_level${this.level}`)
        );
        if (cloudAsset) this.setImage(cloudAsset.src);
    }
    
    /**
     * Animates the cloud by moving it left and wrapping around the canvas
     * @description Moves cloud left by its speed value and resets position to right side when it moves off-screen
     * @override
     */
    animate() {
        this.moveLeft();
        if (this.x < -this.width) this.x = this.canvas.clientWidth; 
    }
}
