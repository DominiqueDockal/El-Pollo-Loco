class Level {
    constructor(levelData) {
        this.id = levelData.id;
        this.name = levelData.name;
        this.length = levelData.length;
        this.coinCount = levelData.coinCount;
        this.bottleCount = levelData.bottleCount;
        this.bossDeathSpeed = levelData.bossDeathSpeed;
        this.smallChickenCount = levelData.smallChickenCount;
        this.chickenCount = levelData.chickenCount;
        
        this.gameObjects = [];
        this.isCompleted = false;
    }
    
    initialize(canvasHeight) {
        this.gameObjects = [];
    
        const player = new Character(50, 200, canvasHeight);
        this.gameObjects.push(player);
        const statusbar = new Statusbar(0, 0, canvasHeight);
        this.gameObjects.push(statusbar);

        this.createBackground(canvasHeight);
        this.createClouds(canvasHeight);
        this.createCoins(canvasHeight);
        this.createBottles(canvasHeight);
        this.createChickens(canvasHeight);
        this.createBoss(canvasHeight);
    }

    // anpassen ohne den schätzwert

    createBackground(canvasHeight) {
        const estimatedBackgroundWidth = 719; // Schätzwert
        const backgroundCount = Math.ceil(this.length / estimatedBackgroundWidth);
        
        for (let i = 0; i < backgroundCount; i++) {
            const background = new Background(0, 0, canvasHeight, i);
            this.gameObjects.push(background);
        }
    }
    
}