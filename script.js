let gameInstance= null;

/**
 * Starts a new game instance and manages UI state transitions
 * @async
 * @description Initializes game UI, creates new Game instance, and handles loading states
 * @requires DOM elements with IDs: 'start_screen', 'loading_screen', 'end_screen', 'game_control_left', 'game_control_right'
 * @throws {Error} Logs initialization errors to console
 */
async function startGame() {
    document.getElementById('start_screen').classList.add('d-none');
    document.getElementById('loading_screen').classList.remove('d-none');
    document.getElementById('end_screen').classList.add('d-none');
    document.getElementById('game_control_left').classList.add('d-none'); 
    document.getElementById('game_control_right').classList.add('d-none');
    if (gameInstance) gameInstance = null;
    gameInstance = new Game('canvas');
    try {
        await gameInstance.init(); 
    } catch (error) {
        console.error("Could initalize Game", error);

    } finally {
        document.getElementById('loading_screen').classList.add('d-none');
        document.getElementById('game_control_left').classList.remove('d-none');
        document.getElementById('game_control_right').classList.remove('d-none');
    }
}
    
/**
 * Quits the current game and returns to start screen
 * @description Calls game quit method and resets UI to initial state
 * @requires Global 'game' object with quit() method
 * @requires DOM elements with IDs: 'game_control_left', 'game_control_right', 'end_screen', 'start_screen'
 */
function quit(){
    game.quit();
    document.getElementById('game_control_left').classList.add('d-none'); 
    document.getElementById('game_control_right').classList.add('d-none'); 
    document.getElementById('end_screen').classList.add('d-none');
    document.getElementById('start_screen').classList.remove('d-none');
}

/**
 * Restarts the current game
 * @description Wrapper function that calls startGame() to restart
 */
function restartGame(){
    startGame();

}

/**
 * Toggles the visibility of the how-to-play overlay
 * @param {boolean} [show] - Optional parameter to explicitly show (true) or hide (false) the overlay
 * @description If show parameter is not provided, toggles current visibility state
 * @requires DOM element with ID 'how_to_play'
 */
function toggleHowToPlayOverlay(show) {
    const overlay = document.getElementById('how_to_play');
    if (!overlay) return;
    if (typeof show === 'boolean') overlay.classList.toggle('d-none', !show);
    else overlay.classList.toggle('d-none');
}

/**
 * Shows the how-to-play overlay and prevents event propagation
 * @param {Event} [event] - Optional event object to stop propagation
 * @description Always shows the overlay and stops event bubbling if event is provided
 */
function howToPlayOverlay(event) {
    toggleHowToPlayOverlay(true);
    if (event) event.stopPropagation(); 
}

/**
 * Closes the how-to-play overlay
 * @description Wrapper function that hides the how-to-play overlay
 */
function closeHowToPlayOverlay() {
    toggleHowToPlayOverlay(false);
}

/**
 * Toggles the visual state of the sound button and game sound
 * @param {HTMLElement} btn - The sound button element to toggle
 * @description Updates button appearance and calls sound toggle function
 */
function toggleSoundIcon(btn) {
    if (btn.disabled) return; 
    btn.classList.toggle('sound-on');
    toggleGameSound();
}

/**
 * Toggles the game sound on/off through the asset manager
 * @returns {boolean} Current sound enabled state, false if game not available
 * @description Manages game sound state while respecting pause state
 * @requires window.game.assetManager to exist
 */
function toggleGameSound() {
    if (window.game && window.game.assetManager) {
        if (window.game.isPaused) return window.game.assetManager.isSoundEnabled; 
        const soundEnabled = window.game.assetManager.toggleSound();
        return soundEnabled;
    }
    return false;
}

/**
 * Toggles between play and pause icons and game pause state
 * @description Switches visibility of pause/play icons and calls game pause toggle
 * @requires DOM elements with classes '.pause-icon' and '.play-icon'
 */
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

/**
 * Updates the sound button state based on game pause status
 * @param {boolean} isPaused - Whether the game is currently paused
 * @description Disables sound button during pause and adds visual disabled styling
 */
function updateSoundButtonState(isPaused) {
    const soundBtn = document.getElementById('sound_btn');
    if (soundBtn) {
        soundBtn.classList.toggle('disabled', isPaused);
        soundBtn.disabled = isPaused;
    }
}

/**
 * Updates the character's last active time to current timestamp
 * @description Finds the Character instance in current level and updates timing
 * @requires window.game.currentLevel.gameObjects array with Character instances
 */
function updateCharacterActiveTime() {
    if (!window.game?.currentLevel?.gameObjects) return;
    const character = window.game.currentLevel.gameObjects.find(obj => obj instanceof Character);
    if (character) {
        character.lastActiveTime = Date.now();
    }
}

/**
 * Manages audio playback based on pause state
 * @param {boolean} isPaused - Whether the game is currently paused
 * @description Stops all audio when paused, resumes background music when unpaused
 * @requires window.game.assetManager with audio control methods
 */
function manageGameAudio(isPaused) {
    if (!window.game?.assetManager) return;
    if (isPaused) {
        window.game.assetManager.stopBackgroundMusic();
        window.game.assetManager.stopAllSounds();
    } else {
        setTimeout(() => {
            window.game.assetManager.playBackgroundMusic();
        }, 100);
    }
}

/**
 * Toggles the game pause state and manages related UI and audio
 * @description Main pause toggle function that coordinates all pause-related updates
 * @requires window.game object with isPaused property
 */
function toggleGamePause() {
    if (!window.game) return;
    window.game.isPaused = !window.game.isPaused;
    updateSoundButtonState(window.game.isPaused);
    updateCharacterActiveTime();
    manageGameAudio(window.game.isPaused);
}




  



  



