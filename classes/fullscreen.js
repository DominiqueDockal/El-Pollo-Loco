
setupFullscreenHandlers() {
    document.addEventListener('fullscreenchange', () => {this.handleFullscreenChange();});
    document.addEventListener('webkitfullscreenchange', () => {this.handleFullscreenChange();});
    document.addEventListener('mozfullscreenchange', () => {this.handleFullscreenChange();});
}

handleFullscreenChange() {
    this.updateCanvasSize();
    this.calculateGlobalScaleFactor();
    this.rescaleAllGameObjects();
    this.repositionBackgrounds(); 
    this.render();
}

updateCanvasSize() {
    if (this.isFullscreen()) {
        this.canvas.width = window.screen.width;
        this.canvas.height = window.screen.height;
    } else {
        this.canvas.width = 720;  
        this.canvas.height = 480; 
    }
}

isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
}

rescaleAllGameObjects() {
    if (this.currentLevel && this.currentLevel.gameObjects) {
        this.currentLevel.gameObjects.forEach(obj => {
            if (obj.applyGlobalScale) {
                obj.applyGlobalScale();
            }
        });
    }
}

repositionBackgrounds() {
    if (!this.currentLevel) return; 
    const backgrounds = this.currentLevel.gameObjects.filter(obj => obj.type === 'background');
    if (backgrounds.length === 0) return;
    backgrounds[0].x = 0;
    let currentX = 0;
    for (let i = 1; i < backgrounds.length; i++) {
        currentX += backgrounds[0].width - 1; 
        backgrounds[i].x = currentX;
    }
    console.log(`${backgrounds.length} Backgrounds neu positioniert, neue Breite: ${backgrounds[0].width}px`);
}