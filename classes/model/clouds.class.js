class Cloud extends AnimatedGameObject {
    constructor(x, y, canvas, assetManager, level = 1, cloudIndex = 1, speed = 0.15) {
        super(x, y, canvas, assetManager, 'clouds', speed);
        this.level = level;
        this.cloudIndex = cloudIndex; 
        this.scale = 1; 
        this.setCurrentImage();
        super.setDimensions(this.scale);
    }

    setCurrentImage() {
        const clouds = this.assetManager.getAssetsMetadata(this.type);
        const cloudAsset = clouds.find(cloud => 
            cloud.src.includes(`${this.cloudIndex}_level${this.level}`)
        );
        if (cloudAsset) this.setImage(cloudAsset.src);
    }

    animate() {
        this.moveLeft();
        if (this.x < -this.width) this.x = this.canvas.clientWidth; 
    }
}
