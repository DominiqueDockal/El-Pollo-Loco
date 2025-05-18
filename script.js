
function startGame() {
    document.getElementById('start_screen').classList.add('d-none');
    game = new Game();
}

function howToPlay() {
    document.getElementById('how_to_play').classList.remove('d-none');

}

function closeOverlay() {
    document.getElementById('how_to_play').classList.add('d-none');
}




// für die mobile ansicht Buttons einfügt, die hier ebenfalls abgefragt werden müssen über Element by ID


// Fullscreen Option
function fullscreen(){
    
}