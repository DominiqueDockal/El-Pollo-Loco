/**
 * Abstract base class for game objects with animation and physics capabilities
 * @abstract
 * @class AnimatedGameObject
 * @extends GameObject
 * @description Provides animation, movement, and physics functionality for game objects. Cannot be instantiated directly.
 * @throws {TypeError} Throws error when attempting to instantiate directly
 */
class AnimatedGameObject extends GameObject {
    /**
     * Generates a random speed value within the specified range
     * @static
     * @param {number} [min=1] - Minimum speed value
     * @param {number} [max=1] - Maximum speed value
     * @returns {number} Random speed value between min and max
     * @description Utility method for creating random movement speeds
     */
    static randomSpeed(min = 1, max = 1) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Creates a new AnimatedGameObject instance
     * @constructor
     * @param {number} x - X position on the canvas
     * @param {number} y - Y position on the canvas
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading assets
     * @param {string} assetType - Type of asset to load
     * @param {number} [speed=1] - Horizontal movement speed
     * @throws {TypeError} Throws error if called on AnimatedGameObject class directly (abstract class protection)
     * @description Initializes animated game object with physics and animation properties
     */
    constructor(x, y, canvas, assetManager, assetType, speed = 1) {
        if (new.target === AnimatedGameObject) throw new TypeError('Cannot instantiate abstract class AnimatedGameObject directly');

        super(x, y, canvas, assetManager, assetType);
        this.speed = speed;
        this.speedY = 0;         
        this.gravity = 0.5;   
        this.isGrounded = true;
        this.jumpForce = -12; 
        this.groundY = y; 
        this.lastAnimationTime = 0;   
    }
    
    /**
     * Moves the object left by its speed value
     * @description Decreases X position by the object's speed
     */
    moveLeft() {
        this.x -= this.speed;
    }
    
    /**
     * Moves the object right by its speed value
     * @description Increases X position by the object's speed
     */
    moveRight() {
        this.x += this.speed;
    }
    
    /**
     * Updates physics simulation including gravity and ground collision
     * @description Applies gravity when airborne, updates vertical position, and handles ground collision
     */
    updatePhysics() {
        if (!this.isGrounded) {
            this.speedY  += this.gravity; 
            this.y += this.speedY ;
            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.speedY  = 0;
                this.isGrounded = true;
            }
        }
    }
    
    /**
     * Animates through a sequence of image frames
     * @param {number} maxFrames - Total number of frames in the animation sequence
     * @param {boolean} [shouldLoop=true] - Whether the animation should loop when reaching the end
     * @description Cycles through animation frames based on animation speed timing
     * @requires this.animationSpeed property to be set for timing control
     * @requires this.currentImageIndex property for frame tracking
     * @requires setCurrentImage() method for updating displayed image
     */
    animateFrames(maxFrames, shouldLoop = true) {
        const currentTime = Date.now();
        if (currentTime - this.lastAnimationTime >= this.animationSpeed) {
            if (shouldLoop) this.currentImageIndex = (this.currentImageIndex + 1) % maxFrames;
            else if (this.currentImageIndex < maxFrames - 1) this.currentImageIndex++;
            this.setCurrentImage();
            this.lastAnimationTime = currentTime;
        }
    }
}


