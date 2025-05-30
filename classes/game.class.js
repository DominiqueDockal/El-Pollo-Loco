class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.view = new CanvasView(this.canvas);
        this.inputDevice = new Keyboard();
        this.assetManager = new AssetManager(); 
        this.isRunning = false;
        this.currentLevel = null;
        this.currentLevelId = 1;
        window.game = this;
        this.init();
    };
    
    async init() {
        try {
            await this.assetManager.loadAllAssets();
            console.log(`${this.assetManager.imageCache.size} Images loaded`);
            this.loadLevel(this.currentLevelId);
            console.log('Level loaded');
            this.start();
        } catch (error) {
            console.error('Error', error);
        }
    }
    

    // Spiellogik
    loadLevel(levelId) {
        const levelConfig = levelConfigs[`level${levelId}`];
        if (!levelConfig) return;
        
        this.currentLevel = new Level(levelConfig);
        console.log('new Level');
        this.currentLevel.initialize(this.canvas, this.assetManager);
    }

    start() {
        this.isRunning = true;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isRunning) return;
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Input handling, Kollisionen, etc. Kommt noch
    }

    render() {
        if (this.currentLevel && this.assetManager.isLoaded) {
            this.view.render(this.currentLevel.gameObjects);
        }
    }
    
    
  //game.currentLevel.gameObjects.forEach(obj => obj.updateDimensions());

}
