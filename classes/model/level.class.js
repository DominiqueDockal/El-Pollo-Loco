class Level {
    constructor(levelData) {
        this.id = levelData.id;
        this.name = levelData.name;
        this.length = levelData.length;
        this.bottleCount = levelData.bottleCount;
        this.coinCount = levelData.coinCount; 
    }
    
    initialize(canvas, assetManager) {
        this.gameObjects = [];
        this.createBackground(canvas, assetManager);
        this.createClouds(canvas, assetManager);
        this.createStatusbars(canvas, assetManager);
        this.createBottles(canvas, assetManager);
        this.createCoins(canvas, assetManager);
    }

    createBackground(canvas, assetManager) {
        const backgroundAsset = window.ASSETS.background[0];
        const canvasHeight = canvas.clientHeight;
        const aspectRatio = backgroundAsset.width / backgroundAsset.height;
        const backgroundWidth = canvasHeight * aspectRatio;
        const backgroundCount = Math.ceil(this.length / backgroundWidth);
        const backgroundImagePaths = window.ASSETS.background.map(imgObj => imgObj.src || imgObj);    
        for (let i = 0; i < backgroundCount; i++) {
            const currentX = Math.floor(i * backgroundWidth) - (i > 0 ? 1 : 0);
            const imageIndex = i % backgroundImagePaths.length;
            const selectedImagePath = backgroundImagePaths[imageIndex];
            const background = new Background(currentX, 0, canvas, assetManager);
            background.currentImagePath = selectedImagePath; 
            this.gameObjects.push(background);
        }
    }

    getLevelValue() {
        if (this.id === 1 || this.name.includes('1')) {
            return 1;
        } else if (this.id === 2 || this.name.includes('2')) {
            return 2;
        }
        return 1; 
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
        const bottleY = canvas.clientHeight-0.3*canvas.clientHeight;
        const usedPositions = [];
        const minDistance = 50; 
        const bottleAssets = window.ASSETS.bottle_ground || []; 
        const MIN_DISTANCE_FROM_LEFT = 300;
        const MIN_DISTANCE_FROM_RIGHT = 500;
        const TOTAL_MARGIN = MIN_DISTANCE_FROM_LEFT + MIN_DISTANCE_FROM_RIGHT; 
        for (let i = 0; i < this.bottleCount; i++) {
            let bottleX;
            let attempts = 0;
            const maxAttempts = 50;
            do {
                bottleX = Math.random() * (this.length - TOTAL_MARGIN) + MIN_DISTANCE_FROM_LEFT;
                attempts++;
            } while (
                attempts < maxAttempts && 
                usedPositions.some(pos => Math.abs(pos - bottleX) < minDistance)
            );
            usedPositions.push(bottleX);
            const randomIndex = Math.floor(Math.random() * bottleAssets.length);
            const selectedImagePath = bottleAssets[randomIndex].src;  
            const bottle = new Bottle(bottleX, bottleY, canvas, assetManager);
            bottle.currentImagePath = selectedImagePath;      
            this.gameObjects.push(bottle);
        }
        
    }
    
createCoins(canvas, assetManager) {
        if (this.coinCount === 0) return;
        const usedPositions = [];
        const minDistance = 50;
        const MIN_DISTANCE_FROM_LEFT = 300;
        const MIN_DISTANCE_FROM_RIGHT = 500;
        const TOTAL_MARGIN = MIN_DISTANCE_FROM_LEFT + MIN_DISTANCE_FROM_RIGHT;
        const animationSpeed = 400; 
        const minHeight = 0.5 * canvas.clientHeight;
        const maxHeight = 0.8 * canvas.clientHeight;
        
        for (let i = 0; i < this.coinCount; i++) {
            let coinX;
            let attempts = 0;
            const maxAttempts = 50; 
            do {
                coinX = Math.random() * (this.length - TOTAL_MARGIN) + MIN_DISTANCE_FROM_LEFT;
                attempts++;
            } while (
                attempts < maxAttempts && 
                usedPositions.some(pos => Math.abs(pos - coinX) < minDistance)
            );
            usedPositions.push(coinX);
            const coinY = canvas.clientHeight - (minHeight + Math.random() * (maxHeight - minHeight));
            const coin = new Coin(coinX, coinY, canvas, assetManager, animationSpeed);
            this.gameObjects.push(coin);
        }
    } 

        
    
    
}