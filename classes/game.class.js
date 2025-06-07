/**
 * Main game controller managing the entire game lifecycle
 * @class Game
 * @description Central game class that orchestrates rendering, input, physics, collisions, and game state management
 */
class Game {
    /**
     * Creates a new Game instance
     * @constructor
     * @param {string} canvasId - ID of the canvas element for rendering
     * @description Initializes game components, sets up global reference, and starts initialization
     */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.view = new CanvasView(this.canvas);
        this.inputDevice = new Keyboard();
        this.assetManager = new AssetManager(); 
        this.isRunning = false;
        this.currentLevel = null;
        this.currentLevelId = 1;
        this.isPaused = false;
        window.game = this;
        this.init();
    };
    
    /**
     * Initializes the game by loading assets and starting the first level
     * @async
     * @description Loads all game assets, initializes first level, and starts game loop
     * @throws {Error} Logs initialization errors to console
     */
    async init() {
        try {
            await this.assetManager.loadAllAssets();
            this.loadLevel(this.currentLevelId);
            this.start();
        } catch (error) {
            console.error('Error', error);
        }
    }
    
    /**
     * Loads a specific level by ID
     * @param {number} levelId - ID of the level to load
     * @description Creates and initializes a new level from configuration
     * @requires Global levelConfigs object with level configurations
     */
    loadLevel(levelId) {
        const levelConfig = levelConfigs[`level${levelId}`];
        if (!levelConfig) return;
        this.currentLevel = new Level(levelConfig);
        this.currentLevel.initialize(this.canvas, this.assetManager, this.inputDevice);
    }
    
    /**
     * Starts the game loop
     * @description Sets running state to true and begins the main game loop
     */
    start() {
        this.isRunning = true;
        this.gameLoop();
    }
    
    /**
     * Main game loop using requestAnimationFrame
     * @description Continuously updates game state, processes input, and renders until stopped
     */
    gameLoop() {
        if (!this.isRunning) return;
        this.update();
        this.inputDevice.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * Updates game state including physics, animations, and game logic
     * @description Main update logic handling character state, collisions, object cleanup, and win/lose conditions
     */
    update() {
        if (this.isPaused) return;
        if (this.currentLevel) {
            const currentTime = Date.now();
            const character = this.currentLevel.gameObjects.find(obj => obj instanceof Character);
            const endboss = this.currentLevel.gameObjects.find(obj => obj instanceof Endboss);
            const animatedBottle = this.currentLevel.gameObjects.find(obj => obj instanceof AnimatedBottle);
            if (character) {
                this.updateCamera(character);
                if (character.isDead && character.deathTime && (currentTime - character.deathTime >= 1500)) this.gameOver();
                if (this.currentLevel.endbossBar && !this.hasEnoughBottlesToKillBoss(character, this.currentLevel)) this.gameOver();
            }
            if (endboss?.isDead && endboss.deathTime && (currentTime - endboss.deathTime >= 1000)) this.victory();
            this.currentLevel.update(currentTime, this.canvas, this.assetManager); 
            this.currentLevel.gameObjects = this.currentLevel.gameObjects.filter(obj => !obj.markedForRemoval);
            this.currentLevel.gameObjects.forEach(obj => obj.updatePhysics?.());
            if (character) this.checkCollisions(character);
            if (animatedBottle) this.checkBottleCollisions(animatedBottle);
            this.currentLevel.gameObjects.forEach(obj => obj.animate?.());
        }
    }
    
    /**
     * Updates camera position to follow character
     * @param {Character} character - Player character to follow
     * @description Adjusts camera position with offset and level boundary constraints
     */
    updateCamera(character) {
        const offset = 100;
        const maxCameraX = -(this.currentLevel.length - this.view.canvas.width) + offset;
        this.view.camera_x = Math.max(-character.x + offset, maxCameraX);
    }
    

    /**
     * Checks if character has enough bottles to defeat the boss
     * @param {Character} character - Player character
     * @param {Level} level - Current game level
     * @returns {boolean} True if character has enough bottles to kill boss
     * @description Calculates if remaining bottles are sufficient for boss's current health
     */
    hasEnoughBottlesToKillBoss(character, level) {
        if (!level.endbossBar || typeof level.endbossBar.value !== 'number') return false; 
        const bossHealthPercent = level.endbossBar.value;
        const bottlesNeeded = Math.ceil(bossHealthPercent / 20); 
        const hasEnough = character.remainingBottles >= bottlesNeeded;
        return hasEnough;
    }
    
    /**
     * Checks collisions between character and all other game objects
     * @param {Character} character - Player character
     * @description Detects and handles both side collisions and top-down (jumping) collisions
     */
    checkCollisions(character) {
        this.currentLevel.gameObjects.forEach(obj => {
            if (obj === character) return;
            const isGeneralCollision = this.isColliding(character, obj);
            const isTopCollision = (obj instanceof Chicken || obj instanceof ChickenSmall) && this.isJumpingOn(character, obj);
            if (isGeneralCollision || isTopCollision) this.handleCollision(character, obj, isTopCollision ? 'top' : 'side');
        });
    }
    
    /**
     * Checks collisions between animated bottles and other game objects
     * @param {AnimatedBottle} animatedBottle - Thrown bottle projectile
     * @description Detects bottle impacts with enemies and handles damage/destruction
     */
    checkBottleCollisions(animatedBottle) {
        this.currentLevel.gameObjects.forEach(obj => {
            if (obj === animatedBottle || obj instanceof Character) return;
            if (this.isColliding(animatedBottle, obj)) this.handleBottleCollision(animatedBottle, obj);
        });
    }
    
    /**
     * Detects collision between two game objects using shrunk bounding boxes
     * @param {GameObject} a - First object (usually character or bottle)
     * @param {GameObject} object - Second object to check collision with
     * @param {number} [aShrink=0.5] - Shrink factor for first object's hitbox
     * @param {number} [objectShrink=0.55] - Shrink factor for second object's hitbox
     * @returns {boolean} True if objects are colliding
     * @description Uses AABB collision detection with configurable hitbox shrinking for more forgiving gameplay
     */
    isColliding(a, object, aShrink = 0.5, objectShrink = 0.55) {
        const aX = a.x + a.width * aShrink / 2;
        const aY = a.y + a.height * aShrink / 2;
        const aW = a.width * (1 - aShrink);
        const aH = a.height * (1 - aShrink);
        const objectX = object.x + object.width * objectShrink / 2;
        const objectY = object.y + object.height * objectShrink / 2;
        const objectW = object.width * (1 - objectShrink);
        const objectH = object.height * (1 - objectShrink);
        return (aX < objectX + objectW && aX + aW > objectX && aY < objectY + objectH && aY + aH > objectY );
    }
    
     /**
     * Handles bottle collision with enemies
     * @param {AnimatedBottle} animatedBottle - The bottle that collided
     * @param {GameObject} obj - The object that was hit by the bottle
     * @description Applies damage to boss or kills chickens when hit by bottles
     */
    handleBottleCollision(animatedBottle, obj) {
        if (obj instanceof Endboss) if (!obj.isDead) obj.hurt(20); 
        if (obj instanceof Chicken || obj instanceof ChickenSmall) if (!obj.isDead) obj.kill();
    }
    
    /**
     * Handles collision between character and regular chicken
     * @param {Character} character - Player character
     * @param {Chicken} chicken - Chicken enemy
     * @param {string} collisionType - Type of collision ('top' or 'side')
     * @description Kills chicken on top collision, damages character on side collision
     */
    handleChickenCollision(character, chicken, collisionType) {
        if (collisionType === 'top') {
            chicken.kill();
            character.y = this.canvas.clientHeight - 0.7 * this.canvas.clientHeight;
        } else if (!character.isDead && !chicken.isDead) { 
            const now = Date.now();
            if (chicken.canHit || now - chicken.lastHitTime > chicken.hitCooldown) {
                character.hurt(10);
                chicken.canHit = false;
                chicken.lastHitTime = now;
                setTimeout(() => chicken.canHit = true, chicken.hitCooldown);
            }
        }
    }
    
    /**
     * Handles collision between character and small chicken
     * @param {Character} character - Player character
     * @param {ChickenSmall} chickenSmall - Small chicken enemy
     * @param {string} collisionType - Type of collision ('top' or 'side')
     * @description Kills chicken on top collision, damages character (less than regular chicken) on side collision
     */
    handleChickenSmallCollision(character, chickenSmall, collisionType) {
        if (collisionType === 'top') {
            chickenSmall.kill();
            character.y = this.canvas.clientHeight - 0.7 * this.canvas.clientHeight;
        } else if (!character.isDead && !chickenSmall.isDead) { 
            const now = Date.now();
            if (chickenSmall.canHit || now - chickenSmall.lastHitTime > chickenSmall.hitCooldown) {
                character.hurt(5);
                chickenSmall.canHit = false;
                chickenSmall.lastHitTime = now;
                setTimeout(() => chickenSmall.canHit = true, chickenSmall.hitCooldown);
            }
        }
    }
    
    /**
     * Handles collision between character and end boss
     * @param {Character} character - Player character
     * @param {Endboss} endboss - End boss enemy
     * @description Applies significant damage to character when touching boss
     */
    handleEndbossCollision(character, endboss) {
        if (!character.isDead && !endboss.isDead) { 
            const now = Date.now();
            if (endboss.canHit || now - endboss.lastHitTime > endboss.hitCooldown) {
                character.hurt(20);
                endboss.canHit = false;
                endboss.lastHitTime = now;
                setTimeout(() => endboss.canHit = true, endboss.hitCooldown);
            }
        }
    }
    
    /**
     * Handles coin collection by character
     * @param {Character} character - Player character
     * @param {Coin} coin - Coin being collected
     * @description Plays collection sound, removes coin, and updates character stats
     */
    handleCoinCollection(character, coin) {
        coin.collected();
        this.remove(coin);
        character.collectCoin();
    }
    
     /**
     * Handles bottle collection by character
     * @param {Character} character - Player character
     * @param {Bottle} bottle - Bottle being collected
     * @description Plays collection sound, removes bottle, and updates character inventory
     */
    handleBottleCollection(character, bottle) {
        bottle.collected();
        this.remove(bottle);
        character.collectBottle();
    }
    
    /**
     * Main collision handler that delegates to specific collision handlers
     * @param {Character} character - Player character
     * @param {GameObject} obj - Object that collided with character
     * @param {string} collisionType - Type of collision ('top' or 'side')
     * @description Routes collision handling to appropriate handler based on object type
     */
    handleCollision(character, obj, collisionType) {
        if (obj instanceof Chicken) this.handleChickenCollision(character, obj, collisionType);
        else if (obj instanceof ChickenSmall) this.handleChickenSmallCollision(character, obj, collisionType);
        else if (obj instanceof Endboss) this.handleEndbossCollision(character, obj);
        else if (obj instanceof Coin) this.handleCoinCollection(character, obj);
        else if (obj instanceof Bottle) this.handleBottleCollection(character, obj);
    }
    
    /**
     * Removes an object from the current level
     * @param {GameObject} obj - Object to remove
     * @description Filters object out of the current level's gameObjects array
     */
    remove(obj) {
        this.currentLevel.gameObjects = this.currentLevel.gameObjects.filter( item => item !== obj);
    }
    
    /**
     * Detects if character is jumping on top of an object
     * @param {Character} character - Player character
     * @param {GameObject} object - Object being jumped on
     * @returns {boolean} True if character is landing on top of object
     * @description Checks for top-down collision during character's downward movement
     */
    isJumpingOn(character, object) {
        if (character.speedY <= 0) return false;
        const characterFeetY = character.y + character.height;
        const chickenHeadY = object.y;
        const horizontalOverlap = (character.x < object.x + object.width && character.x + character.width > object.x);
        const isVerticalHit = (characterFeetY >= chickenHeadY - 8 &&  characterFeetY <= chickenHeadY + 18 ); 
        return horizontalOverlap && isVerticalHit;
    }
    
    /**
     * Renders the current game state to the canvas
     * @description Delegates rendering to the view if level and assets are loaded
     */
    render() {
        if (this.currentLevel && this.assetManager.isLoaded) this.view.render(this.currentLevel.gameObjects);
    }
    
    /**
     * Handles game over state
     * @description Stops game loop, plays game over sound, shows game over screen, and stops music
     */
    gameOver() {
        this.isRunning = false;
        this.assetManager.playSound('game_over');
        this.showGameOverScreen();
        this.assetManager.stopBackgroundMusic();
    }
    
    /**
     * Handles victory state
     * @description Stops game loop, plays victory sound, shows win screen, and stops music
     */
    victory() {
        this.isRunning = false;
        this.assetManager.playSound('game_won');
        this.showYouWinScreen();
        this.assetManager.stopBackgroundMusic();
    }
    
    /**
     * Shows the game over screen UI
     * @description Updates DOM to display game over screen and hide game controls
     * @requires DOM elements with IDs: 'end_screen', 'game_control_left', 'game_control_right'
     */
    showGameOverScreen(){
        const endScreen = document.getElementById('end_screen');
        endScreen.classList.remove('d-none');
        endScreen.classList.add('end-screen-lost');
        document.getElementById('game_control_left').classList.add('d-none'); 
        document.getElementById('game_control_right').classList.add('d-none');
    }
    
     /**
     * Shows the victory screen UI
     * @description Updates DOM to display victory screen and hide game controls
     * @requires DOM elements with IDs: 'end_screen', 'game_control_left', 'game_control_right'
     */
    showYouWinScreen(){
        const endScreen = document.getElementById('end_screen');
        endScreen.classList.remove('d-none');
        endScreen.classList.add('end-screen-won');
        document.getElementById('game_control_left').classList.add('d-none'); 
        document.getElementById('game_control_right').classList.add('d-none');
    }
    
    /**
     * Quits the game and stops all audio
     * @description Stops game loop, background music, and all sound effects
     */
    quit(){
        this.isRunning = false;
        this.assetManager.stopBackgroundMusic();
        this.assetManager.stopAllSounds();
    }

}



    
    


