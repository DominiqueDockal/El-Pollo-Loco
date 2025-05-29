class Level {
    constructor(levelData) {
        this.id = levelData.id;
        this.name = levelData.name;
        this.length = levelData.length;
       /*  this.coinCount = levelData.coinCount;
        this.bottleCount = levelData.bottleCount;
        this.bossDeathSpeed = levelData.bossDeathSpeed;
        this.smallChickenCount = levelData.smallChickenCount;
        this.chickenCount = levelData.chickenCount; */

    }
    
    async initialize(canvasHeight) {
        this.gameObjects = [];
        await this.createBackground(canvasHeight);

    
/*      const player = new Character(50, 200, canvasHeight);
        this.gameObjects.push(player);
        const statusbar = new Statusbar(0, 0, canvasHeight);
        this.gameObjects.push(statusbar);
        this.createClouds(canvasHeight);
        this.createCoins(canvasHeight);
        this.createBottles(canvasHeight);
        this.createChickens(canvasHeight);
        this.createBoss(canvasHeight); */
    }


    async createBackground(canvasHeight) {
        const firstBackground = new Background(0, 0, canvasHeight, 0);
        this.gameObjects.push(firstBackground);
        await firstBackground.loadPromise;   
        const backgroundCount = Math.ceil(this.length / firstBackground.width);
        const backgroundPromises = [];
        for (let i = 1; i < backgroundCount; i++) {
            const background = new Background(i * firstBackground.width, 0, canvasHeight, i);
            this.gameObjects.push(background);
            backgroundPromises.push(background.loadPromise);
        }
        await Promise.all(backgroundPromises);
        console.log(`${backgroundCount} backgrounds loaded`);
    }
    
      
    
}