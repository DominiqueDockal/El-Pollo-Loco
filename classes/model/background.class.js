class Background extends GameObject {
    constructor(x, y, canvasHeight, index = 0) {
        const backgrounds = ['images/background/background_1.png', 'images/background/background_2.png'];
        const imagePath = `${backgrounds[index % backgrounds.length]}`;
        super(x, y, imagePath, canvasHeight, 'background');
        this.loadPromise = this.loadImage(imagePath);
    }
    
    loadImage(path) {
        return new Promise((resolve) => {
            this.img.onload = () => {
                this.aspectRatio = this.img.naturalWidth / this.img.naturalHeight;
                this.width = Math.floor(this.aspectRatio * this.canvasHeight);
                this.height = this.canvasHeight;
                console.log(`Background loaded: ${this.width}px wide`);
                resolve();
            };
            
            if (this.img.complete && this.img.naturalWidth > 0) {
                this.img.onload();
            } else {
                this.img.src = path;
            }
        });
    }

}

