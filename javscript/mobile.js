function isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }
  
function isMobileUA() {
    const ua = navigator.userAgent.toLowerCase();
    return /iphone|ipod|android.*mobile|windows.*phone|ipad|tablet|surface|touch/i.test(ua);
}

function isSurfaceOrIPadPro() {
    const ua = navigator.userAgent.toLowerCase();
    return /surface|ipad pro|macintosh.*safari/i.test(ua) && 'ontouchstart' in window;
}
 
function isMobileOrTabletSize() {
    return window.innerWidth <= 1400 || window.innerHeight <= 900;
}
  
function updateRotateOverlay() {
    const overlay = document.getElementById('rotate-device-overlay');
    if (isTouchDevice() && isMobileOrTabletSize() && isMobileUA() || isSurfaceOrIPadPro()) {
      if (window.matchMedia("(orientation: portrait)").matches) {
        overlay.style.display = 'flex';
      } else {
        overlay.style.display = 'none';
      }
    } else {
      overlay.style.display = 'none';
    }
}
function updateDisplaySettings() {
    updateRotateOverlay();
    updateCanvasCssVars();
}

window.addEventListener('DOMContentLoaded', updateDisplaySettings);
window.addEventListener('resize', updateDisplaySettings);
window.matchMedia("(orientation: portrait)").addEventListener("change", updateDisplaySettings);
  