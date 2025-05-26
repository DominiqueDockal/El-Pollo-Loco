class DrawableObject  {
    img;
    imageCache ={};
    currentImage = 0;
    x = 0;
    y = 0;
    height = 0;
    width  = 0;
    otherDirection;
    canvasHeight;
    canvas;

    constructor(imagePath) {
        this.canvas = document.getElementById('canvas');
        this.canvasHeight = this.canvas.height;
        this.loadImage(imagePath);
        this.scaleImageWidth(this.canvasHeight);
    }
    
    scaleImageWidth() {
        this.aspectRatio = this.img.naturalWidth/this.img.naturalHeight;
        this.width = Math.floor(this.aspectRatio*this.canvasHeight);
        return this.width;
    }

    loadImage(path) {
        this.img = new Image(); 
        this.img.src=path;
    }

    loadImages(arr){
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });   
    }

    draw(ctx){
        ctx.drawImage(this.img, this.x , this.y, this.width, this.height);
    }

    /* wird später kleiner und transparent */
    /* drawFrame(ctx){
        if(this instanceof Character || this instanceof SmallChicken || this instanceof BigChicken || this instanceof Endboss){
        ctx.beginPath();
        ctx.lineWidth='5';
        ctx.strokeStyle ='purple';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        }
    } */
}