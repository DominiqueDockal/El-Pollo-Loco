class Bottle extends GameObject {
    constructor(x, y, canvas, assetManager) {
        super(x, y, canvas, assetManager, 'bottle_ground');
        this.scale = 0.2;
        this.setCurrentImage(); 
        super.setDimensions(this.scale);
    }

    setCurrentImage() {
        const bottleAssets = this.assetManager.getAssetsMetadata('bottle_ground');
        if (bottleAssets.length > 0) {
            const randomIndex = Math.floor(Math.random() * bottleAssets.length);
            super.setImageByIndex(randomIndex, 'bottle_ground');
        }
    }

    collected() {
        this.assetManager.playSound('bottle_collect');
    }
}
