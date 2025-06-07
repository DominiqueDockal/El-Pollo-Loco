/**
 * Abstract base class for handling input devices
 * @abstract
 * @class InputDevice
 * @description Provides input state tracking with current and previous frame comparison capabilities
 * @throws {Error} Throws error when attempting to instantiate directly
 */
class InputDevice {
    /**
     * Creates a new InputDevice instance
     * @constructor
     * @throws {Error} Throws error if called on InputDevice class directly (abstract class protection)
     * @description Protected constructor that prevents direct instantiation and initializes input state maps
     */
    constructor() {
        if (new.target === InputDevice) throw new Error("InputDevice is an abstract class and cannot be instantiated directly");
           
        this.currentInput = new Map(); 
        this.previousInput = new Map();
    }
    
    /**
     * Initializes the input device and sets up event listeners
     * @abstract
     * @throws {Error} Must be implemented in subclass
     * @description Abstract method that must be overridden to set up device-specific input handling
     */
    initialize() {
        throw new Error("initialize() must be implemented in the subclass");
    }
    
    /**
     * Cleans up input device resources and removes event listeners
     * @abstract
     * @throws {Error} Must be implemented in subclass
     * @description Abstract method that must be overridden to handle device-specific cleanup
     */
    cleanup() {
        throw new Error("cleanup() must be implemented in the subclass");
    }

    /**
     * Checks if a key is currently pressed
     * @param {string} key - The key identifier to check
     * @returns {boolean} true if the key is currently pressed, false otherwise
     * @description Returns the current press state of the specified key
     */
    isPressed(key) {
        return this.currentInput.get(key) || false;
    }
    
    /**
     * Sets the press state of a specific key
     * @param {string} key - The key identifier to set
     * @param {boolean} pressed - Whether the key is pressed (true) or not (false)
     * @description Updates the current input state for the specified key
     */
    setKeyState(key, pressed) {
        this.currentInput.set(key, pressed);
    }
    
    /**
     * Resets all input states to unpressed
     * @description Clears all current input states, effectively releasing all keys
     */
    reset() {
        this.currentInput.clear();
    }
    
     /**
     * Checks if a key was just pressed (press detection)
     * @param {string} key - The key identifier to check
     * @returns {boolean} true if the key was just pressed this frame, false otherwise
     * @description Returns true only on the first frame when a key is pressed (not held)
     */
    wasPressed(key) {
        const current = this.currentInput.get(key) || false;
        const previous = this.previousInput.get(key) || false;
        return current && !previous;
    }

     /**
     * Updates input state for the next frame
     * @description Copies current input state to previous input state for next frame comparison
     */
    update() {
        this.previousInput = new Map(this.currentInput); 
    }
}
