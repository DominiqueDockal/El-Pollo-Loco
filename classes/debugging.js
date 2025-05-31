function debugGameObjectDimensions(gameObject) {
    if (!gameObject) {
        console.log('❌ No GameObject provided');
        return;
    }
    
    console.log('🔍 GameObject Dimensions Debug:');
    console.log('================================');
    console.log(`Object Type: ${gameObject.constructor.name}`);
    console.log(`GameObject Type: ${gameObject.type}`);
    console.log('');
    
    // Original Canvas Dimensionen
    console.log('📐 Original Canvas Dimensions:');
    console.log(`originalCanvasWidth: ${gameObject.originalCanvasWidth}`);
    console.log(`originalCanvasHeight: ${gameObject.originalCanvasHeight}`);
    console.log('');
    
    // Aktuelle Canvas Dimensionen
    console.log('📐 Current Canvas Dimensions:');
    console.log(`canvas.width: ${gameObject.canvas.width}`);
    console.log(`canvas.height: ${gameObject.canvas.height}`);
    console.log(`canvas.clientWidth: ${gameObject.canvas.clientWidth}`);
    console.log(`canvas.clientHeight: ${gameObject.canvas.clientHeight}`);
    console.log('');
    
    // GameObject Dimensionen
    console.log('📦 GameObject Dimensions:');
    console.log(`width: ${gameObject.width}`);
    console.log(`height: ${gameObject.height}`);
    console.log(`aspectRatio: ${gameObject.aspectRatio}`);
    console.log(`scale: ${gameObject.scale}`);
    console.log('');
    
    // Natural Dimensionen (falls vorhanden)
    if (gameObject.naturalWidth || gameObject.naturalHeight) {
        console.log('🖼️ Natural Asset Dimensions:');
        console.log(`naturalWidth: ${gameObject.naturalWidth}`);
        console.log(`naturalHeight: ${gameObject.naturalHeight}`);
        console.log('');
    }
    
    // Berechnete Skalierungsfaktoren
    console.log('📊 Scale Factors:');
    const scaleX = gameObject.canvas.width / gameObject.originalCanvasWidth;
    const scaleY = gameObject.canvas.height / gameObject.originalCanvasHeight;
    console.log(`scaleX: ${scaleX}`);
    console.log(`scaleY: ${scaleY}`);
    console.log('');
    
    // Positionen
    console.log('📍 Positions:');
    console.log(`originalX: ${gameObject.originalX}`);
    console.log(`originalY: ${gameObject.originalY}`);
    console.log(`current x: ${gameObject.x}`);
    console.log(`current y: ${gameObject.y}`);
    console.log('================================');
}


function debugCanvasResizeSystem() {
    console.log('🎯 Canvas Resize System Debug:');
    console.log('=====================================');
    
    // Basis-Konstanten
    console.log('📏 Base Constants:');
    console.log(`BASE_CANVAS_WIDTH: ${BASE_CANVAS_WIDTH}`);
    console.log(`BASE_CANVAS_HEIGHT: ${BASE_CANVAS_HEIGHT}`);
    console.log('');
    
    // Viewport-Dimensionen
    console.log('🖥️ Viewport Dimensions:');
    console.log(`window.innerWidth: ${window.innerWidth}`);
    console.log(`window.innerHeight: ${window.innerHeight}`);
    console.log('');
    
    // getTargetSize() Ergebnis
    const [targetWidth, targetHeight] = getTargetSize(BASE_CANVAS_WIDTH, BASE_CANVAS_HEIGHT);
    console.log('🎯 Target Size (from getTargetSize):');
    console.log(`targetWidth: ${targetWidth}`);
    console.log(`targetHeight: ${targetHeight}`);
    console.log('');
    
    // calculateCanvasSize() Berechnungen
    console.log('🧮 Canvas Size Calculations:');
    const maxViewportWidth = window.innerWidth;
    const maxViewportHeight = window.innerHeight;
    const scaleX = maxViewportWidth / BASE_CANVAS_WIDTH;
    const scaleY = maxViewportHeight / BASE_CANVAS_HEIGHT;
    const finalScale = Math.min(scaleX, scaleY);
    
    console.log(`maxViewportWidth: ${maxViewportWidth}`);
    console.log(`maxViewportHeight: ${maxViewportHeight}`);
    console.log(`scaleX (viewport/base): ${scaleX.toFixed(4)}`);
    console.log(`scaleY (viewport/base): ${scaleY.toFixed(4)}`);
    console.log(`finalScale (min of both): ${finalScale.toFixed(4)}`);
    console.log(`scale < 1: ${finalScale < 1}`);
    
    const { width, height } = calculateCanvasSize();
    console.log(`calculated width: ${width}`);
    console.log(`calculated height: ${height}`);
    console.log('');
    
    // Aktuelle Canvas-Dimensionen
    const canvas = document.getElementById('canvas');
    const canvasWrapper = document.querySelector('.canvas-wrapper');
    
    if (canvas) {
        console.log('🖼️ Current Canvas Dimensions:');
        console.log(`canvas.width (internal): ${canvas.width}`);
        console.log(`canvas.height (internal): ${canvas.height}`);
        console.log(`canvas.style.width (CSS): ${canvas.style.width}`);
        console.log(`canvas.style.height (CSS): ${canvas.style.height}`);
        console.log(`canvas.clientWidth (displayed): ${canvas.clientWidth}`);
        console.log(`canvas.clientHeight (displayed): ${canvas.clientHeight}`);
        console.log('');
    }
    
    if (canvasWrapper) {
        console.log('📦 Canvas Wrapper Dimensions:');
        console.log(`wrapper.style.width: ${canvasWrapper.style.width}`);
        console.log(`wrapper.style.height: ${canvasWrapper.style.height}`);
        console.log(`wrapper.clientWidth: ${canvasWrapper.clientWidth}`);
        console.log(`wrapper.clientHeight: ${canvasWrapper.clientHeight}`);
        console.log('');
    }
    
    // CSS-Variablen
    const rootStyles = getComputedStyle(document.documentElement);
    const cssCanvasWidth = rootStyles.getPropertyValue('--canvas-width');
    const cssCanvasHeight = rootStyles.getPropertyValue('--canvas-height');
    
    console.log('🎨 CSS Variables:');
    console.log(`--canvas-width: ${cssCanvasWidth}`);
    console.log(`--canvas-height: ${cssCanvasHeight}`);
    console.log('');
    
    // Skalierungsfaktoren für GameObjects
    if (canvas) {
        console.log('📊 GameObject Scale Factors:');
        const gameObjectScaleX = canvas.width / BASE_CANVAS_WIDTH;
        const gameObjectScaleY = canvas.height / BASE_CANVAS_HEIGHT;
        console.log(`GameObject scaleX: ${gameObjectScaleX.toFixed(4)}`);
        console.log(`GameObject scaleY: ${gameObjectScaleY.toFixed(4)}`);
        console.log('');
    }
    
    // Zusammenfassung
    console.log('📋 Summary:');
    console.log(`Original Canvas: ${BASE_CANVAS_WIDTH}x${BASE_CANVAS_HEIGHT}`);
    console.log(`Viewport: ${window.innerWidth}x${window.innerHeight}`);
    console.log(`Final Canvas: ${width}x${height}`);
    console.log(`Scale Factor: ${finalScale.toFixed(4)}`);
    console.log(`Scaling Applied: ${finalScale < 1 ? 'YES' : 'NO'}`);
    console.log('=====================================');
}
