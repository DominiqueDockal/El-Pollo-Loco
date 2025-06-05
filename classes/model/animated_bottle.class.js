class AnimatedBottle extends AnimatedGameObject {
    constructor(x, y, canvas, assetManager, groundY, speedX, animationSpeed = 100) {
        super(x, y, canvas, assetManager, 'bottle_rotation');
        this.scale = 0.2;
        this.animationSpeed = animationSpeed;
        super.setDimensions(this.scale);
        this.speedX = speedX; 
        this.speedY = -12; 
        this.gravity = 0.8;
        this.groundY = groundY; 
        this.isGrounded = false;
        this.splashDuration = 500; 
        this.splashStartTime = null;
        this.isSplashing = false;
        this.markedForRemoval = false;
        this.currentAssetType = 'bottle_rotation';
        this.currentImageIndex = 0;
        this.setCurrentImage();
        this.lastAnimationTime = Date.now(); 
        
    }

    setCurrentImage() {
        if (this.isSplashing) {
            super.setImageByIndex(this.currentImageIndex, 'splash');
        } else {
            super.setImageByIndex(this.currentImageIndex, 'bottle_rotation');
        }
    }

    animate() {
        if (this.isGrounded && !this.isSplashing) { 
            this.handleGroundHit();
        }
        if (!this.isSplashing) {
            super.animateFrames(window.ASSETS.bottle_rotation.length);
        }  else {
            const currentTime = Date.now();
            if (currentTime - this.splashStartTime >= this.splashDuration) {
                this.markedForRemoval = true;
            }
            super.animateFrames(window.ASSETS.splash.length, false);
        }
    }

    handleGroundHit() {
        this.isSplashing = true;
        this.currentAssetType = 'splash';
        this.currentImageIndex = 0;
        this.setCurrentImage();
        this.splashStartTime = Date.now();
        this.assetManager.playSound('bottle_smash');
    }

    updatePhysics() {
        if (!this.isGrounded) {
            this.x += this.speedX; 
            this.speedY += this.gravity;
            this.y += this.speedY;
            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.speedY = 0;
                this.isGrounded = true;
            }
        }
    }





}
