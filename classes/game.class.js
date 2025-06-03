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
        this.currentLevel.initialize(this.canvas, this.assetManager, this.inputDevice);
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
        if (this.isPaused) return;
        
        if (this.currentLevel) {
            const character = this.currentLevel.gameObjects.find(obj => obj instanceof Character);
            if (character) {
                const offset = 100;
                const maxCameraX = -(this.currentLevel.length - this.view.canvas.width) + offset;
                this.view.camera_x = Math.max(
                    -character.x + offset,
                    maxCameraX
                );
            }
        }

        const currentTime = Date.now();
        if (this.currentLevel) {
            this.currentLevel.update(currentTime, this.canvas, this.assetManager); 
            this.currentLevel.gameObjects.forEach(obj => { 
                if (obj.updatePhysics && typeof obj.updatePhysics === 'function') {
                    obj.updatePhysics();
                }
                if (obj.animate && typeof obj.animate === 'function') {
                    obj.animate();
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
