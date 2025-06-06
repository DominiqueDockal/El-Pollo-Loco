class GameObject {
    constructor(x, y, canvas, assetManager, assetType = 'default') {
        if (new.target === GameObject) throw new TypeError('Cannot instantiate abstract class GameObject directly');
        
        this.originalX = x;
        this.originalY = y;
        this.originalCanvasWidth = canvas.width;
        this.originalCanvasHeight = canvas.height; 
        this.x = x;
        this.y = y;
        this.height = 0;
        this.width = 0;
        this.naturalWidth = 0;
        this.naturalHeight = 0;
        this.aspectRatio = 0;
        this.type = assetType;
        this.currentImagePath = null;
        this.canvas = canvas;
        this.assetManager = assetManager; 
        this.otherDirection = false;
        this.isFixed = false;
        this.scale = 1;
        this.setNaturalDimensions();
        this.currentImageIndex = 0;
    }

    setNaturalDimensions() {
        const assets = this.assetManager.getAssetsMetadata(this.type);
        if (assets.length > 0) {
            const firstAsset = assets[0];
            this.naturalWidth = firstAsset.width;
            this.naturalHeight = firstAsset.height;
            this.aspectRatio = this.naturalWidth / this.naturalHeight;
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
        if (this.scale && typeof this.setDimensions === 'function') this.setDimensions(this.scale);
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

    setImageByIndex(index = this.currentImageIndex, assetType = this.type) {
        const asset = this.assetManager.getAssetByIndex(assetType, index);
        if (asset?.src) this.setImage(asset.src);
    }
    

}


