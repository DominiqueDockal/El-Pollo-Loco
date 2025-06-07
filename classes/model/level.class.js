/**
 * Game level containing all level-specific game objects and mechanics
 * @class Level
 * @description Manages level initialization, game object creation, positioning, and dynamic spawning mechanics
 */
class Level {
    /**
     * Creates a new Level instance
     * @constructor
     * @param {Object} levelData - Configuration object for the level
     * @param {number} levelData.id - Unique identifier for the level
     * @param {string} levelData.name - Display name of the level
     * @param {number} levelData.length - Length of the level in pixels
     * @param {number} levelData.bottleCount - Number of bottles to spawn
     * @param {number} levelData.coinCount - Number of coins to spawn
     * @param {number} levelData.chickenCount - Number of regular chickens to spawn
     * @param {number} levelData.chickenSmallCount - Number of small chickens to spawn
     * @description Initializes level properties and spawning configuration
     */
    constructor(levelData) {
        this.id = levelData.id;
        this.name = levelData.name;
        this.length = levelData.length;
        this.bottleCount = levelData.bottleCount;
        this.coinCount = levelData.coinCount; 
        this.chickenCount = levelData.chickenCount;
        this.chickenSmallCount = levelData.chickenSmallCount;
        this.spawning = {
            enabled: true,
            lastSpawn: 0,
            interval: 5000, 
            maxChickens: 20
        };
    }
    
    /**
     * Initializes the level by creating all game objects
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading assets
     * @param {InputDevice} inputDevice - Input device for character control
     * @description Creates and positions all level objects including background, characters, enemies, and collectibles
     */
    initialize(canvas, assetManager,inputDevice) {
        this.gameObjects = [];
        this.createBackground(canvas, assetManager);
        this.createClouds(canvas, assetManager);
        this.createCharacter(canvas, assetManager, inputDevice);
        this.createEndboss(canvas, assetManager);
        this.createStatusbars(canvas, assetManager);
        this.createBottles(canvas, assetManager);
        this.createCoins(canvas, assetManager);
        this.createChickens(canvas, assetManager);
        this.createChickenSmall(canvas, assetManager);
    }
    
     /**
     * Gets the level value for asset selection
     * @returns {number} The level ID or 1 as default
     * @description Returns level identifier for level-specific asset loading
     */
    getLevelValue() {
        return this.id || 1; 
    }
    
     /**
     * Generates a random position that maintains minimum distance from existing positions
     * @param {number[]} usedPositions - Array of already used positions
     * @param {number} minDistance - Minimum distance required between positions
     * @param {number} range - Maximum range for position generation
     * @param {number} minOffset - Minimum offset from start position
     * @returns {number} Generated position that meets distance requirements
     * @description Ensures proper spacing between game objects to prevent overlap
     */
    generateRandomPosition(usedPositions, minDistance, range, minOffset) {
        let position;
        let attempts = 0;
        const maxAttempts = 50;
        do {
            position = Math.random() * range + minOffset;
            attempts++;
        } while (
            attempts < maxAttempts && 
            usedPositions.some(pos => Math.abs(pos - position) < minDistance)
        );
        return position;
    }
    
    /**
     * Creates repeating background images across the level length
     * @param {HTMLCanvasElement} canvas - Canvas element for sizing calculations
     * @param {AssetManager} assetManager - Asset manager for background assets
     * @description Creates tiled background that covers the entire level length
     */
    createBackground(canvas, assetManager) {
        const backgroundMetadata = assetManager.getAssetsMetadata('background');
        if (backgroundMetadata.length === 0) return; 
        const backgroundAsset = backgroundMetadata[0];
        const canvasHeight = canvas.clientHeight;
        const aspectRatio = backgroundAsset.width / backgroundAsset.height;
        const backgroundWidth = Math.floor(canvasHeight * aspectRatio);
        const backgroundCount = Math.ceil(this.length / backgroundWidth);
        const backgroundImagePaths = assetManager.getImagePathsByType('background');
        for (let i = -1; i < backgroundCount; i++) {
            const currentX = i * backgroundWidth;
            const imageIndex = (i + 1) % backgroundImagePaths.length;
            const selectedImagePath = backgroundImagePaths[imageIndex];
            const background = new Background(currentX, 0, canvas, assetManager);
            background.setImage(selectedImagePath); 
            this.gameObjects.push(background);
        }
    }
    
