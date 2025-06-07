/**
 * Asset manager for loading and managing game images and sounds
 * @class AssetManager
 * @description Handles loading, caching, and playback of game assets including images, sounds, and background music
 */
class AssetManager {
     /**
     * Creates a new AssetManager instance
     * @constructor
     * @description Initializes image and sound caches, loading state, and audio management properties
     */
     cons
    constructor() {
        this.imageCache = new Map();
        this.soundCache = new Map();
        this.isLoaded = false;
        this.backgroundMusic = null;
        this.isSoundEnabled = false;
        this.activeSounds = new Map(); 
    }
    
    /**
     * Loads all assets from the global ASSETS configuration
     * @async
     * @description Loads all images and sounds defined in window.ASSETS, handles loading failures gracefully
     * @requires window.ASSETS object with asset definitions
     */
    async loadAllAssets() {
        const assets = window.ASSETS || {};
        const loadPromises = [];
        Object.entries(assets).forEach(([key, assetArray]) => {
            if (Array.isArray(assetArray)) {
                assetArray.forEach(assetObj => {
                    if (key.startsWith('sounds_')) loadPromises.push(this.loadSound(assetObj));
                    else loadPromises.push(this.loadImage(assetObj));
                });
            }
        });   
        await Promise.allSettled(loadPromises);
        this.isLoaded = true;
    }
    
    /**
     * Loads a single sound asset
     * @async
     * @param {Object} assetObj - Sound asset configuration object
     * @param {string} assetObj.src - Path to the sound file
     * @param {string} [assetObj.name] - Name identifier for the sound
     * @param {number} [assetObj.volume=1.0] - Volume level (0.0-1.0)
     * @param {boolean} [assetObj.loop=false] - Whether the sound should loop
     * @description Loads audio file and stores in sound cache with metadata
     */
    async loadSound(assetObj) {
        const audio = new Audio();
        const soundPath = assetObj.src;
        try {
            await new Promise((resolve, reject) => {
                audio.oncanplaythrough = resolve;
                audio.onerror = reject;
                audio.src = soundPath;
                audio.preload = 'auto';
            });
            if (assetObj.name) this.soundCache.set(assetObj.name, {audio: audio, volume: assetObj.volume || 1.0,loop: assetObj.loop || false});
        } catch (error) {
            console.warn(`Failed to load sound: ${soundPath}`, error);
        }
    }
    
