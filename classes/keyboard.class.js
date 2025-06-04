class Keyboard extends InputDevice {
    constructor() {
        super();
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.mobileButtons = [];
        this.initialize();
    }
    
    initialize() {
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
        this.setupMobileButtons();
        document.getElementById('canvas').focus();
    }
    
    keydownHandler(e) {
        const key = this.mapKey(e.code);
        if (key) {
            e.preventDefault();
            this.setKeyState(key, true);
            document.querySelectorAll('button').forEach(btn => btn.blur());
        }
    }
    
    keyupHandler(e) {
        const key = this.mapKey(e.code);
        if (key) {
            e.preventDefault();
            this.setKeyState(key, false);
        }
    }
    
    setupMobileButtons() {
        const buttonMapping = {
            'button_left': 'LEFT',
            'button_right': 'RIGHT',
            'button_jump': 'JUMP',
            'button_throw': 'ACTION'
        };
        
        Object.entries(buttonMapping).forEach(([buttonId, key]) => {
            const button = document.getElementById(buttonId);
            if (!button) return;
            const handlers = {
                touchstart: (e) => { e.preventDefault(); this.setKeyState(key, true); },
                touchend: (e) => { e.preventDefault(); this.setKeyState(key, false); },
            };
            Object.entries(handlers).forEach(([event, handler]) => {
                button.addEventListener(event, handler, {passive:false});
            });
            this.mobileButtons.push({ button, handlers });
        });
    }
    
    mapKey(code) {
        const keyMap = {
            'ArrowLeft': 'LEFT',
            'ArrowRight': 'RIGHT',
            'Space': 'JUMP',
            'KeyD': 'ACTION'
        };
        return keyMap[code];
    }

    cleanup() {
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);
        this.mobileButtons.forEach(({ button, handlers }) => {
            Object.entries(handlers).forEach(([event, handler]) => {
                button.removeEventListener(event, handler, {passive:false});
            });
        });
        
        this.mobileButtons = [];
        this.reset();
    }

}



    

