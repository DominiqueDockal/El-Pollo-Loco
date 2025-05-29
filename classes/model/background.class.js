class Background extends GameObject {
    constructor(x, y, canvasHeight, index = 0) {
        const imagePath = window.game.getAssetPath('background', index % ASSETS.background.length);
        super(x, y, imagePath, canvasHeight, 'background');
    }
}



