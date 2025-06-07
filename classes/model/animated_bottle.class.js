/**
 * Animated bottle game object with rotation and splash animation
 * @class AnimatedBottle
 * @extends AnimatedGameObject
 * @description Represents a bottle that rotates in the air, falls with physics, and splashes on ground impact
 */
class AnimatedBottle extends AnimatedGameObject {
    /**
     * Creates a new AnimatedBottle instance
     * @constructor
     * @param {number} x - X position on the canvas
     * @param {number} y - Y position on the canvas
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading assets and sounds
     * @param {number} groundY - Y coordinate of the ground level
     * @param {number} speedX - Horizontal speed of the bottle
     * @param {number} [animationSpeed=100] - Speed of animation frame changes in milliseconds
     * @description Initializes bottle with physics properties, animation, and splash effect
     */
    constructor(x, y, canvas, assetManager, groundY, speedX, animationSpeed = 100) {
        super(x, y, canvas, assetManager, 'bottle_rotation');
        this.scale = 0.2;
        this.animationSpeed = animationSpeed;
        super.setDimensions(this.scale);
        this.speedX = speedX; 
        this.speedY = -12; 
        this.gravity = 0.8;
        this.groundY = groundY; 
        this.isGrounded = false;
        this.splashDuration = 500; 
        this.splashStartTime = null;
        this.isSplashing = false;
        this.markedForRemoval = false;
        this.currentAssetType = 'bottle_rotation';
        this.currentImageIndex = 0;
        this.setCurrentImage();
        this.lastAnimationTime = Date.now(); 
        
    }
    
    /**
     * Sets the current image frame based on splash state
     * @description Uses splash frames if splashing, otherwise bottle rotation frames
     */
    setCurrentImage() {
        if (this.isSplashing) super.setImageByIndex(this.currentImageIndex, 'splash');
        else super.setImageByIndex(this.currentImageIndex, 'bottle_rotation');
    }
    
    /**
     * Animates the bottle or splash animation
     * @description Plays rotation animation while airborne, splash animation on ground
     */
    animate() {
        if (this.isGrounded && !this.isSplashing) this.handleGroundHit();
        if (!this.isSplashing) {
            const frameCount = this.assetManager.getAssetCount('bottle_rotation');
            super.animateFrames(frameCount);
        } else {
            const currentTime = Date.now();
            if (currentTime - this.splashStartTime >= this.splashDuration) this.markedForRemoval = true;
            const splashFrameCount = this.assetManager.getAssetCount('splash');
            super.animateFrames(splashFrameCount, false);
        }
    }
    
     /**
     * Handles the bottle hitting the ground and starting splash animation
     * @description Sets splash state, resets animation, and plays splash sound
     */
    handleGroundHit() {
        this.isSplashing = true;
        this.currentAssetType = 'splash';
        this.currentImageIndex = 0;
        this.setCurrentImage();
        this.splashStartTime = Date.now();
        this.assetManager.playSound('bottle_smash');
    }
    
    /**
     * Updates physics for bottle movement and collision
     * @description Applies horizontal and vertical movement, gravity, and ground collision detection
     */
    updatePhysics() {
        if (!this.isGrounded) {
            this.x += this.speedX; 
            this.speedY += this.gravity;
            this.y += this.speedY;
            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.speedY = 0;
                this.isGrounded = true;
            }
        }
    }

}
