let canvas;
let keyboard;

function init() {
    canvas = document.getElementById('canvas');
    keyboard = new Keyboard();
    game = new Game(canvas, keyboard);
}

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowLeft':  keyboard.LEFT = true; break;
        case 'ArrowRight': keyboard.RIGHT = true; break;
        case 'ArrowUp':    keyboard.UP = true; break;
        case 'ArrowDown':  keyboard.DOWN = true; break;
        case 'Space':      keyboard.SPACE = true; break;
    }
    if (event.key === 'd') keyboard.D = true;
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'ArrowLeft':  keyboard.LEFT = false; break;
        case 'ArrowRight': keyboard.RIGHT = false; break;
        case 'ArrowUp':    keyboard.UP = false; break;
        case 'ArrowDown':  keyboard.DOWN = false; break;
        case 'Space':      keyboard.SPACE = false; break;
    }
    if (event.key === 'd') keyboard.D = false;
});



//  für die mobile ansicht Buttons einfügt, die hier ebenfalls abgefragt werden müssen über Element by ID

function fullscreen(){
    
}