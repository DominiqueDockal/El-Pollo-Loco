/**
 * Player character game object with animation, movement, and interaction capabilities
 * @class Character
 * @extends AnimatedGameObject
 * @description Represents the main player character with state management, input handling, and UI integration
 */
class Character extends AnimatedGameObject {
    /**
     * Creates a new Character instance
     * @constructor
     * @param {number} x - Initial X position on the canvas
     * @param {number} y - Initial Y position on the canvas
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading assets and sounds
     * @param {InputDevice} inputDevice - Input device for player controls
     * @param {Level} level - Current game level instance
     * @param {number} [animationSpeed=100] - Speed of animation frame changes in milliseconds
     * @description Initializes character with position, input, level data, and animation properties
     */
    constructor(x, y, canvas, assetManager, inputDevice, level, animationSpeed = 100) {
        super(x, y, canvas, assetManager, 'character_standing', 3);
        this.scale = 0.6;
        this.animationSpeed = animationSpeed;
        this.currentImageIndex = 0;
        this.lastAnimationTime = 0;
        this.startX = x; 
        this.level = level;
        this.levelLength = level.length; 
        this.bottleCount = level.bottleCount;
        this.coinCount = level.coinCount;
        this.leftEnd = 150;
        this.rightEnd = 400;
        this.isHurt = false;
        this.isDead = false;
        this.isSleeping = false;
        this.isMoving = false;
        this.isJumping = false;
        this.lastActiveTime = Date.now();  
        this.inputDevice = inputDevice;
        this.currentAssetType = 'character_standing';
        this.lastHitTime = 0;
        this.hitCooldown = 500;
        super.setDimensions(this.scale);
        this.bottleBar = null;
        this.healthBar = null;
        this.coinBar = null;
        this.collectedBottles = 0;
        this.collectedCoins = 0;
        this.maxHealth = 100; 
        this.health = this.maxHealth; 
        this.deathTime = null;
        this.remainingBottles = level.bottleCount;
    }
    
    /**
     * Sets the UI status bars for bottles, health, and coins
     * @param {Statusbar} bottleBar - Bottle count status bar
     * @param {Statusbar} healthBar - Health status bar
     * @param {Statusbar} coinBar - Coin count status bar
     * @description Links character to UI status bar elements for automatic updates
     */
    setStatusBars(bottleBar, healthBar, coinBar) {
        this.bottleBar = bottleBar;
        this.healthBar = healthBar;
        this.coinBar = coinBar;
    }
    
    /**
     * Calculates progress percentage for status bars
     * @param {number} collected - Number of collected items
     * @param {number} totalCount - Total number of items
     * @returns {number} Progress percentage in steps of 20
     * @description Converts collection count to 6-step progress (0, 20, 40, 60, 80, 100)
     */
    getProgressPercent(collected, totalCount) {
        if (totalCount <= 0) return 0; 
        const stepSize = totalCount / 5;
        const currentStep = Math.floor(collected / stepSize);
        return currentStep * 20;
    }
    
    /**
     * Handles bottle collection and updates bottle status bar
     * @description Increments bottle count and updates UI progress
     */
    collectBottle() {
        this.collectedBottles++;
        if (this.bottleBar && this.bottleCount > 0) {
            const percent = this.getProgressPercent(this.collectedBottles, this.bottleCount);
            this.bottleBar.setValue(percent);
        }
    }
    
     /**
     * Updates the bottle status bar based on collected bottles
     * @description Refreshes bottle status bar to reflect current collection count
     */
    updateBottleBar() {
        if (this.bottleBar) {
            const percent = this.getProgressPercent(this.collectedBottles, this.bottleCount);
            this.bottleBar.setValue(percent);
        }
    }
    
    /**
     * Handles coin collection and updates coin status bar
     * @description Increments coin count and updates UI progress
     */
    collectCoin() {
        this.collectedCoins++;
        if (this.coinBar && this.coinCount > 0) {
            const percent = this.getProgressPercent(this.collectedCoins, this.coinCount);
            this.coinBar.setValue(percent);
        }
    }
    
    /**
     * Updates character state based on input and conditions
     * @description Checks sleep state, processes input, and updates movement/jumping flags
     */
    handleState() {
        this.checkSleepState();
        this.action();
        this.isMoving = this.inputDevice.isPressed('LEFT') || this.inputDevice.isPressed('RIGHT');
        this.isJumping = !this.isGrounded;
    }

