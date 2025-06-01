class Cloud extends AnimatedGameObject {
    constructor(x, y, canvas, assetManager, level = 1, cloudIndex = 1, speed = 0.15) {
        super(x, y, canvas, assetManager, 'clouds', speed);
        this.level = level;
        this.cloudIndex = cloudIndex; 
        this.scale = 1; 
        this.setCloudImage();
        super.setDimensions(this.scale);
    }

    setCloudImage() {
        const cloudAsset = window.ASSETS.clouds.find(cloud => 
            cloud.src.includes(`${this.cloudIndex}_level${this.level}`)
        ); 
        if (cloudAsset) {
            this.currentImagePath = cloudAsset.src;
        }
    }

    animate() {
        this.moveLeft();
        if (this.x < -this.width) { 
            this.x = this.canvas.clientWidth; 
        }
    }
}
