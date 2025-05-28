class InputDevice {
    constructor() {
        if (new.target === InputDevice) {
            throw new Error("InputDevice is an abstract class and cannot be instantiated directly");
        }       
        this.inputState = new Map();
    }
    
    initialize() {
        throw new Error("initialize() must be implemented in the subclass");
    }
    
    cleanup() {
        throw new Error("cleanup() must be implemented in the subclass");
    }
    
    isPressed(key) {
        return this.inputState.get(key) || false;
    }
    
    setKeyState(key, pressed) {
        this.inputState.set(key, pressed);
    }
    
    reset() {
        this.inputState.clear();
    }
}
