class Game {
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
    
    async init() {
        try {
            await this.assetManager.loadAllAssets();
            console.log(`${this.assetManager.imageCache.size} Images loaded`);
            this.loadLevel(this.currentLevelId);
            this.start();
        } catch (error) {
            console.error('Error', error);
        }
    }
    
    loadLevel(levelId) {
        const levelConfig = levelConfigs[`level${levelId}`];
        if (!levelConfig) return;
        this.currentLevel = new Level(levelConfig);
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
        if (this.isPaused) {
            return;
        }
        const currentTime = Date.now();
        if (this.currentLevel) {
            this.currentLevel.update(currentTime); 
            this.currentLevel.gameObjects.forEach(gameObject => {
                if (gameObject.animate && typeof gameObject.animate === 'function') {
                    gameObject.animate();
                }
            });
        }
    }
    
    render() {
        if (this.currentLevel && this.assetManager.isLoaded) {
            this.view.render(this.currentLevel.gameObjects);
        }
    }
    

}
