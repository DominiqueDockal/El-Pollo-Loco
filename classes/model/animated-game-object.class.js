class AnimatedGameObject extends GameObject {
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
}
