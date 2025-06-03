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
            const currentTime = Date.now();
            this.currentLevel.update(currentTime, this.canvas, this.assetManager); 
            this.currentLevel.gameObjects = this.currentLevel.gameObjects.filter(obj => !obj.markedForRemoval);
            this.currentLevel.gameObjects.forEach(obj => { 
                if (obj.updatePhysics) obj.updatePhysics();
            });
            if (character) {
                this.checkCollisions(character);
            }
            this.currentLevel.gameObjects.forEach(obj => { 
                if (obj.animate) obj.animate();
            })
        }
    }
    
    render() {
        if (this.currentLevel && this.assetManager.isLoaded) {
            this.view.render(this.currentLevel.gameObjects);
        }
    }

    checkCollisions(character) {
        this.currentLevel.gameObjects.forEach(obj => {
            if (obj === character) return;
            if (this.isColliding(character, obj)) {
                this.handleCollision(character, obj);
            }
        });
    }
    
    isColliding(character, object,characterShrink = 0.5, objectShrink = 0.55) {
        const characterX = character.x + character.width * characterShrink / 2;
        const characterY = character.y + character.height * characterShrink / 2;
        const characterW = character.width * (1 - characterShrink);
        const characterH = character.height * (1 - characterShrink);

        const objectX = object.x + object.width * objectShrink / 2;
        const objectY = object.y + object.height * objectShrink / 2;
        const objectW = object.width * (1 - objectShrink);
        const objectH = object.height * (1 - objectShrink);
    
        return (
            characterX < objectX + objectW &&
            characterX + characterW > objectX &&
            characterY < objectY + objectH &&
            characterY + characterH > objectY
        );
    }
    

    handleCollision(character, obj) {
        if (obj instanceof Coin) {
            obj.collected();
            this.remove(obj);
            character.collectedCoins += 1;
        }
        
        if (obj instanceof Bottle) {
            obj.collected();
            this.remove(obj);
            character.collectedBottles += 1;
        }
    
        if (obj instanceof Chicken || obj instanceof ChickenSmall) {
              character.hurt();
            
        }
    }
    
    remove(obj) {
        this.currentLevel.gameObjects = this.currentLevel.gameObjects.filter(
            item => item !== obj
        );
    }

   
    
}



    
    


