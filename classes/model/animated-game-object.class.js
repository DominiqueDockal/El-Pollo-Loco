class AnimatedGameObject extends GameObject {
    static randomSpeed(min = 1, max = 1) {
        return Math.random() * (max - min) + min;
    }

    constructor(x, y, canvas, assetManager, assetType, speed = 1) {
        super(x, y, canvas, assetManager, assetType);
        this.speed = speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveUp() {
        this.y -= this.speed;
    }

    moveDown() {
        this.y += this.speed;
    }

    animateFrames(maxFrames) {
        const currentTime = Date.now();
        if (currentTime - this.lastAnimationTime >= this.animationSpeed) {
            this.currentImageIndex = (this.currentImageIndex + 1) % maxFrames;
            this.setCurrentImage();
            this.lastAnimationTime = currentTime;
        }
    }

}


