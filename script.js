let gameInstance= null;

function startGame() {
    document.getElementById('start_screen').classList.add('d-none'); 
    document.getElementById('end_screen').classList.add('d-none'); 
    document.getElementById('game_control_left').classList.remove('d-none'); 
    document.getElementById('game_control_right').classList.remove('d-none'); 
    document.getElementById('sound_btn').classList.remove('sound-on');
    if (gameInstance) {
        gameInstance = null;
    }
    gameInstance = new Game('canvas');
}

function quit(){
    game.quit();

}

function restartGame(){
    startGame();

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
    if (btn.disabled) return; 
    btn.classList.toggle('sound-on');
    toggleGameSound();
}

function toggleGameSound() {
    if (window.game && window.game.assetManager) {
        if (window.game.isPaused) {
            return window.game.assetManager.isSoundEnabled; 
        }
        const soundEnabled = window.game.assetManager.toggleSound();
        return soundEnabled;
    }
    return false;
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
    toggleGamePause();
}

function toggleGamePause() {
    if (window.game) {
        window.game.isPaused = !window.game.isPaused;
        const soundBtn = document.getElementById('sound_btn');
        if (soundBtn) {
            soundBtn.classList.toggle('disabled', window.game.isPaused);
            soundBtn.disabled = window.game.isPaused;
        }
    } 
    if (window.game.assetManager) {
        if (window.game.isPaused) {
            window.game.assetManager.stopBackgroundMusic();
            window.game.assetManager.stopAllSounds();
        } else {
            setTimeout(() => {
                window.game.assetManager.playBackgroundMusic();
            }, 100);
            
        }
    }
}




  



  



