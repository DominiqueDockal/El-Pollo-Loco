class Chicken extends AnimatedGameObject {
    constructor(x, y, canvas, assetManager, animationSpeed = 300) {
        super(x, y, canvas, assetManager, 'chicken_walk', AnimatedGameObject.randomSpeed(0.8, 1.5)); 
        this.scale = 0.2; 
        this.animationSpeed = animationSpeed; 
        this.currentImageIndex = 0;
        this.lastAnimationTime = 0;
        this.isDead = false;
        this.deathTime = 0;
        this.deathDuration = 1000;
        this.markedForRemoval = false;
        this.setCurrentImage();
        super.setDimensions(this.scale);
    }

    setCurrentImage() {
        if (this.isDead) {
            super.setImageByIndex(0, 'chicken_dead');
        } else {
            super.setImageByIndex(this.currentImageIndex, 'chicken_walk'); 
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
        super.animateFrames(window.ASSETS.chicken_walk.length); 
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

