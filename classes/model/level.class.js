class Level {
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
            maxChickens: 10
        };
    }
    
    initialize(canvas, assetManager,inputDevice) {
        this.gameObjects = [];
        this.createBackground(canvas, assetManager);
        this.createClouds(canvas, assetManager);
        this.createStatusbars(canvas, assetManager);
        this.createBottles(canvas, assetManager);
        this.createCoins(canvas, assetManager);
        this.createChickens(canvas, assetManager);
        this.createChickenSmall(canvas, assetManager);
        this.createCharacter(canvas, assetManager, inputDevice);
    }

    getLevelValue() {
        return this.id || 1; 
    }
    
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

    createBackground(canvas, assetManager) {
        const backgroundAsset = window.ASSETS.background[0];
        const canvasHeight = canvas.clientHeight;
        const aspectRatio = backgroundAsset.width / backgroundAsset.height;
        const backgroundWidth = Math.floor(canvasHeight * aspectRatio);
        const backgroundCount = Math.ceil(this.length / backgroundWidth);
        const backgroundImagePaths = window.ASSETS.background.map(imgObj => imgObj.src || imgObj);    
        for (let i = -1; i < backgroundCount; i++) {
            const currentX = i * backgroundWidth;
            const imageIndex = (i + 1) % backgroundImagePaths.length;
            const selectedImagePath = backgroundImagePaths[imageIndex];
            const background = new Background(currentX, 0, canvas, assetManager);
            background.currentImagePath = selectedImagePath; 
            this.gameObjects.push(background);
        }
    }

    createStatusbars(canvas, assetManager) {
        const startX = 0;
        const startY = 0;
        const statusbarSpacing = 0.08*canvas.clientHeight;
        this.bottleBar = Statusbar.createBottleBar(startX, startY, canvas, assetManager, 0); 
        this.healthBar = Statusbar.createHealthBar(startX, startY  + statusbarSpacing , canvas, assetManager, 100);
        this.coinBar = Statusbar.createCoinBar(startX, startY+ (statusbarSpacing * 2), canvas, assetManager, 0);
        this.gameObjects.push(this.healthBar, this.coinBar, this.bottleBar);
    }

    createClouds(canvas, assetManager) {
        const levelValue = this.getLevelValue();
        const canvasWidth = canvas.clientWidth;
        const cloud_1 = new Cloud(0, 0, canvas, assetManager, levelValue, 1, 0.15);
        const cloud_2 = new Cloud(canvasWidth, 0, canvas, assetManager, levelValue, 2, 0.15);
        this.gameObjects.push(cloud_1, cloud_2);
    }
    
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
    

    createCoins(canvas, assetManager) {
        if (this.coinCount === 0) return;
        const usedPositions = [];
        const minDistance = 50;
        const MIN_DISTANCE_FROM_LEFT = 400;
        const MIN_DISTANCE_FROM_RIGHT = 700;
        const TOTAL_MARGIN = MIN_DISTANCE_FROM_LEFT + MIN_DISTANCE_FROM_RIGHT;
        const animationSpeed = 400; 
        const minHeight = 0.5 * canvas.clientHeight;
        const maxHeight = 0.9 * canvas.clientHeight;
        for (let i = 0; i < this.coinCount; i++) {
            const coinX = this.generateRandomPosition(usedPositions, minDistance,this.length - TOTAL_MARGIN,MIN_DISTANCE_FROM_LEFT);
            usedPositions.push(coinX);
            const coinY = canvas.clientHeight - (minHeight + Math.random() * (maxHeight - minHeight));
            const coin = new Coin(coinX, coinY, canvas, assetManager, animationSpeed);
            this.gameObjects.push(coin);
        }
    }

    createChickens(canvas, assetManager) {
        if (this.chickenCount === 0) return;
        const usedPositions = [];
        const minDistance = 80; 
        const MIN_DISTANCE_FROM_LEFT = 500;
        const chickenRange = this.length - MIN_DISTANCE_FROM_LEFT;
        const animationSpeed = 300;
        const chickenY = canvas.clientHeight - 0.32 * canvas.clientHeight;
        for (let i = 0; i < this.chickenCount; i++) {
            const chickenX = this.generateRandomPosition(usedPositions, minDistance, chickenRange, MIN_DISTANCE_FROM_LEFT);
            usedPositions.push(chickenX);
            const chicken = new Chicken(chickenX, chickenY, canvas, assetManager, animationSpeed);
            chicken.isSpawned = false;
            this.gameObjects.push(chicken);
        }
    }

    createChickenSmall(canvas, assetManager) {
        if (this.chickenSmallCount === 0) return; 
        const usedPositions = [];
        const minDistance = 100; 
        const MIN_DISTANCE_FROM_LEFT = 500;
        const chickenRange = this.length - MIN_DISTANCE_FROM_LEFT;
        const animationSpeed = 300;
        const chickenSmallY = canvas.clientHeight - 0.32 * canvas.clientHeight;
        for (let i = 0; i < this.chickenSmallCount; i++) {
            const chickenX = this.generateRandomPosition(usedPositions, minDistance, chickenRange, MIN_DISTANCE_FROM_LEFT);
            usedPositions.push(chickenX);
            const chickenSmall = new ChickenSmall(chickenX, chickenSmallY, canvas, assetManager, animationSpeed);
            chickenSmall.isSpawned = false; 
            this.gameObjects.push(chickenSmall);
        }
    }

    update(currentTime, canvas, assetManager) {
        if (!this.spawning.enabled) return;
        if (currentTime - this.spawning.lastSpawn >= this.spawning.interval) {
            this.spawnChicken(canvas, assetManager);
            this.spawning.lastSpawn = currentTime;
        }
    } 

    spawnChicken(canvas, assetManager) {
        const spawnedChickens = this.gameObjects.filter(obj => 
            (obj instanceof Chicken || obj instanceof ChickenSmall) && obj.isSpawned === true
        ).length;
        if (spawnedChickens >= this.spawning.maxChickens) return;
        
        const spawnX = this.length + 150;
        if (Math.random() < 0.6) {
            const chickenY = canvas.clientHeight - 0.32 * canvas.clientHeight;
            const chicken = new Chicken(spawnX, chickenY, canvas, assetManager, 300);
            chicken.isSpawned = true; 
            this.gameObjects.push(chicken);
        } else {
            const chickenSmallY = canvas.clientHeight - 0.32 * canvas.clientHeight;
            const chickenSmall = new ChickenSmall(spawnX, chickenSmallY, canvas, assetManager, 300);
            chickenSmall.isSpawned = true; 
            this.gameObjects.push(chickenSmall);
        }
    }

    createCharacter(canvas, assetManager, inputDevice) {
        const startX = 0; 
        const startY = canvas.clientHeight - 0.7 * canvas.clientHeight; 
        const character = new Character(startX, startY, canvas, assetManager, inputDevice);
        this.gameObjects.push(character);
    }
    
    

    
}