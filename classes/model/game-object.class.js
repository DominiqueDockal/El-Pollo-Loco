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

    setImage(imagePath) {
        this.currentImagePath = imagePath;
    }

    setImageByIndex(index = 0) {
        const assets = window.ASSETS[this.type] || [];
        if (assets[index] && assets[index].src) { 
            this.setImage(assets[index].src);
        } else {
            console.warn(`No asset found at index ${index} for type: ${this.type}`);
        }
    }
    
    updateDimensions() {
        if (typeof this.setDimensions === 'function') {
            this.setDimensions();
        }
    }


    // vllt?
/*    setDimensions(baseWidth, baseHeight, scaleType = 'proportional') {
    const scale = Math.max(0.5, this.canvas.clientHeight / 1080);
    
    switch(scaleType) {
        case 'fixed':
            this.width = Math.ceil(baseWidth * scale);
            this.height = Math.ceil(baseHeight * scale);
            break;
        case 'aspectRatio':
            const aspectRatio = this.naturalWidth / this.naturalHeight;
            this.height = this.canvas.clientHeight;
            this.width = Math.ceil(this.height * aspectRatio);
            break;
        default:
            this.width = Math.ceil(baseWidth * scale);
            this.height = Math.ceil(baseHeight * scale);
    }
   } */
}
