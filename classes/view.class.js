/**
 * Abstract base class for rendering views in the game
 * @abstract
 * @class View
 * @description Defines the interface for all view implementations. Cannot be instantiated directly.
 * @throws {Error} Throws error when attempting to instantiate directly
 */
class View {
    /**
     * Creates a new View instance
     * @constructor
     * @throws {Error} Throws error if called on View class directly (abstract class protection)
     * @description Protected constructor that prevents direct instantiation of the abstract View class
     */
    constructor() {
        if (new.target === View) throw new Error("View is an abstract class and cannot be instantiated directly");
    }
    
    /**
     * Renders the provided game objects to the view
     * @abstract
     * @param {Array} gameObjects - Array of game objects to render
     * @throws {Error} Must be implemented in subclass
     * @description Abstract method that must be overridden in concrete view implementations
     */
    render(gameObjects) {
        throw new Error("render() must be implemented in the subclass");
    }
    
    /**
     * Clears the current view content
     * @abstract
     * @throws {Error} Must be implemented in subclass
     * @description Abstract method that must be overridden in concrete view implementations
     */
    clear() {
        throw new Error("clear() must be implemented in the subclass");
    }
}

