function startGame() {
    document.getElementById('start_screen').classList.add('d-none'); 
    document.getElementById('game_control_left').classList.remove('d-none'); 

    document.getElementById('game_control_right').classList.remove('d-none'); 

    document.getElementById('button_left').classList.remove('d-none'); 
    document.getElementById('button_right').classList.remove('d-none'); 
    document.getElementById('button_jump').classList.remove('d-none'); 
    document.getElementById('button_throw').classList.remove('d-none'); 
}

function isAnyMobileDevice() {
    return isTouchDevice() || isMobileUA() || isSurfaceOrIPadPro() || isMobileOrTabletSize();
}

function startScreen() {
    document.getElementById('start_screen').classList.remove('d-none');
    document.getElementById('end_screen').classList.add('d-none');
}

function toggleHowToPlayOverlay(show) {
    const overlay = document.getElementById('how_to_play');
    if (!overlay) return;
    if (typeof show === 'boolean') {
        overlay.classList.toggle('d-none', !show);
    } else {
        overlay.classList.toggle('d-none');
    }
}

function howToPlayOverlay(event) {
    toggleHowToPlayOverlay(true);
    if (event) event.stopPropagation(); 
}

function closeHowToPlayOverlay() {
    toggleHowToPlayOverlay(false);
}

function toggleSoundIcon(btn) {
    btn.classList.toggle('sound-off');
}

function togglePlayPause() {
    const pauseIcon = document.querySelector('.pause-icon');
    const playIcon = document.querySelector('.play-icon');
    if (pauseIcon.style.display === 'none') {
      pauseIcon.style.display = 'inline-block';
      playIcon.style.display = 'none';
    } else {
      pauseIcon.style.display = 'none';
      playIcon.style.display = 'inline-block';
    }
}
  
function updateCanvasCssVars() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const width = canvas.width;   
    const height = canvas.height; 
    document.documentElement.style.setProperty('--canvas-width', width + 'px');
    document.documentElement.style.setProperty('--canvas-height', height + 'px');
}
updateCanvasCssVars(); 

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
  
window.addEventListener('DOMContentLoaded', updateRotateOverlay);
window.addEventListener('resize', updateRotateOverlay);
window.matchMedia("(orientation: portrait)").addEventListener("change", updateRotateOverlay);
  
  



