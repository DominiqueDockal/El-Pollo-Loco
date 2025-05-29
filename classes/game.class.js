class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.view = new CanvasView(this.canvas);
        this.inputDevice = new Keyboard();
        this.isRunning = false;
        this.currentLevel = null;
        this.currentLevelId = 1;
        this.imageCache = new Map();
        this.imagesLoaded = false;
        this.globalScaleFactor = 1;

        window.game = this;
        //this.setupFullscreenHandlers();
        this.init();
    };
    
    async init() {
        await this.preloadAllImages();
        this.calculateGlobalScaleFactor();
        this.loadLevel(this.currentLevelId);
        this.render(); // vorerst hier
    }

    //globalScale
    getScaledDimensions(originalWidth, originalHeight) {
        return {
            width: Math.floor(originalWidth * this.globalScaleFactor),
            height: Math.floor(originalHeight * this.globalScaleFactor),
            scaleFactor: this.globalScaleFactor
        };
    }

    calculateGlobalScaleFactor() {
        const backgroundImagePath = this.getAssetPath('background', 0);
        const backgroundImg = this.getImage(backgroundImagePath);
        if (backgroundImg) {
            const realCanvasHeight = this.canvas.clientHeight;
            this.globalScaleFactor = realCanvasHeight / backgroundImg.naturalHeight;
            console.log(`HTML Canvas-Höhe: ${this.canvas.height}px`);
            console.log(`Reale Canvas-Höhe: ${realCanvasHeight}px`);
            console.log(`Global Scale Factor: ${this.globalScaleFactor.toFixed(3)}`);
        } else {
            this.globalScaleFactor = 0.44;
        }
    }
    
    //Image laden
    async preloadAllImages() {
        let loadedCount = 0;
        const loadPromises = ALL_IMAGES.map(async (imagePath) => {
            const img = await this.loadImageToCache(imagePath);
            loadedCount++;
            return img;
        });
        await Promise.all(loadPromises);
        this.imagesLoaded = true;
    }

    getAssetPath(category, index) {
        if (!ASSETS[category] || !ASSETS[category][index]) {
            return null;
        }
        return ASSETS[category][index];
    }
    
    loadImageToCache(imagePath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.imageCache.set(imagePath, img);
                resolve(img);
            };
            img.onerror = () => reject(new Error(`Fehler beim Laden: ${imagePath}`));
            img.src = imagePath;
        });
    }

    getImage(imagePath) {
        return this.imageCache.get(imagePath);
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
