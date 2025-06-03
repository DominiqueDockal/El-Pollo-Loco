class Character extends AnimatedGameObject {
    constructor(x, y, canvas, assetManager, inputDevice, animationSpeed = 100) {
        super(x, y, canvas, assetManager, 'character_standing', 5);
        this.scale = 0.7;
        this.animationSpeed = animationSpeed;
        this.currentImageIndex = 0;
        this.lastAnimationTime = 0;
        this.groundY = y; 
        this.startX = x;  
        this.leftEnd = 150;
        this.isHurt = false;
        this.isDead = false;
        this.inputDevice = inputDevice;
        this.currentAssetType = 'character_standing';
        super.setDimensions(this.scale);
    }

    animate() {
        if (this.isDead) {
            super.animateFrames(7, false); 
            return;
        }
        this.move();
        const isMoving = this.inputDevice.isPressed('LEFT') || this.inputDevice.isPressed('RIGHT');
        const isJumping = !this.isGrounded;
        let frameCount;
        let assetType;
        if (this.isHurt) {
            assetType = 'character_hurt';
            frameCount = 3;
        } else if (isJumping) {
            assetType = 'character_jumping';
            frameCount = 9;
        } else if (isMoving) {
            assetType = 'character_walking';
            frameCount = 6;
        } else {
            assetType = 'character_standing';
            frameCount = 5;
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
    
    
}
