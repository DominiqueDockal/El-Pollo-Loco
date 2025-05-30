class Level {
    constructor(levelData) {
        this.id = levelData.id;
        this.name = levelData.name;
        this.length = levelData.length;
    }
    
    initialize(canvas, assetManager) {
        this.gameObjects = [];
        this.createBackground(canvas, assetManager);
        this.createStatusbars(canvas, assetManager);
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

    createStatusbars(canvas, assetManager) {
        const startX = 0;
        const startY = 0;
        const statusbarSpacing = 35;
        this.bottleBar = Statusbar.createBottle(startX, startY, canvas, assetManager, 0); 
        this.healthBar = Statusbar.createHealth(startX, startY  + statusbarSpacing , canvas, assetManager, 100);
        this.coinBar = Statusbar.createCoin(startX, startY+ (statusbarSpacing * 2), canvas, assetManager, 0);
        this.gameObjects.push(this.healthBar, this.coinBar, this.bottleBar);
    }
    
    
    
    
    
    
}