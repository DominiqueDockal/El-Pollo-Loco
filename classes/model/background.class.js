class Background extends GameObject {
    constructor(x, y, canvasHeight, index = 0) {
        const backgrounds = ['background1.png', 'background2.png'];
        const imagePath = `images/${backgrounds[index % backgrounds.length]}`;
        super(x, y, imagePath, canvasHeight, 'background');
        this.index = index;
    }
    
    loadImage(path) {
        this.img.onload = () => {
            this.aspectRatio = this.img.naturalWidth / this.img.naturalHeight;
            this.width = Math.floor(this.aspectRatio * this.canvasHeight);
            this.height = this.canvasHeight;
            this.x = this.index * this.width;
        };
        this.img.src = path;
    }
}

