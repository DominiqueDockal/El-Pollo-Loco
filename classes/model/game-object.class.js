class GameObject {
    constructor(x, y, imagePath, canvasHeight, type = 'default') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.canvasHeight = canvasHeight;
        this.imagePath = imagePath;
        this.img = window.game.getImage(imagePath);
        
        if (this.img) {
            this.originalWidth = this.img.naturalWidth;
            this.originalHeight = this.img.naturalHeight;
            this.applyGlobalScale();
        }
        this.otherDirection = false;
        this.isFixed = false;
    }

    applyGlobalScale() {
        const scaledDimensions = window.game.getScaledDimensions(this.originalWidth, this.originalHeight);
        this.width = scaledDimensions.width;
        this.height = scaledDimensions.height;
        this.scaleFactor = scaledDimensions.scaleFactor;
    }

}