    /**
     * Loads a single image asset
     * @async
     * @param {Object|string} assetObj - Image asset configuration object or direct path
     * @param {string} [assetObj.src] - Path to the image file
     * @description Loads image file and stores in image cache
     */
    async loadImage(assetObj) {
        const img = new Image();
        const imagePath = assetObj.src || assetObj;
        try {
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = imagePath;
            });
            this.imageCache.set(imagePath, img);
        } catch (error) {
            console.warn(`Failed to load image: ${imagePath}`, error);
        }
    }
    
    /**
     * Gets metadata for assets of a specific type
     * @param {string} type - Asset type identifier
     * @returns {Array} Array of asset metadata objects
     * @description Retrieves asset configuration array from global ASSETS object
     */
    getAssetsMetadata(type) {
        return window.ASSETS[type] || [];
    }

    /**
     * Gets the count of assets for a specific type
     * @param {string} type - Asset type identifier
     * @returns {number} Number of assets of the specified type
     * @description Returns the number of assets available for the given type
     */
    getAssetCount(type) {
        return this.getAssetsMetadata(type).length;
    }
    
     /**
     * Gets a specific asset by type and index
     * @param {string} type - Asset type identifier
     * @param {number} index - Index of the asset within the type
     * @returns {Object|null} Asset metadata object or null if not found
     * @description Retrieves specific asset configuration by index
     */
    getAssetByIndex(type, index) {
        const assets = this.getAssetsMetadata(type);
        return assets[index] || null;
    }
    
     /**
     * Gets all image paths for a specific asset type
     * @param {string} type - Asset type identifier
     * @returns {string[]} Array of image file paths
     * @description Extracts source paths from asset metadata for the given type
     */
    getImagePathsByType(type) {
        const assets = this.getAssetsMetadata(type);
        return assets.map(imgObj => imgObj.src);
    }
    
    /**
     * Gets a loaded image by file path
     * @param {string} imagePath - Path to the image file
     * @returns {HTMLImageElement|undefined} The loaded image element or undefined
     * @description Retrieves cached image element by file path
     */
    getImage(imagePath) {
        return this.imageCache.get(imagePath);
    }
    
    /**
     * Gets all loaded images for a specific asset type
     * @param {string} type - Asset type identifier
     * @returns {HTMLImageElement[]} Array of loaded image elements
     * @description Retrieves all cached images for the specified asset type
     */
    getImagesByType(type) {
    const assets = this.getAssetsMetadata(type);
    return assets.map(imgObj => this.getImage(imgObj.src)).filter(img => img);
    }
    
    /**
     * Plays a sound effect
     * @param {string} soundName - Name of the sound to play
     * @returns {HTMLAudioElement|undefined} The audio element or undefined if sound disabled/not found
     * @description Plays sound if enabled, manages active sound instances for cleanup
     */
    playSound(soundName) {
        if (!this.isSoundEnabled) return;
        const soundData = this.soundCache.get(soundName);
        if (soundData) {
            const audio = soundData.audio.cloneNode(true);
            audio.volume = soundData.volume;
            audio.loop = soundData.loop;
            audio.play().catch(error => {if (error.name !== 'AbortError') console.error('Sound play failed:', error);});
            if (!this.activeSounds.has(soundName)) this.activeSounds.set(soundName, []);
            this.activeSounds.get(soundName).push(audio);
            audio.addEventListener('ended', () => {
                const sounds = this.activeSounds.get(soundName);
                if (sounds) {
                    const index = sounds.indexOf(audio);
                    if (index > -1) sounds.splice(index, 1);
                }
            });
            return audio;
        }
    }
    
    /**
     * Plays or resumes background music
     * @description Starts background music if enabled and not already playing, or resumes if paused
     * @requires Sound named 'background_music' to be loaded
     */
    playBackgroundMusic() {
        if (this.isSoundEnabled) {
            const soundData = this.soundCache.get('background_music');
            if (soundData && !this.backgroundMusic) {
                this.backgroundMusic = soundData.audio.cloneNode(true);
                this.backgroundMusic.volume = soundData.volume;
                this.backgroundMusic.loop = soundData.loop;
                this.backgroundMusic.play().catch(error => {console.log('Background music play failed:', error);});
            } else if (this.backgroundMusic && this.backgroundMusic.paused) {
                this.backgroundMusic.play().catch(error => {if (error.name !== 'AbortError') console.log('Background music play failed:', error);});
            }
        }
    }
    
    /**
     * Stops/pauses the background music
     * @description Pauses the currently playing background music
     */
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
    }
    
    /**
     * Toggles sound on/off for the entire application
     * @returns {boolean} The new sound enabled state
     * @description Enables or disables all sound playback, manages background music accordingly
     */
    toggleSound() {
        this.isSoundEnabled = !this.isSoundEnabled;
        if (this.isSoundEnabled) this.playBackgroundMusic();
        else this.stopBackgroundMusic();
        return this.isSoundEnabled;
    }
    
    /**
     * Stops all instances of a specific sound
     * @param {string} soundName - Name of the sound to stop
     * @description Pauses and resets all active instances of the specified sound
     */
    stopSound(soundName) {
        const sounds = this.activeSounds.get(soundName) || [];
        sounds.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.activeSounds.set(soundName, []);
    }
    
    /**
     * Stops all currently playing sounds
     * @description Pauses and resets all active sound instances, clears active sounds tracking
     */
    stopAllSounds() {
        for (const [name, sounds] of this.activeSounds) {
            sounds.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        }
        this.activeSounds.clear();
    }
}


