class CanvasView extends View {
    constructor(canvasElement) {
        super();
        this.canvas = canvasElement;
        this.context = canvasElement.getContext('2d');
        this.camera_x = -100;
        this.offsetEnd = 100;
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
        if (!gameObject.img || !gameObject.img.complete || gameObject.width === 0) {
            return; 
        }
        if (gameObject.otherDirection) {
            this.flipImage(gameObject);
        }
        this.context.drawImage(gameObject.img,gameObject.x,gameObject.y,gameObject.width,gameObject.height);
        if (gameObject.otherDirection) {
            this.flipImageBack(gameObject);
        }
    }
    
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    translateCamera() {
        this.context.translate(this.camera_x, 0);
    }

    resetCameraTranslation() {
        this.context.translate(-this.camera_x, 0);
    }

    flipImage(gameObject) {
        this.context.save();
        this.context.translate(gameObject.width, 0);
        this.context.scale(-1, 1);
        gameObject.x = gameObject.x * -1;
    }

    flipImageBack(gameObject) {
        gameObject.x = gameObject.x * -1;
        this.context.restore();
    }
}

