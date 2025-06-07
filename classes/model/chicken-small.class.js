/**
 * Small chicken enemy game object with walking animation and death mechanics
 * @class ChickenSmall
 * @extends AnimatedGameObject
 * @description Represents a small chicken enemy that walks left continuously and can be killed with death animation
 */
class ChickenSmall extends AnimatedGameObject {
    /**
     * Creates a new ChickenSmall instance
     * @constructor
     * @param {number} x - X position on the canvas
     * @param {number} y - Y position on the canvas
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading assets and sounds
     * @param {number} [animationSpeed=300] - Speed of animation frame changes in milliseconds
     * @description Initializes small chicken with random walking speed, death mechanics, and hit detection
     */
    constructor(x, y, canvas, assetManager, animationSpeed = 300) {
        super(x, y, canvas, assetManager, 'chicken_small_walk', AnimatedGameObject.randomSpeed(1,1.5)); 
        this.scale = 0.2; 
        this.animationSpeed = animationSpeed; 
        this.currentImageIndex = 0;
        this.lastAnimationTime = 0;
        this.isDead = false;
        this.deathTime = 0;
        this.deathDuration = 800;
        this.markedForRemoval = false;
        this.setCurrentImage();
        super.setDimensions(this.scale);
        this.canHit = true;
        this.lastHitTime = 0;
        this.hitCooldown = 1000; 
    }
    
    /**
     * Sets the current image frame based on death state
     * @description Uses dead frame if killed, otherwise walking animation frames
     */
    setCurrentImage() {
        if (this.isDead) super.setImageByIndex(0, 'chicken_small_dead');
        else super.setImageByIndex(this.currentImageIndex, 'chicken_small_walk');
    }
    
    /**
     * Animates the chicken movement and handles death timing
     * @description Plays walking animation and moves left when alive, manages removal timing when dead
     */
    animate() {
        if (this.isDead) {
            const currentTime = Date.now();
            if (currentTime - this.deathTime >= this.deathDuration) this.markedForRemoval = true;
            return; 
        } 
        const frameCount = this.assetManager.getAssetCount('chicken_small_walk');
        super.animateFrames(frameCount);
        this.moveLeft();
    }
    
    /**
     * Kills the chicken and starts death sequence
     * @description Changes to death state, plays death sound, and starts death timer
     * @requires AssetManager with 'chicken_dead' sound asset
     */
    kill() {
        if (!this.isDead) {
            this.isDead = true;
            this.deathTime = Date.now(); 
            this.setCurrentImage(); 
            this.assetManager.playSound('chicken_dead');
        }
    }
}
