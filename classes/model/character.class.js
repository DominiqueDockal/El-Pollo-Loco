class Character extends AnimatedGameObject {
    constructor(x, y, canvas, assetManager, inputDevice, level, animationSpeed = 50) {
        super(x, y, canvas, assetManager, 'character_standing', 5);
        this.scale = 0.6;
        this.animationSpeed = animationSpeed;
        this.currentImageIndex = 0;
        this.lastAnimationTime = 0;
        this.startX = x; 
        this.levelLength = level.length; 
        this.bottleCount = level.bottleCount;
        this.coinCount = level.coinCount;
        this.leftEnd = 150;
        this.rightEnd = 400;
        this.isHurt = false;
        this.isDead = false;
        this.isSleeping = false;
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
    }

    setStatusBars(bottleBar, healthBar, coinBar) {
        this.bottleBar = bottleBar;
        this.healthBar = healthBar;
        this.coinBar = coinBar;
    }

    collectBottle() {
        this.collectedBottles += 1;
        if (this.bottleBar && this.bottleCount > 0) {
            const stepSize = this.bottleCount / 5; 
            const currentStep = Math.floor(this.collectedBottles / stepSize);
            const percent = currentStep * 20;
            this.bottleBar.setValue(percent);
        }
    }

    collectCoin() {
        this.collectedCoins += 1;
        if (this.coinBar && this.coinCount > 0) {
            const stepSize = this.coinCount / 5; 
            const currentStep = Math.floor(this.collectedCoins / stepSize);
            const percent = currentStep * 20;
            this.coinBar.setValue(percent);
        }
    }

    animate() {
        this.checkSleepState();
        this.move();
        const isMoving = this.inputDevice.isPressed('LEFT') || this.inputDevice.isPressed('RIGHT');
        const isJumping = !this.isGrounded;
        let frameCount;
        let assetType;
        if (this.isDead){
            assetType = 'character_dead';
            frameCount = window.ASSETS.character_dead.length;
        } else if (this.isHurt) {
            assetType = 'character_hurt';
            frameCount = window.ASSETS.character_hurt.length;
        } else if (this.isSleeping) {
            assetType = 'character_sleeping';
            frameCount = window.ASSETS.character_sleeping.length;
        } else if (isJumping) {
            assetType = 'character_jumping';
            frameCount = window.ASSETS.character_jumping.length;
        } else if (isMoving) {
            assetType = 'character_walking';
            frameCount = window.ASSETS.character_walking.length;
        } else {
            assetType = 'character_standing';
            frameCount = window.ASSETS.character_standing.length;
        }
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

    move() {
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
    }

   checkSleepState() {
        const now = Date.now();
        const inactivityDuration = 3000;
        if (this.isHurt || this.inputDevice.isPressed('LEFT') || this.inputDevice.isPressed('RIGHT') || this.inputDevice.isPressed('JUMP') || !this.isGrounded ) {
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
      
}
