class Keyboard{
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;

    constructor(){
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
    
}
}