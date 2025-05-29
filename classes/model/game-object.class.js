class GameObject {
    constructor(x, y, imagePath, canvasHeight, type = 'default') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.canvasHeight = canvasHeight;
        this.imagePath = imagePath;
        
        this.otherDirection = false;
        this.isFixed = false;
    }


}



