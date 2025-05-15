class Game {
    canvas;
    ctx;
    keyboard;
    
    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
    }
}