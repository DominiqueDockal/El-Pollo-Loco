class AssetManager {
    constructor() {
        this.imageCache = new Map();
        this.isLoaded = false;
    }

    async loadAllAssets() {
        const assets = window.ASSETS || {};
        const loadPromises = [];
        Object.values(assets).forEach(assetArray => {
            if (Array.isArray(assetArray)) {
                assetArray.forEach(imgObj => {
                    const img = new Image();
                    const imagePath = imgObj.src || imgObj;
                    const loadPromise = new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = imagePath;
                    });
                    loadPromises.push(loadPromise);
                    this.imageCache.set(imagePath, img);
                });
            }
        });   
        await Promise.all(loadPromises);
        this.isLoaded = true;
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
}
