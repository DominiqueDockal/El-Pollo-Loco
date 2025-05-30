class GameObject {
    constructor(x, y, canvas, assetManager, type = 'default') {
        if (new.target === GameObject) {
            throw new TypeError('Cannot instantiate abstract class GameObject directly');
        } 
        this.x = x;
        this.y = y;
        this.height = 0;
        this.width = 0;
        this.type = type;
        this.currentImagePath = null;
        this.canvas = canvas;
        this.assetManager = assetManager; 
        this.otherDirection = false;
        this.isFixed = false;
        this.setNaturalDimensions();
    }

    get img() {
        return this.currentImagePath ? this.getImage(this.currentImagePath) : null;
    }

    setNaturalDimensions() {
        const assets = window.ASSETS || {};
        if (assets[this.type] && Array.isArray(assets[this.type])) {
            const firstAsset = assets[this.type][0]; 
            if (firstAsset && firstAsset.width && firstAsset.height) {
                this.naturalWidth = firstAsset.width;
                this.naturalHeight = firstAsset.height;
                this.width = firstAsset.width;
                this.height = firstAsset.height;
            }
        }
    }

    getImage(imagePath) {
        return this.assetManager.getImage(imagePath);
    }

    getImagesByType(type) {
        const assets = window.ASSETS[type] || [];
        return assets.map(imgObj => {
            const path = imgObj.src || imgObj;
            return this.getImage(path);
        }).filter(img => img);
    }

    updateDimensions() {
        if (typeof this.setDimensions === 'function') {
            this.setDimensions();
        }
    }
}
