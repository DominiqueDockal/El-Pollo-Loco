class Statusbar extends GameObject {
    constructor(x, y, canvas, assetManager, subtype, value = 100) {
        super(x, y, canvas, assetManager, `statusbar_${subtype}`);
        this.subtype = subtype;
        this.value = value;
        this.isFixed = true;
        this.setDimensions();
        this.updateImage();
    }
    
    
    static createHealth(x, y, canvas, assetManager, value = 100) {
        return new Statusbar(x, y, canvas, assetManager, 'health', value);
    }
    
    static createCoin(x, y, canvas, assetManager, value = 0) {
        return new Statusbar(x, y, canvas, assetManager, 'coin', value);
    }
    
    static createBottle(x, y, canvas, assetManager, value = 0) {
        return new Statusbar(x, y, canvas, assetManager, 'bottle', value);
    }

    static createEndbossBar(x, y, canvas, assetManager, value = 100) {
        return new Statusbar(x, y, canvas, assetManager, 'endboss', value);
    }

    setDimensions() {
        const scale = Math.max(0.5, this.canvas.clientHeight / 1080); 
        this.width = Math.ceil(300 * scale); 
        this.height = Math.ceil(80 * scale);
    }
    
    updateImage() {
        const imageIndex = Math.floor(this.value / 20);
        const clampedIndex = Math.max(0, Math.min(5, imageIndex));
        this.setImageByIndex(clampedIndex);
    }
    
    setValue(newValue) {
        this.value = Math.max(0, Math.min(100, newValue));
        this.updateImage();
    }
}