    /**
     * Animates the character based on current state
     * @description Selects appropriate animation based on character state and plays frames
     */
    animate() {
        this.handleState();
        let assetType;
        if (this.isDead) assetType = 'character_dead';
        else if (this.isHurt) assetType = 'character_hurt';
        else if (this.isSleeping) assetType = 'character_sleeping';
        else if (this.isJumping) assetType = 'character_jumping';
        else if (this.isMoving) assetType = 'character_walking';
        else assetType = 'character_standing';
        const frameCount = this.assetManager.getAssetCount(assetType);
        if (assetType !== this.currentAssetType) {
            this.currentImageIndex = 0;
            this.currentAssetType = assetType;
        }
        super.animateFrames(frameCount);
        if (this.isHurt && this.currentImageIndex >= frameCount - 1) this.isHurt = false;
    }
    
    /**
     * Sets the current image frame for rendering
     * @description Updates displayed image using current asset type and frame index
     */
    setCurrentImage() {
        super.setImageByIndex(this.currentImageIndex, this.currentAssetType);
    }
    
    /**
     * Handles character actions based on input
     * @description Processes movement, jumping, and throwing input while respecting boundaries
     */
    action() {
        if (this.isDead) return; 
        if (this.inputDevice.isPressed('LEFT')) {
            this.otherDirection = true;
            if(this.x > this.startX-this.leftEnd) this.moveLeft();  
        }
        if (this.inputDevice.isPressed('RIGHT')) {
            this.otherDirection = false;
            if(this.x < this.levelLength-this.rightEnd) this.moveRight(); 
        }
        if (this.inputDevice.isPressed('JUMP')) this.jump();
        if (this.inputDevice.wasPressed('ACTION')) this.throw();
    }
   
    /**
    * Checks if the character should enter sleep state due to inactivity
    * @description Monitors activity and toggles sleep state after 3 seconds of inactivity
    */
   checkSleepState() {
        const now = Date.now();
        const inactivityDuration = 10000;
        if (this.isHurt || this.inputDevice.isPressed('LEFT') || this.inputDevice.isPressed('RIGHT') || this.inputDevice.isPressed('JUMP') || !this.isGrounded ||this.inputDevice.wasPressed('ACTION') ){
            this.lastActiveTime = now;
            if (this.isSleeping) {
                this.isSleeping = false;
                this.currentAssetType = 'character_standing';
                this.currentImageIndex = 0;
            }
        }
        else if (!this.isSleeping && now - this.lastActiveTime >= inactivityDuration) {
            this.isSleeping = true;
            this.currentAssetType = 'character_sleeping';
            this.currentImageIndex = 0;
        }
    } 
    
    /**
     * Applies damage to the character and updates health
     * @param {number} damage - Amount of damage to apply
     * @description Reduces health, plays hurt sound, updates health bar, and handles death
     */
    hurt(damage) {
        const now = Date.now();
        if (now - this.lastHitTime < this.hitCooldown) return;
        this.isHurt = true;
        this.health = Math.max(0, this.health - damage);
        this.lastHitTime = now;
        if (!this.isDead) this.assetManager.playSound('character_hurt');
        if (this.healthBar) {
            const percent = (this.health / this.maxHealth) * 100;
            const step = Math.floor(percent / 20) * 20;
            this.healthBar.setValue(step);
            if (step === 0) this.handleDeath(now);
        }
    }
    
    /**
     * Handles character death state and plays death sound
     * @param {number} now - Current timestamp
     * @description Sets death state, stops hurt sounds, and plays death sound
     */
    handleDeath(now) {
        this.isDead = true;
        this.deathTime = now;
        this.assetManager.stopSound('character_hurt');
        this.assetManager.playSound('character_dead');
    }
    
     /**
     * Throws a bottle if available
     * @description Creates thrown bottle projectile in facing direction and updates inventory
     */
    throw() {
        if (this.collectedBottles > 0) {
            const direction = this.otherDirection ? -1 : 1; 
            const speedX = 8 * direction; 
            const bottle = new AnimatedBottle(this.x + (direction === 1 ? 50 : -50), this.y, this.canvas,this.assetManager, this.groundY+0.43*this.canvas.clientHeight, speedX) ;
            this.level.gameObjects.push(bottle);
            this.collectedBottles--;
            this.remainingBottles--;
            this.updateBottleBar();
        }
    }
    
    /**
     * Makes the character jump if grounded
     * @description Applies upward velocity and plays jump sound when on ground
     */
    jump() {
        if (this.isGrounded) {
            this.speedY = this.jumpForce;
            this.isGrounded = false;
            this.assetManager.playSound('jumping');
        }
    }
      
}
