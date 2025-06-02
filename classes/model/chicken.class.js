class Chicken extends AnimatedGameObject {
    constructor(x, y, canvas, assetManager, animationSpeed = 300) {
        super(x, y, canvas, assetManager, 'chicken_walk', 1); 
        this.scale = 0.2; 
        this.animationSpeed = animationSpeed; 
        this.currentImageIndex = 0;
        this.lastAnimationTime = 0;
        this.isDead = false;
        this.setCurrentImage();
        super.setDimensions(this.scale);
    }

    setCurrentImage() {
        if (this.isDead) {
            const deadAssets = window.ASSETS.chicken_dead || [];
            if (deadAssets.length > 0) {
                this.currentImagePath = deadAssets[0].src;
            }
        } else {
            const chickenAssets = window.ASSETS.chicken_walk || [];
            if (chickenAssets.length > 0) {
                this.currentImagePath = chickenAssets[this.currentImageIndex].src;
            }
        }
    }

    animate() {
        if (this.isDead) {
            return; 
        }
        const currentTime = Date.now();
        if (currentTime - this.lastAnimationTime >= this.animationSpeed) {
            this.currentImageIndex = (this.currentImageIndex + 1) % 3;
            this.setCurrentImage();
            this.lastAnimationTime = currentTime;
        }
        
        this.moveLeft();
    }
    
    kill() {
        if (!this.isDead) { 
            this.isDead = true;
            this.setCurrentImage();
        }
    }
}

