class Background extends GameObject {
    constructor(x, y, canvas, assetManager) {
        super(x, y, canvas, assetManager, 'background');
        this.setDimensions();
    }
    
    setDimensions() {
        const canvasHeight = this.canvas.clientHeight;
        this.height = canvasHeight;
        this.width = Math.ceil(canvasHeight * this.aspectRatio);
    }

}



