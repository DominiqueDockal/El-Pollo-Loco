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
        this.loadLevel(this.currentLevelId);
        this.render(); // vorerst hier
    }

    // Spiellogik
    loadLevel(levelId) {
        const levelConfig = levelConfigs[`level${levelId}`];
        if (!levelConfig) {
            return;
        }
        this.currentLevel = new Level(levelConfig);
        this.currentLevel.initialize(this.canvas.height);
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
