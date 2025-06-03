class Coin extends AnimatedGameObject {
    constructor(x, y, canvas, assetManager, animationSpeed = 500) {
        super(x, y, canvas, assetManager, 'coin', 0); 
        this.scale = 0.25;
        this.animationSpeed = animationSpeed; 
        this.currentImageIndex = 0;
        this.lastAnimationTime = 0;
        this.setCurrentImage();
        super.setDimensions(this.scale);
    }

    setCurrentImage() {
        super.setImageByIndex(); 
    }
    
    animate() {
        super.animateFrames(window.ASSETS.coin.length);
    }

    collected() {
        this.assetManager.playSound('coin_collect');
    }
    

}
