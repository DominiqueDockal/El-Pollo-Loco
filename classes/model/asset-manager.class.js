class AssetManager {
    constructor() {
        this.imageCache = new Map();
        this.soundCache = new Map();
        this.isLoaded = false;
        this.backgroundMusic = null;
        this.isSoundEnabled = false;
    }

    async loadAllAssets() {
        const assets = window.ASSETS || {};
        const loadPromises = [];
        Object.entries(assets).forEach(([key, assetArray]) => {
            if (Array.isArray(assetArray)) {
                assetArray.forEach(assetObj => {
                    if (key.startsWith('sounds_')) {
                        loadPromises.push(this.loadSound(assetObj));
                    } else {
                        loadPromises.push(this.loadImage(assetObj));
                    }
                });
            }
        });   
        await Promise.allSettled(loadPromises);
        this.isLoaded = true;
    }
    
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
            if (assetObj.name) {
                this.soundCache.set(assetObj.name, {audio: audio, volume: assetObj.volume || 1.0,loop: assetObj.loop || false});
            }
        } catch (error) {
            console.warn(`Failed to load sound: ${soundPath}`, error);
        }
    }
    
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
    
    getImage(imagePath) {
        return this.imageCache.get(imagePath);
    }

    getImagesByType(type) {
        const assets = window.ASSETS[type] || [];
        return assets.map(imgObj => {
            const path = imgObj.src || imgObj;
            return this.getImage(path);
        }).filter(img => img);
    }

    playSound(soundName) {
        if (!this.isSoundEnabled) return;
        const soundData = this.soundCache.get(soundName);
        if (soundData) {
            const audio = soundData.audio.cloneNode(true);
            audio.volume = soundData.volume;
            audio.loop = soundData.loop;
            audio.play().catch(error => {
                console.log('Sound play failed:', error);
            });
            return audio;
        } else {
            console.warn(`Sound '${soundName}' not found`);
        }
    }

    playBackgroundMusic() {
        if (this.isSoundEnabled) {
            const soundData = this.soundCache.get('background_music');
            if (soundData && !this.backgroundMusic) {
                this.backgroundMusic = soundData.audio.cloneNode(true);
                this.backgroundMusic.volume = soundData.volume;
                this.backgroundMusic.loop = soundData.loop;
                this.backgroundMusic.play().catch(error => {
                    console.log('Background music play failed:', error);
                });
            } else if (this.backgroundMusic && this.backgroundMusic.paused) {
                this.backgroundMusic.play();
            }
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
    }

    toggleSound() {
        this.isSoundEnabled = !this.isSoundEnabled;
        if (this.isSoundEnabled) {
            this.playBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
        return this.isSoundEnabled;
    }
}
