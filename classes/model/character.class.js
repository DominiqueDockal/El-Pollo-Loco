class Character extends AnimatedGameObject {
    constructor(x, y, canvas, assetManager, inputDevice, animationSpeed = 100) {
        super(x, y, canvas, assetManager, 'character_standing', 5);
        this.scale = 0.6;
        this.animationSpeed = animationSpeed;
        this.currentImageIndex = 0;
        this.lastAnimationTime = 0;
        this.startX = x;  
        this.leftEnd = 150;
        this.isHurt = false;
        this.isDead = false;
        this.isSleeping = false;
        this.lastActiveTime = Date.now();  
        this.inputDevice = inputDevice;
        this.currentAssetType = 'character_standing';
        this.collectedCoins = 0;
        this.collectedBottles = 0;
        this.health = 100;
        this.lastHitTime = 0;
        this.hitCooldown = 1000;
        super.setDimensions(this.scale);
    }

    animate() {
        if (this.isDead) {
            super.animateFrames(window.ASSETS.character_dead.length, false); 
            return;
        }
        this.checkSleepState();
        this.move();
        const isMoving = this.inputDevice.isPressed('LEFT') || this.inputDevice.isPressed('RIGHT');
        const isJumping = !this.isGrounded;
        let frameCount;
        let assetType;
        if (this.isHurt) {
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
        if (this.inputDevice.isPressed('LEFT')) {
            this.otherDirection = true;
            if(this.x > this.startX-this.leftEnd) this.moveLeft();
            
        }
        if (this.inputDevice.isPressed('RIGHT')) {
            this.otherDirection = false;
             this.moveRight();
            
        }
        if (this.inputDevice.isPressed('JUMP')) {
            this.jump();
            
        }
    }

    checkSleepState() {
        const now = Date.now();
        const inactivityDuration = 10000;
        if (this.inputDevice.isPressed('LEFT') || this.inputDevice.isPressed('RIGHT') || this.inputDevice.isPressed('JUMP') || !this.isGrounded) {
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

    hurt() {
        const now = Date.now();
        if (now - this.lastHitTime < this.hitCooldown) return;
        this.isHurt = true;
        this.health -= 10;
        this.lastHitTime = now;
        this.assetManager.playSound('character_hurt');
    }
    
    
}