    /**
     * Creates cloud objects for the level
     * @param {HTMLCanvasElement} canvas - Canvas element for positioning
     * @param {AssetManager} assetManager - Asset manager for cloud assets
     * @description Creates level-appropriate clouds with different variants
     */
    createClouds(canvas, assetManager) {
        const levelValue = this.getLevelValue();
        const canvasWidth = canvas.clientWidth;
        const cloud_1 = new Cloud(0, 0, canvas, assetManager, levelValue, 1, 0.15);
        const cloud_2 = new Cloud(canvasWidth, 0, canvas, assetManager, levelValue, 2, 0.15);
        this.gameObjects.push(cloud_1, cloud_2);
    }
    
    /**
     * Creates the player character
     * @param {HTMLCanvasElement} canvas - Canvas element for positioning
     * @param {AssetManager} assetManager - Asset manager for character assets
     * @param {InputDevice} inputDevice - Input device for character control
     * @description Creates player character at level start position
     */
    createCharacter(canvas, assetManager, inputDevice) {
        const startX = 0; 
        const startY = canvas.clientHeight - 0.7 * canvas.clientHeight; 
        this.character = new Character(startX, startY, canvas, assetManager, inputDevice, this);
        this.gameObjects.push(this.character);
    }
    
    /**
     * Creates the level end boss
     * @param {HTMLCanvasElement} canvas - Canvas element for positioning
     * @param {AssetManager} assetManager - Asset manager for boss assets
     * @description Creates end boss near the end of the level
     */
    createEndboss(canvas, assetManager) {
        const startX = this.length - 500; 
        const startY = canvas.clientHeight - 0.85 * canvas.clientHeight; 
        this.endboss = new Endboss(startX, startY, canvas, assetManager);
        this.gameObjects.push(this.endboss);
        if (this.endboss) this.endboss.setCharacter(this.character);  
    }
    
     /**
     * Creates UI status bars for health, bottles, coins, and boss health
     * @param {HTMLCanvasElement} canvas - Canvas element for positioning
     * @param {AssetManager} assetManager - Asset manager for statusbar assets
     * @description Creates fixed UI elements and connects them to character and boss
     */
    createStatusbars(canvas, assetManager) {
        const startX = 0;
        const startY = 0;
        const endbossY= 5;
        const endbossX = 0.74* canvas.clientWidth;
        const statusbarSpacing = 0.08*canvas.clientHeight;
        this.bottleBar = Statusbar.createBottleBar(startX, startY, canvas, assetManager, 0); 
        this.healthBar = Statusbar.createHealthBar(startX, startY  + statusbarSpacing , canvas, assetManager, 100);
        this.coinBar = Statusbar.createCoinBar(startX, startY+ (statusbarSpacing * 2), canvas, assetManager, 0);
        this.endbossBar = Statusbar.createEndbossBar(endbossX, endbossY, canvas, assetManager, 100);
        this.gameObjects.push(this.healthBar, this.coinBar, this.bottleBar, this.endbossBar);
        if (this.character) this.character.setStatusBars(this.bottleBar, this.healthBar, this.coinBar);
        if (this.endboss) this.endboss.setEndbossBar(this.endbossBar);
    }

    /**
     * Creates collectible bottles randomly positioned across the level
     * @param {HTMLCanvasElement} canvas - Canvas element for positioning
     * @param {AssetManager} assetManager - Asset manager for bottle assets
     * @description Creates bottles with proper spacing and distance from level boundaries
     */ 
    createBottles(canvas, assetManager) {
        if (this.bottleCount === 0) return;
        const bottleY = canvas.clientHeight - 0.31 * canvas.clientHeight;
        const usedPositions = [];
        const minDistance = 50; 
        const MIN_DISTANCE_FROM_LEFT = 400;
        const MIN_DISTANCE_FROM_RIGHT = 700;
        const TOTAL_MARGIN = MIN_DISTANCE_FROM_LEFT + MIN_DISTANCE_FROM_RIGHT; 
        for (let i = 0; i < this.bottleCount; i++) {
            const bottleX = this.generateRandomPosition(usedPositions, minDistance, this.length - TOTAL_MARGIN, MIN_DISTANCE_FROM_LEFT);
            usedPositions.push(bottleX);
            const bottle = new Bottle(bottleX, bottleY, canvas, assetManager); 
            this.gameObjects.push(bottle);
        }
    }
    
    /**
     * Creates collectible coins randomly positioned in the air across the level
     * @param {HTMLCanvasElement} canvas - Canvas element for positioning
     * @param {AssetManager} assetManager - Asset manager for coin assets
     * @description Creates coins at random heights with proper spacing and boundary distances
     */
    createCoins(canvas, assetManager) {
        if (this.coinCount === 0) return;
        const usedPositions = [];
        const minDistance = 50;
        const MIN_DISTANCE_FROM_LEFT = 400;
        const MIN_DISTANCE_FROM_RIGHT = 700;
        const TOTAL_MARGIN = MIN_DISTANCE_FROM_LEFT + MIN_DISTANCE_FROM_RIGHT;
        const minHeight = 0.5 * canvas.clientHeight;
        const maxHeight = 0.9 * canvas.clientHeight;
        for (let i = 0; i < this.coinCount; i++) {
            const coinX = this.generateRandomPosition(usedPositions, minDistance,this.length - TOTAL_MARGIN,MIN_DISTANCE_FROM_LEFT);
            usedPositions.push(coinX);
            const coinY = canvas.clientHeight - (minHeight + Math.random() * (maxHeight - minHeight));
            const coin = new Coin(coinX, coinY, canvas, assetManager);
            this.gameObjects.push(coin);
        }
    }
    
