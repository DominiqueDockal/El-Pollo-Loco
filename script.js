function startGame() {
    document.getElementById('start_screen').classList.add('d-none');
    
}

function howToPlay() {
    document.getElementById('how_to_play').classList.remove('d-none');

}

function closeHowToPlayOverlay() {
    document.getElementById('how_to_play').classList.add('d-none');
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

function checkWindowSize() {
    const minWidth = 720;
    const minHeight = 480;
    if (window.innerWidth < minWidth || window.innerHeight < minHeight) {
        alert(`Please enlarge your browser window to at least ${minWidth}x${minHeight} pixels for the best experience.`);
    }
}
window.addEventListener('DOMContentLoaded', checkWindowSize);
window.addEventListener('resize', checkWindowSize); 















// für die mobile ansicht Buttons einfügt, die hier ebenfalls abgefragt werden müssen über Element by ID
// überschrift weg


