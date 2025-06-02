function startGame() {
    document.getElementById('start_screen').classList.add('d-none'); 
    document.getElementById('game_control_left').classList.remove('d-none'); 
    document.getElementById('game_control_right').classList.remove('d-none'); 
    let game = new Game('canvas');
}

function restartGame(){
    document.getElementById('end_screen').classList.add('d-none');
    document.getElementById('game_control_left').classList.remove('d-none'); 
    document.getElementById('game_control_right').classList.remove('d-none'); 
}

function quit() {
    document.getElementById('start_screen').classList.remove('d-none');
    document.getElementById('end_screen').classList.add('d-none');
    document.getElementById('game_control_left').classList.add('d-none'); 
    document.getElementById('game_control_right').classList.add('d-none'); 
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
    if (btn.disabled) return; // Zusätzliche Sicherheit
    
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
            soundBtn.disabled = window.game.isPaused;
            soundBtn.style.opacity = window.game.isPaused ? '0.5' : '1';
            soundBtn.style.cursor = window.game.isPaused ? 'not-allowed' : 'pointer';
        }
    }
    if (window.game.assetManager) {
        if (window.game.isPaused) {
            window.game.assetManager.stopBackgroundMusic();
        } else {
            window.game.assetManager.playBackgroundMusic();
        }
    }
}

  



  



