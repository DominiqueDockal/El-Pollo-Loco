/**
 * Checks if the current device supports touch functionality
 * @returns {boolean} true if the device supports touch, false otherwise
 */
function isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

/**
 * Detects mobile devices based on the User-Agent string
 * @returns {boolean} true if a mobile device is detected, false otherwise
 * @description Analyzes the User-Agent for typical mobile device identifiers
 */
function isMobileUA() {
    const ua = navigator.userAgent.toLowerCase();
    return /iphone|ipod|android.*mobile|windows.*phone|ipad|tablet|surface|touch/i.test(ua);
}

/**
 * Detects Surface devices or iPad Pro based on User-Agent and touch support
 * @returns {boolean} true if Surface or iPad Pro is detected, false otherwise
 * @description Combines User-Agent detection with touch capability check
 */
function isSurfaceOrIPadPro() {
    const ua = navigator.userAgent.toLowerCase();
    return /surface|ipad pro|macintosh.*safari/i.test(ua) && 'ontouchstart' in window;
}
 
/**
 * Checks if the current screen size should be classified as mobile/tablet
 * @returns {boolean} true if screen size is <= 1400px width or <= 900px height
 * @description Uses window dimensions for size determination
 */
function isMobileOrTabletSize() {
    return window.innerWidth <= 1400 || window.innerHeight <= 900;
}

/**
 * Updates the visibility of the device rotation overlay
 * @description Shows the overlay only on touch devices in portrait mode
 * @requires DOM element with ID 'rotate-device-overlay' must exist
 * @throws {TypeError} If the overlay element is not found
 */
function updateRotateOverlay() {
  const overlay = document.getElementById('rotate-device-overlay');
  if (isTouchDevice() && isMobileOrTabletSize() && isMobileUA() || isSurfaceOrIPadPro()) {
      if (window.matchMedia("(orientation: portrait)").matches) overlay.style.display = 'flex';
      else overlay.style.display = 'none';
  } else {
      overlay.style.display = 'none';
  }
}

/**
 * Updates all display-related settings
 * @description Central function for updating rotation overlay and canvas CSS variables
 */
function updateDisplaySettings() {
    updateRotateOverlay();
    updateCanvasCssVars();
}

// Event Listeners - Automatic updates on relevant changes
/**
 * Initializes display settings after DOM content is loaded
 * @event DOMContentLoaded
 */
window.addEventListener('DOMContentLoaded', updateDisplaySettings);
/**
 * Updates display settings when window is resized
 * @event resize
 */
window.addEventListener('resize', updateDisplaySettings);
/**
 * Updates display settings when device orientation changes
 * @event change - MediaQueryList orientation change
 */
window.matchMedia("(orientation: portrait)").addEventListener("change", updateDisplaySettings);
  