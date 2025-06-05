class AnimatedGameObject extends GameObject {
    static randomSpeed(min = 1, max = 1) {
        return Math.random() * (max - min) + min;
    }

    constructor(x, y, canvas, assetManager, assetType, speed = 1) {
        super(x, y, canvas, assetManager, assetType);
        this.speed = speed;
        this.speedY = 0;         
        this.gravity = 0.5;   
        this.isGrounded = true;
        this.jumpForce = -12; 
        this.groundY = y;    
    }

    moveLeft() {
        this.x -= this.speed;
    }
    
    moveRight() {
        this.x += this.speed;
    }

    jump() {
        if (this.isGrounded) {
            this.speedY = this.jumpForce;
            this.isGrounded = false;
            this.assetManager.playSound('jumping');
        }
    }

    updatePhysics() {
        if (!this.isGrounded) {
            this.speedY  += this.gravity; 
            this.y += this.speedY ;
            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.speedY  = 0;
                this.isGrounded = true;
            }
        }
    }

    animateFrames(maxFrames, shouldLoop = true) {
        const currentTime = Date.now();
        if (currentTime - this.lastAnimationTime >= this.animationSpeed) {
            if (shouldLoop) {
                this.currentImageIndex = (this.currentImageIndex + 1) % maxFrames;
            } else {
                if (this.currentImageIndex < maxFrames - 1) {
                    this.currentImageIndex++;
                }
            }
            this.setCurrentImage();
            this.lastAnimationTime = currentTime;
        }
    }
      

}


