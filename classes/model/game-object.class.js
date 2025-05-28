class GameObject {
    constructor(x, y, imagePath, canvasHeight, type = 'default') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.canvasHeight = canvasHeight;
        this.imageCache = {};
        this.img = new Image();
        this.width = 0;
        this.height = 0;
        this.aspectRatio = 1.0;
        this.otherDirection = false;
        this.loadImage(imagePath);
    }

    // nochmal checken wegen height
    
    loadImage(path) {
        this.img.onload = () => {
            this.aspectRatio = this.img.naturalWidth / this.img.naturalHeight;
            this.width = Math.floor(this.aspectRatio * this.canvasHeight);
        };
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });   
    }
}


