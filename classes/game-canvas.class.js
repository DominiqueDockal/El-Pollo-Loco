class GameCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.camera_x = -100;
        this.offsetEnd = 100;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    translateCamera() {
        this.ctx.translate(this.camera_x, 0);
    }

    resetCameraTranslation() {
        this.ctx.translate(-this.camera_x, 0);
    }

    addObjectsToMap(objects) {
        objects.forEach(o => { this.addToMap(o); });
    }

    addToMap(dobject) {
        if (dobject.otherDirection) {
            this.flipImage(dobject);
        }
        
        dobject.draw(this.ctx);
        
        if (dobject.otherDirection) {
            this.flipImageBack(dobject);
        }
    }

    flipImage(dobject) {
        this.ctx.save();
        this.ctx.translate(dobject.width, 0);
        this.ctx.scale(-1, 1);
        dobject.x = dobject.x * -1;
    }

    flipImageBack(dobject) {
        dobject.x = dobject.x * -1;
        this.ctx.restore();
    }

    updateCamera(camera_x) {
        this.camera_x = camera_x;
    }

    render(backgroundObjects) {
        this.clearCanvas();
        this.translateCamera();
        this.addObjectsToMap(backgroundObjects);
        this.resetCameraTranslation();
    }
}
