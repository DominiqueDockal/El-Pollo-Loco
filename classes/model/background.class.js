class Background extends GameObject {
    constructor(x, y, canvasHeight, index = 0) {
        const backgrounds = ['images/background/background_1.png', 'images/background/background_2.png'];
        const imagePath = `${backgrounds[index % backgrounds.length]}`;
        super(x, y, imagePath, canvasHeight, 'background');
    }
    
    loadImage(path) {
        this.img.onload = () => {
            this.aspectRatio = this.img.naturalWidth / this.img.naturalHeight;
            this.width = Math.floor(this.aspectRatio * this.canvasHeight);
            this.height = this.canvasHeight;
        };
        this.img.src = path;
    }
}

