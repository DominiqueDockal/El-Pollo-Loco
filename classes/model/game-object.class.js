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
        this.isFixed = false; // nur für Statusbar true
        this.imagePath = imagePath;
    }
    
    loadImage(path =this.imagePath) {
        this.img.onload = () => {
            this.width = this.img.naturalWidth;
            this.height = this.img.naturalHeight;
        };
        this.img.src = path;
    }
    

    // im Moment noch nicht benutzt
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });   
    }
}


