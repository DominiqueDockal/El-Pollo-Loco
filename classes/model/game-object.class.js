/**
 * Abstract base class for game objects in the game
 * @abstract
 * @class GameObject
 * @description Provides basic properties and methods for game objects including position, dimensions, image management, and scaling
 * @throws {TypeError} Throws error when attempting to instantiate directly
 */
class GameObject {
    /**
     * Creates a new GameObject instance
     * @constructor
     * @param {number} x - Initial X position on the canvas
     * @param {number} y - Initial Y position on the canvas
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {AssetManager} assetManager - Asset manager for loading assets
     * @param {string} [assetType='default'] - Type of asset to load
     * @throws {TypeError} Throws error if instantiated directly
     * @description Initializes position, dimensions, asset references, and scaling properties
     */
    constructor(x, y, canvas, assetManager, assetType = 'default') {
        if (new.target === GameObject) throw new TypeError('Cannot instantiate abstract class GameObject directly');
        
        this.originalX = x;
        this.originalY = y;
        this.originalCanvasWidth = canvas.width;
        this.originalCanvasHeight = canvas.height; 
        this.x = x;
        this.y = y;
        this.height = 0;
        this.width = 0;
        this.naturalWidth = 0;
        this.naturalHeight = 0;
        this.aspectRatio = 0;
        this.type = assetType;
        this.currentImagePath = null;
        this.canvas = canvas;
        this.assetManager = assetManager; 
        this.otherDirection = false;
        this.isFixed = false;
        this.scale = 1;
        this.setNaturalDimensions();
        this.currentImageIndex = 0;
    }
    
    /**
     * Sets the natural dimensions and aspect ratio based on asset metadata
     * @description Retrieves asset metadata from asset manager and calculates natural dimensions and aspect ratio
     * @requires AssetManager with getAssetsMetadata method
     */
    setNaturalDimensions() {
        const assets = this.assetManager.getAssetsMetadata(this.type);
        if (assets.length > 0) {
            const firstAsset = assets[0];
            this.naturalWidth = firstAsset.width;
            this.naturalHeight = firstAsset.height;
            this.aspectRatio = this.naturalWidth / this.naturalHeight;
        }
    }
    
    /**
     * Sets the dimensions of the object based on a scale factor and canvas height
     * @param {number} scale - Scale factor relative to canvas height
     * @description Calculates height and width maintaining aspect ratio based on canvas height
     */
    setDimensions(scale) {
        this.height = scale * this.canvas.clientHeight;
        this.width =Math.ceil(this.height * this.aspectRatio);
    } 
    
    /**
     * Updates the object's position and dimensions based on canvas resizing
     * @description Scales position according to canvas size changes and updates dimensions if scale is set
     */
    updateDimensions() {
        const scaleX = this.canvas.width / this.originalCanvasWidth;
        const scaleY = this.canvas.height / this.originalCanvasHeight;
        this.x = this.originalX * scaleX;
        this.y = this.originalY * scaleY;
        if (this.scale && typeof this.setDimensions === 'function') this.setDimensions(this.scale);
    } 
    
    /**
     * Gets the current image object for rendering
     * @returns {HTMLImageElement|null} The image object or null if no image is set
     * @description Returns the current image element from asset manager or null
     */
    get img() {
        return this.currentImagePath ? this.getImage(this.currentImagePath) : null;
    }
    
    /**
     * Retrieves an image object from the asset manager by image path
     * @param {string} imagePath - Path to the image asset
     * @returns {HTMLImageElement} The image object from asset manager
     * @description Gets image element from asset manager using provided path
     */
    getImage(imagePath) {
        return this.assetManager.getImage(imagePath);
    }
    
    /**
     * Sets the current image path for the object
     * @param {string} imagePath - Path to the image asset
     * @description Updates the current image path used for rendering
     */
    setImage(imagePath) {
        this.currentImagePath = imagePath;
    }
    
    /**
     * Sets the current image by index from the asset manager
     * @param {number} [index=this.currentImageIndex] - Index of the asset image
     * @param {string} [assetType=this.type] - Asset type to select from
     * @description Sets image using asset index, defaults to current index and type
     */
    setImageByIndex(index = this.currentImageIndex, assetType = this.type) {
        const asset = this.assetManager.getAssetByIndex(assetType, index);
        if (asset?.src) this.setImage(asset.src);
    }
    

}


