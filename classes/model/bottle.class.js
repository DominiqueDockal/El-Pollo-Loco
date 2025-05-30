class Bottle extends GameObject {
    constructor(x, y, canvas, assetManager) {
        super(x, y, canvas, assetManager, 'bottle_ground');
        this.isCollected = false;
        this.setDefaultImage(); 
        this.setDimensions();
    }
    
    setDimensions() {
        const scale = Math.max(0.5, this.canvas.clientHeight / 1080); 
        this.width = Math.ceil(180 * scale); 
        this.height = Math.ceil(200 * scale);
    }
    
    collect() {
        this.isCollected = true;
    }

    setDefaultImage() {
        const assets = window.ASSETS[this.type] || [];
        if (assets[0]) {
            this.currentImagePath = assets[0].src;
        }
    }
}
