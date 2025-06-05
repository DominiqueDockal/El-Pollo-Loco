class ChickenSmall extends AnimatedGameObject {
    constructor(x, y, canvas, assetManager, animationSpeed = 300) {
        super(x, y, canvas, assetManager, 'chicken_small_walk', AnimatedGameObject.randomSpeed(1,1.5)); 
        this.scale = 0.2; 
        this.animationSpeed = animationSpeed; 
        this.currentImageIndex = 0;
        this.lastAnimationTime = 0;
        this.isDead = false;
        this.deathTime = 0;
        this.deathDuration = 800;
        this.markedForRemoval = false;
        this.setCurrentImage();
        super.setDimensions(this.scale);
        this.canHit = true;
        this.lastHitTime = 0;
        this.hitCooldown = 1000; 
    }

    setCurrentImage() {
        if (this.isDead) {
            super.setImageByIndex(0, 'chicken_small_dead');
        } else {
            super.setImageByIndex(this.currentImageIndex, 'chicken_small_walk');
        }
    }

    animate() {
        if (this.isDead) {
            const currentTime = Date.now();
            if (currentTime - this.deathTime >= this.deathDuration) {
                this.markedForRemoval = true;
            }
            return; 
        } 
        super.animateFrames(window.ASSETS.chicken_small_walk.length); 
        this.moveLeft();
    }

    kill() {
        if (!this.isDead) {
            this.isDead = true;
            this.deathTime = Date.now(); 
            this.setCurrentImage(); 
            this.assetManager.playSound('chicken_dead');
        }
    }
}
