class BackgroundCollection extends Background{
    
    BACKGROUNDPATH = 'img/5_background/layers';
    backgroundObjects = [];
    canvasHeight;
    adaptedCanvasWidth;

    constructor(numberOfPictures, canvasHeight){
       super('img/5_background/layers/air.png', 0);
       this.numberOfPictures = numberOfPictures;
       this.canvasHeight = canvasHeight;
       this.adaptedCanvasWidth = this.scaleImageWidth(this.canvasHeight)-1;
       console.log(`this.adaptedCanvasWidth ${this.adaptedCanvasWidth}`);
       this.createBackgroundObjects();
    }
    
    getLevelEnd(){
       return this.numberOfPictures*this.adaptedCanvasWidth;
    }

    createBackgroundObjects() {  
        for (let i = 0; i < this.numberOfPictures; i++) {
            const xPosition   = (i - 1) * this.adaptedCanvasWidth;
            const imageNumber = (i % 2 === 0) ? 2 : 1;
            this.backgroundObjects.push(new Background(`${this.BACKGROUNDPATH}/air.png`, xPosition));
            this.backgroundObjects.push(new Background(`${this.BACKGROUNDPATH}/3_third_layer/${imageNumber}.png`, xPosition));
            this.backgroundObjects.push(new Background(`${this.BACKGROUNDPATH}/2_second_layer/${imageNumber}.png`,xPosition));
            this.backgroundObjects.push(new Background(`${this.BACKGROUNDPATH}/1_first_layer/${imageNumber}.png`, xPosition));
        }
    }
}