class Level {
    constructor(levelData) {
        this.id = levelData.id;
        this.name = levelData.name;
        this.length = levelData.length;
        this.enemyCount = levelData.enemyCount;
        this.coinCount = levelData.coinCount;
        this.bottleCount = levelData.bottleCount;
        this.endboss = levelData.endboss;
        
        this.gameObjects = [];
        this.isCompleted = false;
    }
    
    initialize(canvasHeight) {
        this.gameObjects = [];
        const player = new GameObject(50, 200, 'images/character.png', canvasHeight, 'player');
        this.gameObjects.push(player);

        this.createClouds(canvasHeight);
        this.createEnemies(canvasHeight);
        this.createCoins(canvasHeight);
        this.createBottles(canvasHeight);
        this.createBoss(canvasHeight);
        
    }
    
    // klassen erstellen/ erzeugen random
    createClouds(canvasHeight) {
        for (let i = 0; i < Math.floor(this.length / 200); i++) {
            const cloud = new Cloud(100 + i * 200, 50, canvasHeight);
            this.gameObjects.push(cloud);
        }
    }
    
    createEnemies(canvasHeight) {
        for (let i = 0; i < this.enemyCount; i++) {
            const enemy = new Enemy(200 + i * 150, 200, canvasHeight);
            this.gameObjects.push(enemy);
        }
    }
    
    createCoins(canvasHeight) {
        for (let i = 0; i < this.coinCount; i++) {
            const coin = new Coin(150 + i * 100, 180, canvasHeight);
            this.gameObjects.push(coin);
        }
    }
    
    createBottles(canvasHeight) {
        for (let i = 0; i < this.bottleCount; i++) {
            const bottle = new Bottle(300 + i * 120, 190, canvasHeight);
            this.gameObjects.push(bottle);
        }
    }
    
    createBoss(canvasHeight) {
        const boss = new Endboss(this.length - 100, 200, canvasHeight);
        this.gameObjects.push(boss);
    }
    
    // Spezifische Getter für die verschiedenen Typen
    getEnemies() {
        return this.gameObjects.filter(obj => obj instanceof Enemy);
    }
    
    getBoss() {
        return this.gameObjects.find(obj => obj instanceof Endboss);
    }
    
    getCoins() {
        return this.gameObjects.filter(obj => obj instanceof Coin && !obj.collected);
    }
    
    getBottles() {
        return this.gameObjects.filter(obj => obj instanceof Bottle);
    }
}


