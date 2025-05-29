class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.view = new CanvasView(this.canvas);
        this.inputDevice = new Keyboard();
        this.isRunning = false;
        this.currentLevel = null;
        this.currentLevelId = 1;
        window.game = this;
        this.init();
    };
    
    async init() {
        await this.loadLevel(this.currentLevelId);
        this.render();
    }
    
    async loadLevel(levelId) {
        const levelConfig = levelConfigs[`level${levelId}`];
        if (!levelConfig) {
            console.error(`Level ${levelId} not found!`);
            return;
        }
        this.currentLevel = new Level(levelConfig);
        await this.currentLevel.initialize(this.canvas.height);
        console.log(`Level ${levelId} loaded: ${this.currentLevel.name}`);
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
        if (this.currentLevel) {
            this.view.render(this.currentLevel.gameObjects);
        }
    }


}
