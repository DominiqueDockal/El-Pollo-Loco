class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.view = new CanvasView(this.canvas);
        this.inputDevice = new Keyboard();

        this.currentLevel = null;
        this.currentLevelId = 1;
    }
    
    init() {
        this.loadLevel(this.currentLevelId);
    }
    
    loadLevel(levelId) {
        const levelConfig = levelConfigs[`level${levelId}`];
        if (!levelConfig) {
            console.error(`Level ${levelId} not found!`);
            return;
        }
        this.currentLevel = new Level(levelConfig);
        this.currentLevel.initialize(this.canvas.height);
        console.log(`Level ${levelId} loaded: ${this.currentLevel.name}`);
    }


}
