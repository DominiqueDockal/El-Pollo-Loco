class Bottle extends GameObject {
    constructor(x, y, canvas, assetManager) {
        super(x, y, canvas, assetManager, 'bottle_ground');
        this.isCollected = false;
        this.setDimensions();
        this.updateImage();
    }
    
    setDimensions() {
        const scale = Math.max(0.5, this.canvas.clientHeight / 1080); 
        this.width = Math.ceil(180 * scale); 
        this.height = Math.ceil(200 * scale);
    }
    
    setState(newState) {
        this.isCollected = newState === 'collected';
        this.updateImage();
    }
    
    updateImage() {
        const stateIndex = this.isCollected ? 1 : 0;
        this.setImageByIndex(stateIndex);
    }
    
    
}
