class GameObject {
    constructor(x, y, canvas, assetManager, type = 'default') {
        if (new.target === GameObject) {
            throw new TypeError('Cannot instantiate abstract class GameObject directly');
        } 
        this.originalX = x;
        this.originalY = y;
        this.originalCanvasWidth = canvas.width;
        this.originalCanvasHeight = canvas.height; 

        this.x = x;
        this.y = y;
        this.height = 0;
        this.width = 0;
        this.aspectRatio = 0;
        this.type = type;
        this.currentImagePath = null;
        this.canvas = canvas;
        this.assetManager = assetManager; 
        this.otherDirection = false;
        this.isFixed = false;
        this.scale = 0;
        this.setNaturalDimensions();
    }

    setNaturalDimensions() {
        const assets = window.ASSETS || {};
        if (assets[this.type] && Array.isArray(assets[this.type])) {
            const firstAsset = assets[this.type][0]; 
            if (firstAsset && firstAsset.width && firstAsset.height) {
                this.naturalWidth = firstAsset.width;
                this.naturalHeight = firstAsset.height;
                this.aspectRatio = this.naturalWidth / this.naturalHeight;
            }
        }
    }

    setDimensions(scale) {
        this.height = scale * this.canvas.clientHeight;
        this.width =Math.ceil(this.height * this.aspectRatio);
    } 

    updateDimensions() {
        const scaleX = this.canvas.width / this.originalCanvasWidth;
        const scaleY = this.canvas.height / this.originalCanvasHeight;
        this.x = this.originalX * scaleX;
        this.y = this.originalY * scaleY;
        if (this.scale && typeof this.setDimensions === 'function') {
            this.setDimensions(this.scale);
        }
    } 

    get img() {
        return this.currentImagePath ? this.getImage(this.currentImagePath) : null;
    }

    getImage(imagePath) {
        return this.assetManager.getImage(imagePath);
    }

    setImage(imagePath) {
        this.currentImagePath = imagePath;
    }

    setImageByIndex(index = 0) {
        const assets = window.ASSETS[this.type] || [];
        if (assets[index] && assets[index].src) { 
            this.setImage(assets[index].src);
        }
    }
    



}
