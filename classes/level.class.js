class Level {
    constructor(levelData, collectedCoins) {
        this.keyboard = new Keyboard();
        this.gameCanvas = new GameCanvas('canvas');
        
        this.numberOfPictures = levelData[0];
        this.numberChickens = levelData[1];
        this.numberBottles = levelData[2];
        this.numberCoins = levelData[3];
        this.damageBottles = levelData[4];
        this.collectedCoins = collectedCoins;
        
        // Initialisierung der Spielobjekte
        this.backgroundCollection = new BackgroundCollection(this.numberOfPictures, this.gameCanvas.canvas.height);
        this.backgroundObjects = this.backgroundCollection.backgroundObjects;
        this.levelEnd = this.backgroundCollection.getLevelEnd() - this.gameCanvas.offsetEnd;
        
        this.startGameLoop();
    }

    startGameLoop() {
        this.update();
    }

    update() {
        this.handleInput();
        this.updateGameLogic();
        this.render();
        
        requestAnimationFrame(() => { this.update(); });
    }

    updateGameLogic() {
        // Hier würde die Spiellogik aktualisiert werden
        // z.B. Kollisionserkennung, Objektbewegungen, etc.
    }

    render() {
        this.gameCanvas.render(this.backgroundObjects);
    }




    // temporär
    handleInput() {
        this.handleCameraMovement();
    }

    handleCameraMovement() {
        const cameraSpeed = 5;
        let newCameraX = this.gameCanvas.camera_x;
        
        if (this.keyboard.LEFT) { newCameraX += cameraSpeed; }
        if (this.keyboard.RIGHT) { newCameraX -= cameraSpeed; }
        
        this.gameCanvas.updateCamera(newCameraX);
    }

    limitCameraBounds() {
        const maxLeft = 0;
        const maxRight = -(this.numberOfPictures - 1) * 719;
        
        if (this.gameCanvas.camera_x < maxLeft) {
            this.gameCanvas.updateCamera(maxLeft);
        }
        if (this.gameCanvas.camera_x > maxRight) {
            this.gameCanvas.updateCamera(maxRight);
        }
    }
}
