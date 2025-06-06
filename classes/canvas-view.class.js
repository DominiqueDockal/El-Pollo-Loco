class CanvasView extends View {
    constructor(canvasElement) {
        super();
        this.canvas = canvasElement;
        this.context = canvasElement.getContext('2d');
        this.camera_x = -50;
    }
    
    render(gameObjects) {
        this.clear();
        this.translateCamera(); 
        gameObjects.filter(obj => !obj.isFixed).forEach(gameObject => {
            this.renderGameObject(gameObject);
        });
        this.resetCameraTranslation();
        gameObjects.filter(obj => obj.isFixed).forEach(gameObject => {
            this.renderGameObject(gameObject);
        });
    }
    
    renderGameObject(gameObject) {
        if (!gameObject.img?.complete || gameObject.width === 0) return;
        if (gameObject.otherDirection) {
            this.flipImage(gameObject);  
        } else {
            this.context.drawImage(gameObject.img,gameObject.x,gameObject.y,gameObject.width,gameObject.height);
        }
    }
     
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    translateCamera() {
        this.context.save();
        this.context.translate(this.camera_x, 0);
    }
    
    resetCameraTranslation() {
        this.context.restore(); 
    }

    flipImage(gameObject) {
        this.context.save();
        this.context.translate(gameObject.x + gameObject.width, gameObject.y);
        this.context.scale(-1, 1);
        this.context.drawImage(gameObject.img, 0, 0, gameObject.width, gameObject.height);
        this.context.restore();
    }
    
    
}

