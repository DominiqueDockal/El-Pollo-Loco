class InputDevice {
    constructor() {
        if (new.target === InputDevice) throw new Error("InputDevice is an abstract class and cannot be instantiated directly");
           
        this.currentInput = new Map(); 
        this.previousInput = new Map();
    }
    
    initialize() {
        throw new Error("initialize() must be implemented in the subclass");
    }
    
    cleanup() {
        throw new Error("cleanup() must be implemented in the subclass");
    }

    isPressed(key) {
        return this.currentInput.get(key) || false;
    }
    
    setKeyState(key, pressed) {
        this.currentInput.set(key, pressed);
    }
    
    reset() {
        this.currentInput.clear();
    }

    wasPressed(key) {
        const current = this.currentInput.get(key) || false;
        const previous = this.previousInput.get(key) || false;
        return current && !previous;
    }

    update() {
        this.previousInput = new Map(this.currentInput); 
    }
}
