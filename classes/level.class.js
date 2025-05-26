class Level {
    canvas;
    ctx;
    keyboard;
    numberOfPictures;
    backgroundObjects = [];
    numberChickens;
    numberBottles;
    numberCoins;
    damageBottles;
    collectedCoins;
    statusbar;
    levelEnd;
    offsetEnd = 100;
    camera_x = -100;


     constructor(levelData, collectedCoins){
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this.keyboard = new Keyboard();
        
        this.numberOfPictures = levelData[0];
        this.numberChickens = levelData[1];
        this.numberBottles = levelData[2];
        this.numberCoins = levelData[3];
        this.damageBottles = levelData[4];

        this.collectedCoins = collectedCoins;
        // this.statusbar = new this.statusbar(collectedCoins);
        this.backgroundCollection = new BackgroundCollection(this.numberOfPictures, this.canvas.height);
        this.backgroundObjects = this.backgroundCollection.backgroundObjects;
        this.levelEnd = this.backgroundCollection.getLevelEnd()-this.offsetEnd;        
        this.draw();
    }

    draw(){
        // Kamerasteuerung
        this.handleCameraMovement();
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x,0);
        this.addObjectsToMap(this.backgroundObjects);
        this.ctx.translate(-this.camera_x,0);
        requestAnimationFrame(() => {this.draw();});
    };

    handleCameraMovement() {
        const cameraSpeed = 5; // Pi
        if (this.keyboard.LEFT)  {this.camera_x += cameraSpeed; }
        if (this.keyboard.RIGHT) {this.camera_x -= cameraSpeed; }
        //this.limitCameraBounds();
    };
    
    limitCameraBounds() {
        const maxLeft = 0;
        const maxRight = -(this.numberOfPictures-1)*719;
        if (this.camera_x < maxLeft)  {this.camera_x = maxLeft}
        if (this.camera_x > maxRight) {this.camera_x = maxRight}
    }

    addObjectsToMap(objects){
        objects.forEach(o => {this.addToMap(o);});
    }

    addToMap(dobject) {
        if(dobject.otherDirection){
            this.flipImage(dobject);
        }
        dobject.draw(this.ctx);
        //dobject.drawFrame(this.ctx);
        if (dobject.otherDirection) {
            this.flipImageBack(dobject);
        }
    }

    flipImage(dobject){
        this.ctx.save();
        this.ctx.translate(dobject.width, 0);
        this.ctx.scale(-1,1);
        dobject.x= dobject.x* -1;
    }

    flipImageBack(dobject){
        dobject.x = dobject.x* -1;
        this.ctx.restore();
    }

    
}