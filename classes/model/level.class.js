class Level {
    constructor(levelData) {
        this.id = levelData.id;
        this.name = levelData.name;
        this.length = levelData.length;
    }
    
    initialize(canvasHeight) {
        this.gameObjects = [];
        this.createBackground(canvasHeight);
    }

    createBackground(canvasHeight) {
        const firstBackground = new Background(0, 0, canvasHeight, 0);
        this.gameObjects.push(firstBackground); 
        const backgroundCount = Math.ceil(this.length / firstBackground.width);
        let currentX = 0; 
        for (let i = 1; i < backgroundCount; i++) {
            currentX += firstBackground.width - 1; 
            const background = new Background(currentX, 0, canvasHeight, i);
            this.gameObjects.push(background);
        }
    }
    
    
      
    
}