    /**
     * Creates regular chicken enemies positioned across the level
     * @param {HTMLCanvasElement} canvas - Canvas element for positioning
     * @param {AssetManager} assetManager - Asset manager for chicken assets
     * @description Creates initial chicken enemies with spawn flags set to false
     */
    createChickens(canvas, assetManager) {
        if (this.chickenCount === 0) return;
        const usedPositions = [];
        const minDistance = 80; 
        const MIN_DISTANCE_FROM_LEFT = 500;
        const chickenRange = this.length - MIN_DISTANCE_FROM_LEFT;
        const chickenY = canvas.clientHeight - 0.32 * canvas.clientHeight;
        for (let i = 0; i < this.chickenCount; i++) {
            const chickenX = this.generateRandomPosition(usedPositions, minDistance, chickenRange, MIN_DISTANCE_FROM_LEFT);
            usedPositions.push(chickenX);
            const chicken = new Chicken(chickenX, chickenY, canvas, assetManager);
            chicken.isSpawned = false;
            this.gameObjects.push(chicken);
        }
    }
    
    /**
     * Creates small chicken enemies positioned across the level
     * @param {HTMLCanvasElement} canvas - Canvas element for positioning
     * @param {AssetManager} assetManager - Asset manager for small chicken assets
     * @description Creates initial small chicken enemies with spawn flags set to false
     */
    createChickenSmall(canvas, assetManager) {
        if (this.chickenSmallCount === 0) return; 
        const usedPositions = [];
        const minDistance = 100; 
        const MIN_DISTANCE_FROM_LEFT = 500;
        const chickenRange = this.length - MIN_DISTANCE_FROM_LEFT;
        const chickenSmallY = canvas.clientHeight - 0.32 * canvas.clientHeight;
        for (let i = 0; i < this.chickenSmallCount; i++) {
            const chickenX = this.generateRandomPosition(usedPositions, minDistance, chickenRange, MIN_DISTANCE_FROM_LEFT);
            usedPositions.push(chickenX);
            const chickenSmall = new ChickenSmall(chickenX, chickenSmallY, canvas, assetManager);
            chickenSmall.isSpawned = false; 
            this.gameObjects.push(chickenSmall);
        }
    }
    
    /**
     * Updates level state including dynamic spawning mechanics
     * @param {number} currentTime - Current timestamp for timing calculations
     * @param {HTMLCanvasElement} canvas - Canvas element for positioning new spawns
     * @param {AssetManager} assetManager - Asset manager for spawned enemy assets
     * @description Manages timed chicken spawning based on configured intervals
     */
    update(currentTime, canvas, assetManager) {
        if (!this.spawning.enabled) return;
        if (currentTime - this.spawning.lastSpawn >= this.spawning.interval) {
            this.spawnChicken(canvas, assetManager);
            this.spawning.lastSpawn = currentTime;
        }
    } 
    
    /**
     * Spawns a new chicken enemy at the right edge of the level
     * @param {HTMLCanvasElement} canvas - Canvas element for positioning
     * @param {AssetManager} assetManager - Asset manager for chicken assets
     * @description Creates new chicken enemies with 60% chance of regular chicken, 40% small chicken
     */
    spawnChicken(canvas, assetManager) {
        const spawnedChickens = this.gameObjects.filter(obj => (obj instanceof Chicken || obj instanceof ChickenSmall) && obj.isSpawned === true).length;
        if (spawnedChickens >= this.spawning.maxChickens) return;
        const spawnX = this.length;
        if (Math.random() < 0.6) {
            const chickenY = canvas.clientHeight - 0.32 * canvas.clientHeight;
            const chicken = new Chicken(spawnX, chickenY, canvas, assetManager);
            chicken.isSpawned = true; 
            this.gameObjects.push(chicken);
        } else {
            const chickenSmallY = canvas.clientHeight - 0.32 * canvas.clientHeight;
            const chickenSmall = new ChickenSmall(spawnX, chickenSmallY, canvas, assetManager);
            chickenSmall.isSpawned = true; 
            this.gameObjects.push(chickenSmall);
        }
    }
    
}