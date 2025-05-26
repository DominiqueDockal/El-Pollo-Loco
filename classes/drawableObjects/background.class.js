class Background extends DrawableObject {
 
    constructor(imagePath, x){
        super(imagePath, x);
        this.y = 0;
        this.width = this.scaleImageWidth();
        this.height = this.canvasHeight;
    }
    
}
