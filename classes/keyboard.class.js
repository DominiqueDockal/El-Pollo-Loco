class Keyboard{
    LEFT = false;
    RIGHT = false;
    SPACE = false;
    D = false;

    constructor(){
    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'ArrowLeft':  keyboard.LEFT = true; break;
            case 'ArrowRight': keyboard.RIGHT = true; break;
            case 'Space':      keyboard.SPACE = true; break;
        }
        if (event.key === 'd') keyboard.D = true;
    });
    
    document.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'ArrowLeft':  keyboard.LEFT = false; break;
            case 'ArrowRight': keyboard.RIGHT = false; break;
            case 'Space':      keyboard.SPACE = false; break;
        }
        if (event.key === 'd') keyboard.D = false;
    });

    this.registerMobileButtons();
    }

registerMobileButtons() {
    const buttonToKey = {
        button_left:  'LEFT',
        button_right: 'RIGHT',
        button_jump:  'SPACE',
        button_throw: 'D'
    };

    Object.keys(buttonToKey).forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('touchstart', e => {
            e.preventDefault();
            this[buttonToKey[id]] = true;
        });
        btn.addEventListener('mousedown', e => {
            this[buttonToKey[id]] = true;
        });
        btn.addEventListener('touchend', e => {
            e.preventDefault();
            this[buttonToKey[id]] = false;
        });
        btn.addEventListener('mouseup', e => {
            this[buttonToKey[id]] = false;
        });
        btn.addEventListener('mouseleave', e => {
            this[buttonToKey[id]] = false;
        });
    });
}
}
    

