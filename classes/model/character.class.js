class Character extends AnimatedGameObject {
    constructor(x, y, canvas, assetManager, inputDevice, level, animationSpeed = 100) {
        super(x, y, canvas, assetManager, 'character_standing', 3);
        this.scale = 0.6;
        this.animationSpeed = animationSpeed;
        this.currentImageIndex = 0;
        this.lastAnimationTime = 0;
        this.startX = x; 
        this.level = level;
        this.levelLength = level.length; 
        this.bottleCount = level.bottleCount;
        this.coinCount = level.coinCount;
        this.leftEnd = 150;
        this.rightEnd = 400;
        this.isHurt = false;
        this.isDead = false;
        this.isSleeping = false;
        this.isMoving = false;
        this.isJumping = false;
        this.lastActiveTime = Date.now();  
        this.inputDevice = inputDevice;
        this.currentAssetType = 'character_standing';
        this.lastHitTime = 0;
        this.hitCooldown = 500;
        super.setDimensions(this.scale);
        this.bottleBar = null;
        this.healthBar = null;
        this.coinBar = null;
        this.collectedBottles = 0;
        this.collectedCoins = 0;
        this.maxHealth = 100; 
        this.health = this.maxHealth; 
        this.deathTime = null;
        this.remainingBottles = level.bottleCount;
    }

    setStatusBars(bottleBar, healthBar, coinBar) {
        this.bottleBar = bottleBar;
        this.healthBar = healthBar;
        this.coinBar = coinBar;
    }

    getProgressPercent(collected, totalCount) {
        if (totalCount <= 0) return 0; 
        const stepSize = totalCount / 5;
        const currentStep = Math.floor(collected / stepSize);
        return currentStep * 20;
    }

    collectBottle() {
        this.collectedBottles++;
        if (this.bottleBar && this.bottleCount > 0) {
            const percent = this.getProgressPercent(this.collectedBottles, this.bottleCount);
            this.bottleBar.setValue(percent);
        }
    }

    updateBottleBar() {
        if (this.bottleBar) {
            const percent = this.getProgressPercent(this.collectedBottles, this.bottleCount);
            this.bottleBar.setValue(percent);
        }
    }

    collectCoin() {
        this.collectedCoins++;
        if (this.coinBar && this.coinCount > 0) {
            const percent = this.getProgressPercent(this.collectedCoins, this.coinCount);
            this.coinBar.setValue(percent);
        }
    }

    handleState() {
        this.checkSleepState();
        this.action();
        this.isMoving = this.inputDevice.isPressed('LEFT') || this.inputDevice.isPressed('RIGHT');
        this.isJumping = !this.isGrounded;
    }

    animate() {
        this.handleState();
        let assetType;
        if (this.isDead) assetType = 'character_dead';
        else if (this.isHurt) assetType = 'character_hurt';
        else if (this.isSleeping) assetType = 'character_sleeping';
        else if (this.isJumping) assetType = 'character_jumping';
        else if (this.isMoving) assetType = 'character_walking';
        else assetType = 'character_standing';
        const frameCount = this.assetManager.getAssetCount(assetType);
        if (assetType !== this.currentAssetType) {
            this.currentImageIndex = 0;
            this.currentAssetType = assetType;
        }
        super.animateFrames(frameCount);
        if (this.isHurt && this.currentImageIndex >= frameCount - 1) {
            this.isHurt = false;
        }
    }

    setCurrentImage() {
        super.setImageByIndex(this.currentImageIndex, this.currentAssetType);
    }

    action() {
        if (this.isDead) return; 
        if (this.inputDevice.isPressed('LEFT')) {
            this.otherDirection = true;
            if(this.x > this.startX-this.leftEnd) this.moveLeft();
            
        }
        if (this.inputDevice.isPressed('RIGHT')) {
            this.otherDirection = false;
            if(this.x < this.levelLength-this.rightEnd) this.moveRight();
            
        }
        if (this.inputDevice.isPressed('JUMP')) {
            this.jump();
            
        }
        if (this.inputDevice.wasPressed('ACTION')) { 
            this.throw();
        }
    }

   checkSleepState() {
        const now = Date.now();
        const inactivityDuration = 10000;
        if (this.isHurt || this.inputDevice.isPressed('LEFT') || this.inputDevice.isPressed('RIGHT') || this.inputDevice.isPressed('JUMP') || !this.isGrounded ||this.inputDevice.wasPressed('ACTION') ){
            this.lastActiveTime = now;
            if (this.isSleeping) {
                this.isSleeping = false;
                this.currentAssetType = 'character_standing';
                this.currentImageIndex = 0;
            }
        }
        else if (!this.isSleeping && now - this.lastActiveTime >= inactivityDuration) {
            this.isSleeping = true;
            this.currentAssetType = 'character_sleeping';
            this.currentImageIndex = 0;
        }
    } 

    hurt(damage) {
        const now = Date.now();
        if (now - this.lastHitTime < this.hitCooldown) return; 
        this.isHurt = true;
        this.health = Math.max(0, this.health - damage);
        this.lastHitTime = now;
        if (!this.isDead) {
            this.assetManager.playSound('character_hurt');
        }
        if (this.healthBar) {
            const percent = (this.health / this.maxHealth) * 100;
            const step = Math.floor(percent / 20) * 20;
            this.healthBar.setValue(step);
            if (step === 0) {
                this.isDead = true;
                this.deathTime = now;
                this.assetManager.stopSound('character_hurt');
                this.assetManager.playSound('character_dead')
            }
        }
             
    }

    throw() {
        if (this.collectedBottles > 0) {
            const direction = this.otherDirection ? -1 : 1; 
            const speedX = 8 * direction; 
            const bottle = new AnimatedBottle(this.x + (direction === 1 ? 50 : -50), this.y, this.canvas,this.assetManager, this.groundY+0.43*this.canvas.clientHeight, speedX) ;
            this.level.gameObjects.push(bottle);
            this.collectedBottles--;
            this.remainingBottles--;
            this.updateBottleBar();

        }
    }

    jump() {
        if (this.isGrounded) {
            this.speedY = this.jumpForce;
            this.isGrounded = false;
            this.assetManager.playSound('jumping');
        }
    }
      
}
