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
            const currentTime = Date.now();
            const character = this.currentLevel.gameObjects.find(obj => obj instanceof Character);
            const endboss = this.currentLevel.gameObjects.find(obj => obj instanceof Endboss);
            const animatedBottle = this.currentLevel.gameObjects.find(obj => obj instanceof AnimatedBottle);
            if (character) {
                if (character.isDead && character.deathTime && (currentTime - character.deathTime >= 1500)) this.gameOver();
                const offset = 100;
                const maxCameraX = -(this.currentLevel.length - this.view.canvas.width) + offset;
                this.view.camera_x = Math.max(-character.x + offset, maxCameraX);
                if (this.currentLevel.endbossBar && !this.hasEnoughBottlesToKillBoss(character, this.currentLevel)) this.gameOver();
            }
            if (endboss?.isDead && endboss.deathTime && (currentTime - endboss.deathTime >= 1000)) this.victory();
            this.currentLevel.update(currentTime, this.canvas, this.assetManager); 
            this.currentLevel.gameObjects = this.currentLevel.gameObjects.filter(obj => !obj.markedForRemoval);
            this.currentLevel.gameObjects.forEach(obj => obj.updatePhysics?.());
            if (character) this.checkCollisions(character);
            if (animatedBottle) this.checkBottleCollisions(animatedBottle);
            this.currentLevel.gameObjects.forEach(obj => obj.animate?.());
        }
    }

    hasEnoughBottlesToKillBoss(character, level) {
        if (!level.endbossBar || typeof level.endbossBar.value !== 'number') {
            return false; 
        }
        const bossHealthPercent = level.endbossBar.value;
        const bottlesNeeded = Math.ceil(bossHealthPercent / 20); 
        const hasEnough = character.remainingBottles >= bottlesNeeded;
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

    handleChickenCollision(character, chicken, collisionType) {
        if (collisionType === 'top') {
            chicken.kill();
            character.y = this.canvas.clientHeight - 0.7 * this.canvas.clientHeight;
        } else if (!character.isDead && !chicken.isDead) { 
            const now = Date.now();
            if (chicken.canHit || now - chicken.lastHitTime > chicken.hitCooldown) {
                character.hurt(10);
                chicken.canHit = false;
                chicken.lastHitTime = now;
                setTimeout(() => chicken.canHit = true, chicken.hitCooldown);
            }
        }
    }

    handleChickenSmallCollision(character, chickenSmall, collisionType) {
        if (collisionType === 'top') {
            chickenSmall.kill();
            character.y = this.canvas.clientHeight - 0.7 * this.canvas.clientHeight;
        } else if (!character.isDead && !chickenSmall.isDead) { 
            const now = Date.now();
            if (chickenSmall.canHit || now - chickenSmall.lastHitTime > chickenSmall.hitCooldown) {
                character.hurt(5);
                chickenSmall.canHit = false;
                chickenSmall.lastHitTime = now;
                setTimeout(() => chickenSmall.canHit = true, chickenSmall.hitCooldown);
            }
        }
    }

    handleEndbossCollision(character, endboss) {
        if (!character.isDead && !endboss.isDead) { 
            const now = Date.now();
            if (endboss.canHit || now - endboss.lastHitTime > endboss.hitCooldown) {
                character.hurt(20);
                endboss.canHit = false;
                endboss.lastHitTime = now;
                setTimeout(() => endboss.canHit = true, endboss.hitCooldown);
            }
        }
    }

    handleCoinCollection(character, coin) {
        coin.collected();
        this.remove(coin);
        character.collectCoin();
    }

    handleBottleCollection(character, bottle) {
        bottle.collected();
        this.remove(bottle);
        character.collectBottle();
    }

    handleCollision(character, obj, collisionType) {
        if (obj instanceof Chicken) this.handleChickenCollision(character, obj, collisionType);
        else if (obj instanceof ChickenSmall) this.handleChickenSmallCollision(character, obj, collisionType);
        else if (obj instanceof Endboss) this.handleEndbossCollision(character, obj);
        else if (obj instanceof Coin) this.handleCoinCollection(character, obj);
        else if (obj instanceof Bottle) this.handleBottleCollection(character, obj);
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



    
    


