/**
 * Visual status bar for displaying game statistics like health, coins, bottles, and boss health
 * @class Statusbar
 * @extends GameObject
 * @description UI element that displays different status values using image frames based on value ranges
 */
class Statusbar extends GameObject {
    /**
     * Creates a new Statusbar instance
     * @constructor
     * @param {number} x - X position on the canvas
     * @param {number} y - Y position on the canvas
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading images
     * @param {string} subtype - Type of status bar ('health', 'coin', 'bottle', 'endboss')
     * @param {number} [value=100] - Initial value of the status bar (0-100)
     * @description Initializes a status bar with fixed positioning and automatic image scaling
     */
    constructor(x, y, canvas, assetManager, subtype, value = 100) {
        super(x, y, canvas, assetManager, `statusbar_${subtype}`);
        this.subtype = subtype;
        this.value = value;
        this.isFixed = true;
        this.scale= 0.1;
        super.setDimensions(this.scale);
        this.updateImage();
    }
    
    /**
     * Creates a health status bar
     * @static
     * @param {number} x - X position on the canvas
     * @param {number} y - Y position on the canvas
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading images
     * @param {number} [value=100] - Initial health value (0-100)
     * @returns {Statusbar} New health status bar instance
     * @description Factory method for creating health status bars with default full health
     */
    static createHealthBar(x, y, canvas, assetManager, value = 100) {
        return new Statusbar(x, y, canvas, assetManager, 'health', value);
    }
    
    /**
     * Creates a coin counter status bar
     * @static
     * @param {number} x - X position on the canvas
     * @param {number} y - Y position on the canvas
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading images
     * @param {number} [value=0] - Initial coin count (0-100)
     * @returns {Statusbar} New coin status bar instance
     * @description Factory method for creating coin status bars with default zero coins
     */
    static createCoinBar(x, y, canvas, assetManager, value = 0) {
        return new Statusbar(x, y, canvas, assetManager, 'coin', value);
    }
    
    /**
     * Creates a bottle counter status bar
     * @static
     * @param {number} x - X position on the canvas
     * @param {number} y - Y position on the canvas
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading images
     * @param {number} [value=0] - Initial bottle count (0-100)
     * @returns {Statusbar} New bottle status bar instance
     * @description Factory method for creating bottle status bars with default zero bottles
     */
    static createBottleBar(x, y, canvas, assetManager, value = 0) {
        return new Statusbar(x, y, canvas, assetManager, 'bottle', value);
    }
    
    /**
     * Creates an end boss health status bar
     * @static
     * @param {number} x - X position on the canvas
     * @param {number} y - Y position on the canvas
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading images
     * @param {number} [value=100] - Initial boss health value (0-100)
     * @returns {Statusbar} New end boss status bar instance
     * @description Factory method for creating end boss health bars with default full health
     */
    static createEndbossBar(x, y, canvas, assetManager, value = 100) {
        return new Statusbar(x, y, canvas, assetManager, 'endboss', value);
    }
    
    
    /**
     * Updates the displayed image based on current value
     * @description Calculates appropriate image frame index based on value and updates the displayed image
     * @private
     */
    updateImage() {
        const imageIndex = Math.floor(this.value / Statusbar.VALUE_STEP);
        const clampedIndex = Math.max(0, Math.min(Statusbar.MAX_INDEX, imageIndex));
        super.setImageByIndex(clampedIndex);
    }
    
    /**
     * Sets a new value for the status bar and updates the display
     * @param {number} newValue - New value to set (will be clamped to 0-100 range)
     * @description Updates the status bar value and automatically refreshes the displayed image
     */
    setValue(newValue) {
        this.value = Math.max(0, Math.min(100, newValue));
        this.updateImage();
    }
    
    /**
     * Value step size for image frame calculation
     * @static
     * @readonly
     * @returns {number} The step value (20)
     * @description Each image frame represents 20 points of value (0-19, 20-39, 40-59, 60-79, 80-99, 100)
     */
    static get VALUE_STEP() { return 20; } 
    
    /**
     * Maximum image index available
     * @static
     * @readonly
     * @returns {number} The maximum index (5)
     * @description Represents the highest image frame index available (6 total frames: 0-5)
     */
    static get MAX_INDEX() { return 5; }
}
