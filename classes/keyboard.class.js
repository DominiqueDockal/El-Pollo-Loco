/**
 * Keyboard and mobile button input device implementation
 * @class Keyboard
 * @extends InputDevice
 * @description Concrete implementation of InputDevice that handles both keyboard and touch input for cross-platform compatibility
 */
class Keyboard extends InputDevice {
    /**
     * Creates a new Keyboard input device instance
     * @constructor
     * @description Initializes keyboard input handling, binds event handlers, and sets up mobile button support
     */
    constructor() {
        super();
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.mobileButtons = [];
        this.initialize();
    }
    
    /**
     * Initializes keyboard and mobile input event listeners
     * @description Sets up document-level keyboard listeners, configures mobile buttons, and focuses canvas
     * @requires DOM element with ID 'canvas'
     * @override
     */
    initialize() {
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
        this.setupMobileButtons();
        document.getElementById('canvas').focus();
    }
    
     /**
     * Handles keyboard key press events
     * @param {KeyboardEvent} e - The keyboard event object
     * @description Maps keyboard codes to game actions, prevents default behavior, and blurs buttons
     */
    keydownHandler(e) {
        const key = this.mapKey(e.code);
        if (key) {
            e.preventDefault();
            super.setKeyState(key, true);
            document.querySelectorAll('button').forEach(btn => btn.blur());
        }
    }
    
    /**
     * Handles keyboard key release events
     * @param {KeyboardEvent} e - The keyboard event object
     * @description Maps keyboard codes to game actions and updates key state to released
     */
    keyupHandler(e) {
        const key = this.mapKey(e.code);
        if (key) {
            e.preventDefault();
            super.setKeyState(key, false);
        }
    }
    
     /**
     * Sets up mobile touch button event handlers
     * @description Creates touch event listeners for mobile game control buttons, prevents duplicate setup
     * @requires DOM elements with IDs: 'button_left', 'button_right', 'button_jump', 'button_throw'
     */
    setupMobileButtons() {
        if (this.mobileButtons.length > 0) return;
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
            Object.entries(handlers).forEach(([event, handler]) => {button.addEventListener(event, handler, {passive:false});});
            this.mobileButtons.push({ button, handlers });
        });
    }
    
     /**
     * Maps keyboard event codes to game action names
     * @param {string} code - The keyboard event code (e.g., 'ArrowLeft', 'Space')
     * @returns {string|undefined} The mapped game action name or undefined if not mapped
     * @description Converts browser keyboard codes to standardized game action identifiers
     */
    mapKey(code) {
        const keyMap = {
            'ArrowLeft': 'LEFT',
            'ArrowRight': 'RIGHT',
            'Space': 'JUMP',
            'KeyD': 'ACTION'
        };
        return keyMap[code];
    }
    
    /**
     * Cleans up all event listeners and resets input state
     * @description Removes keyboard and mobile button event listeners, clears mobile button array, and resets input state
     * @override
     */
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



    

