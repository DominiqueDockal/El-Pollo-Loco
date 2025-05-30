class Bottle extends GameObject {
    constructor(x, y, canvas, assetManager) {
        super(x, y, canvas, assetManager, 'bottle_ground');
        this.isCollected = false;
        this.scale = 0.2;
        super.setDimensions(this.scale);
        this.updateImage();
    }
    
    setState(newState) {
        this.isCollected = newState === 'collected';
        this.updateImage();
    }
    
    updateImage() {
        const stateIndex = this.isCollected ? 1 : 0;
        super.setImageByIndex(stateIndex);
    }
    
    
}
