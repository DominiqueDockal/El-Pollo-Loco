class Background extends GameObject {
    constructor(x, y, canvas, assetManager) {
        super(x, y, canvas, assetManager, 'background');
        this.scale = 1;
        this.setDimensions(this.scale);
    }

}



