class Background extends GameObject {
    constructor(x, y, canvas, assetManager) {
        super(x, y, canvas, assetManager, 'background');
        this.setDimensions();
    }
    
    setDimensions() {
        const canvasHeight = this.canvas.clientHeight;
        const aspectRatio = this.naturalWidth / this.naturalHeight;
        this.height = canvasHeight;
        this.width = Math.ceil(canvasHeight * aspectRatio);
    }

}



