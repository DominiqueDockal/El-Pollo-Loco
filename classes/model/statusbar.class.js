class Statusbar extends GameObject {
    constructor(x, y, canvas, assetManager, subtype, value = 100) {
        super(x, y, canvas, assetManager, `statusbar_${subtype}`);
        this.subtype = subtype;
        this.value = value;
        this.isFixed = true;
        this.scale= 0.1;
        super.setDimensions(this.scale);
        this.updateImage();
    }
     
    static createHealthBar(x, y, canvas, assetManager, value = 100) {
        return new Statusbar(x, y, canvas, assetManager, 'health', value);
    }
    
    static createCoinBar(x, y, canvas, assetManager, value = 0) {
        return new Statusbar(x, y, canvas, assetManager, 'coin', value);
    }
    
    static createBottleBar(x, y, canvas, assetManager, value = 0) {
        return new Statusbar(x, y, canvas, assetManager, 'bottle', value);
    }

    static createEndbossBar(x, y, canvas, assetManager, value = 100) {
        return new Statusbar(x, y, canvas, assetManager, 'endboss', value);
    }
    
    updateImage() {
        const imageIndex = Math.floor(this.value / 20);
        const clampedIndex = Math.max(0, Math.min(5, imageIndex));
        super.setImageByIndex(clampedIndex);
    }
    
    setValue(newValue) {
        this.value = Math.max(0, Math.min(100, newValue));
        this.updateImage();
    }
}
