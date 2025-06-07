/**
 * End boss enemy with complex AI behavior and state management
 * @class Endboss
 * @extends AnimatedGameObject
 * @description Represents the level end boss with distance-based AI, health system, and multiple behavioral states
 */
class Endboss extends AnimatedGameObject {
    /**
     * Creates a new Endboss instance
     * @constructor
     * @param {number} x - Initial X position on the canvas
     * @param {number} y - Initial Y position on the canvas
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading assets and sounds
     * @param {number} [animationSpeed=100] - Speed of animation frame changes in milliseconds
     * @description Initializes end boss with AI behavior, health system, and animation properties
     */
    constructor(x, y, canvas, assetManager, animationSpeed = 100) {
        super(x, y, canvas, assetManager, 'endboss_alert', 6);
        this.scale = 0.8;
        this.animationSpeed = animationSpeed;
        this.currentImageIndex = 0;
        this.lastAnimationTime = 0;
        this.isHurt = false;
        this.isDead = false;
        this.currentAssetType = 'endboss_alert';
        this.canHit = true;
        this.lastHitTime = 0;
        this.hitCooldown = 500;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.deathTime = null;
        this.endbossBar = null;
        this.character = null;
        this.isAttacking = false;
        this.isWalking = false;
        super.setDimensions(this.scale);
        this.startX = this.x;
        this.hasEngaged = false; 
        this.isReturning = false;
        this.nextAttackSoundTime = 0;
        this.returnCooldown = 4000;
        this.initialEngageTime = null;
    }
    
     /**
     * Sets the boss health status bar
     * @param {Statusbar} endbossBar - Boss health status bar
     * @description Links boss to UI health bar element for automatic updates
     */
    setEndbossBar(endbossBar) {
        this.endbossBar = endbossBar;
    }
    
    /**
     * Sets the player character reference for AI behavior
     * @param {Character} character - Player character instance
     * @description Links boss to player character for distance-based AI behavior
     */
    setCharacter(character){
        this.character = character;
    }
    
    /**
     * Sets the current image frame for rendering
     * @description Updates displayed image using current asset type and frame index
     */
    setCurrentImage() {
        super.setImageByIndex(this.currentImageIndex, this.currentAssetType);
    }
    
    /**
     * Applies damage to the boss and updates health
     * @param {number} damage - Amount of damage to apply
     * @description Reduces health, plays hurt sound, updates health bar, and handles death
     */
    hurt(damage) {
        const now = Date.now();
        if (now - this.lastHitTime < this.hitCooldown) return;
        this.isHurt = true;
        this.health = Math.max(0, this.health - damage);
        this.lastHitTime = now;
        if (!this.isDead) this.assetManager.playSound('endboss_hurt');
        if (this.endbossBar) {
            const percent = (this.health / this.maxHealth) * 100;
            const step = Math.floor(percent / 20) * 20;
            this.endbossBar.setValue(step);
            if (step === 0) this.handleDeath(now);
        }
    }
    
    /**
     * Applies damage to the boss and updates health
     * @param {number} damage - Amount of damage to apply
     * @description Reduces health, plays hurt sound, updates health bar, and handles death
     */
    handleDeath(now) {
        this.isDead = true;
        this.deathTime = now;
        this.assetManager.stopSound('endboss_hurt');
        this.assetManager.playSound('endboss_dead');
    }
    
    /**
     * Animates the boss based on current state
     * @description Selects appropriate animation based on boss state and plays frames
     */
    animate() {
        this.handleState();
        let assetType;
        if (this.isDead) assetType = 'endboss_dead';
        else if (this.isHurt) assetType = 'endboss_hurt';
        else if (this.isAttacking) assetType = 'endboss_attack';
        else if (this.isWalking) assetType = 'endboss_walk';
        else assetType = 'endboss_alert';
        const frameCount = this.assetManager.getAssetCount(assetType);
        if (assetType !== this.currentAssetType) {
            this.currentImageIndex = 0;
            this.currentAssetType = assetType;
        }
        super.animateFrames(frameCount);
        if (this.isHurt && this.currentImageIndex >= frameCount - 1) this.isHurt = false;
    }
    
    /**
     * Main AI state handler that determines boss behavior
     * @description Manages engagement, distance checking, and state transitions based on player position
     */
    handleState() {
        if (!this.character || this.isDead) return;
        const distance = Math.abs(this.x - this.character.x);
        const maxLeft = this.startX - 500;
        if (distance <= 500 && !this.hasEngaged) {
            this.hasEngaged = true;
            this.initialEngageTime = Date.now();
        }
        const timeSinceEngagement = Date.now() - this.initialEngageTime;
        const shouldReturn = (this.hasEngaged && timeSinceEngagement >= this.returnCooldown) || (this.hasEngaged && distance > 500);
        if (shouldReturn && !this.isReturning) {
            this.isReturning = true;
            this.otherDirection = true;
        }
        if (this.isReturning) this.handleReturn();
        else this.handleNormalState(distance, maxLeft);
    }
 
    /**
     * Handles normal AI behavior when not returning to origin
     * @param {number} distance - Distance to player character
     * @param {number} maxLeft - Maximum left boundary for boss movement
     * @description Manages in-range and out-of-range behavior based on boss position
     */
    handleNormalState(distance, maxLeft) {
        const now = Date.now();
        if (this.x > maxLeft) this.handleInRangeState(distance, now);
        else {
            this.isWalking = false;
            if (distance <= 100) {
                this.isAttacking = true;
                this.isAlert = false;
                this.handleAttack(now);
            } else {
                this.isAttacking = false;
                this.isAlert = true;
            }
        }
    }
    
    /**
     * Handles boss behavior when within movement range
     * @param {number} distance - Distance to player character
     * @param {number} now - Current timestamp
     * @description Manages walking and attacking behavior based on distance to player
     */
    handleInRangeState(distance, now) {
        if (distance <= 500) {
            this.handleWalk();
            if (distance <= 200) {
                this.isAttacking = true;
                this.isWalking = false;
                this.handleAttack(now);
            } else this.isAttacking = false;
        } else this.handleAlert();
    }
    
    /**
     * Handles attack behavior and sound timing
     * @param {number} now - Current timestamp
     * @description Manages attack sound effects with random timing intervals
     */
    handleAttack(now) {
        if (!this.isDead && now > this.nextAttackSoundTime) {
            this.assetManager.playSound('attack'); 
            this.nextAttackSoundTime = now + 1000 + Math.random() * 2000;
        }
    }
    
    /**
     * Handles walking behavior towards player
     * @description Sets walking state and moves boss left towards player
     */
    handleWalk() {
        this.isWalking = true;
        this.isAlert = false;
        if (!this.isDead) this.moveLeft();
    }
    
     /**
     * Handles alert state when player is visible but out of range
     * @description Sets boss to alert state without movement or attacking
     */
    handleAlert() {
        this.isWalking = false;
        this.isAttacking = false;
        this.isAlert = true;
    }
    
    /**
     * Handles return-to-origin behavior
     * @description Moves boss back to starting position and resets engagement state
     */
    handleReturn() {
        if (this.x < this.startX) {
            this.moveRight();
            this.isWalking = true;
            this.isAlert = false;
            this.isAttacking = false;
        } else {
            this.isReturning = false;
            this.otherDirection = false; 
            this.isWalking = false;
            this.isAlert = true;
            this.hasEngaged = false;
        }
    }
 
}
