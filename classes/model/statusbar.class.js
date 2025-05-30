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

    setDimensions() {
        this.width = 210;
        this.height= 50;
    }

    updateImage() {
        const imageIndex = Math.floor(this.value / 20); 
        const clampedIndex = Math.max(0, Math.min(5, imageIndex));
        const assets = window.ASSETS[this.type] || [];
        if (assets[clampedIndex]) {
            this.currentImagePath = assets[clampedIndex].src;
        }
    }
    
    setValue(newValue) {
        this.value = Math.max(0, Math.min(100, newValue));
        this.updateImage();
    }
}
