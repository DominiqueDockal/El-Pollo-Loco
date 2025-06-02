class Coin extends AnimatedGameObject {
    constructor(x, y, canvas, assetManager, animationSpeed = 500) {
        super(x, y, canvas, assetManager, 'coin', 0); 
        this.scale = 0.25;
        this.animationSpeed = animationSpeed; 
        this.currentImageIndex = 0;
        this.lastAnimationTime = 0;
        this.isCollected = false;
        this.setCurrentImage();
        super.setDimensions(this.scale);
    }

    setCurrentImage() {
        const coinAssets = window.ASSETS.coin || [];
        if (coinAssets.length > 0) {
            this.currentImagePath = coinAssets[this.currentImageIndex].src;
        }
    }

    animate() {
        if (this.isCollected) return; 
        const currentTime = Date.now();
        if (currentTime - this.lastAnimationTime >= this.animationSpeed) {
            this.currentImageIndex = (this.currentImageIndex + 1) % 2;
            this.setCurrentImage();
            this.lastAnimationTime = currentTime;
        }
    }

    setState(isCollected) {
        this.isCollected = isCollected;
    }
    
    collect() {
        this.setState(true);
    }
}
