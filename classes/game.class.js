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
        this.inputDevice.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        if (this.isPaused) return;
        if (this.currentLevel) {
            const character = this.currentLevel.gameObjects.find(obj => obj instanceof Character);
            if (character) {
                if (character.isDead && character.deathTime) {
                  const now = Date.now();
                  if (now - character.deathTime >= 1500) { 
                    this.gameOver();
                  }
                }
            }
            const endboss = this.currentLevel.gameObjects.find(obj => obj instanceof Endboss);
            if (endboss) {
                if (endboss.isDead && endboss.deathTime) {
                    const now = Date.now();
                    if (now - endboss.deathTime >= 1000) {
                    this.victory();
                    }
                }
            }
            if (character && this.currentLevel.endbossBar) {
                const canKillBoss = this.hasEnoughBottlesToKillBoss(character, this.currentLevel);
                if (!canKillBoss) {
                    this.gameOver();
                }
            }
            if (character) {
                const offset = 100;
                const maxCameraX = -(this.currentLevel.length - this.view.canvas.width) + offset;
                this.view.camera_x = Math.max(-character.x + offset, maxCameraX);
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
            const animatedBottle = this.currentLevel.gameObjects.find(obj => obj instanceof AnimatedBottle);
            if (animatedBottle) {
                this.checkBottleCollisions(animatedBottle);
            }
            this.currentLevel.gameObjects.forEach(obj => { 
                if (obj.animate) obj.animate();
            })
        }
    }
    hasEnoughBottlesToKillBoss(character, level) {
        if (!level.endbossBar || typeof level.endbossBar.value !== 'number') {
            return false; 
        }
        const bossHealthPercent = level.endbossBar.value;
        const bottlesNeeded = Math.ceil(bossHealthPercent / 20); 
        const hasEnough = character.remainingBottles >= bottlesNeeded;
        /* console.log(
            `Boss-Gesundheit: ${bossHealthPercent}%`,
            `Benötigte Flaschen: ${bottlesNeeded}`,
            `Verfügbare Flaschen: ${character.remainingBottles}`,
            `Genug Flaschen?: ${hasEnough ? 'Ja' : 'Nein'}`
        ); */
        return hasEnough;
    }
    

    checkCollisions(character) {
        this.currentLevel.gameObjects.forEach(obj => {
            if (obj === character) return;
            const isGeneralCollision = this.isColliding(character, obj);
            const isTopCollision = (obj instanceof Chicken || obj instanceof ChickenSmall) 
                && this.isJumpingOn(character, obj);
            if (isGeneralCollision || isTopCollision) {
                this.handleCollision(character, obj, isTopCollision ? 'top' : 'side');
            }
        });
    }

    checkBottleCollisions(animatedBottle) {
        this.currentLevel.gameObjects.forEach(obj => {
            if (obj === animatedBottle || obj instanceof Character) return;
            
            if (this.isColliding(animatedBottle, obj)) {
                this.handleBottleCollision(animatedBottle, obj);
            }
        });
    }
    
    isColliding(a, object, aShrink = 0.5, objectShrink = 0.55) {
        const aX = a.x + a.width * aShrink / 2;
        const aY = a.y + a.height * aShrink / 2;
        const aW = a.width * (1 - aShrink);
        const aH = a.height * (1 - aShrink);
        const objectX = object.x + object.width * objectShrink / 2;
        const objectY = object.y + object.height * objectShrink / 2;
        const objectW = object.width * (1 - objectShrink);
        const objectH = object.height * (1 - objectShrink);
        return (
            aX < objectX + objectW &&
            aX + aW > objectX &&
            aY < objectY + objectH &&
            aY + aH > objectY
        );
    }

    handleBottleCollision(animatedBottle, obj) {
        if (obj instanceof Endboss) {
            if (!obj.isDead) obj.hurt(20); 
        }
        if (obj instanceof Chicken || obj instanceof ChickenSmall) {
            if (!obj.isDead) obj.kill();
        }

    }
    
    handleCollision(character, obj, collisionType) {
        if (obj instanceof Chicken || obj instanceof ChickenSmall) {
            if (collisionType === 'top') {
                obj.kill();
                character.y = canvas.clientHeight - 0.7 * canvas.clientHeight; 
            } else if (!character.isDead &&!obj.isDead) { 
                const now = Date.now();
                if (obj.canHit || now - obj.lastHitTime > obj.hitCooldown) {
                    character.hurt(5); 
                    obj.canHit = false;
                    obj.lastHitTime = now;
                    setTimeout(() => {
                        obj.canHit = true;
                    }, obj.hitCooldown);
                }
            }
        }
        if (obj instanceof Endboss) {
            if (!character.isDead && !obj.isDead) { 
                const now = Date.now();
                if (obj.canHit || now - obj.lastHitTime > obj.hitCooldown) {
                    character.hurt(20); 
                    obj.canHit = false;
                    obj.lastHitTime = now;
                    setTimeout(() => {
                        obj.canHit = true;
                    }, obj.hitCooldown);
                }
        }    
        }
        if (obj instanceof Coin) {
            obj.collected();
            this.remove(obj);
            character.collectCoin();
        }
        
        if (obj instanceof Bottle) {
            obj.collected();
            this.remove(obj);
            character.collectBottle();
        }
    }
    
    remove(obj) {
        this.currentLevel.gameObjects = this.currentLevel.gameObjects.filter(
            item => item !== obj
        );
    }

    isJumpingOn(character, object) {
        if (character.speedY <= 0) return false;
        const characterFeetY = character.y + character.height;
        const chickenHeadY = object.y;
        const horizontalOverlap = (
            character.x < object.x + object.width &&
            character.x + character.width > object.x
        );
        const isVerticalHit = (
            characterFeetY >= chickenHeadY - 8 && 
            characterFeetY <= chickenHeadY + 18   
        ); 
        return horizontalOverlap && isVerticalHit;
    }

    render() {
        if (this.currentLevel && this.assetManager.isLoaded) {
            this.view.render(this.currentLevel.gameObjects);
        }
    }

    gameOver() {
        this.isRunning = false;
        this.assetManager.playSound('game_over');
        this.showGameOverScreen();
        this.assetManager.stopBackgroundMusic();
    }

    victory() {
        this.isRunning = false;
        this.assetManager.playSound('game_won');
        this.showYouWinScreen();
        this.assetManager.stopBackgroundMusic();
    }

    showGameOverScreen(){
        const endScreen = document.getElementById('end_screen');
        endScreen.classList.remove('d-none');
        endScreen.classList.add('end-screen-lost');
        document.getElementById('game_control_left').classList.add('d-none'); 
        document.getElementById('game_control_right').classList.add('d-none');
    }

    showYouWinScreen(){
        const endScreen = document.getElementById('end_screen');
        endScreen.classList.remove('d-none');
        endScreen.classList.add('end-screen-won');
        document.getElementById('game_control_left').classList.add('d-none'); 
        document.getElementById('game_control_right').classList.add('d-none');
    }

    quit(){
        this.isRunning = false;
        this.assetManager.stopBackgroundMusic();
        this.assetManager.stopAllSounds();
    }

}



    
    


