// DOM Elements
const countdownElement = document.getElementById('countdown');
const countdownNumber = document.getElementById('countdown-number');
const startButton = document.getElementById('start-btn');
const instructions = document.getElementById('instructions');
const feedback = document.getElementById('feedback');
const feedbackText = document.getElementById('feedback-text');
const reactionTimeElement = document.getElementById('reaction-time');
const bestTimeElement = document.getElementById('best-time');
const averageTimeElement = document.getElementById('average-time');
const attemptsElement = document.getElementById('attempts');
const gameStatusElement = document.getElementById('game-status');
const historyList = document.getElementById('history-list');

// Game state
let countdown = 5;
let countdownInterval;
let gameStarted = false;
let waitingForClick = false;
let startTime;
let endTime;
let bestTime = null;
let attempts = 0;
let reactionTimes = [];
let totalReactionTime = 0;

// Initialize
updateUI();

// Event Listeners
startButton.addEventListener('click', startGame);
countdownElement.addEventListener('click', handleCountdownClick);

function startGame() {
    if (gameStarted) return;
    
    resetGame();
    gameStarted = true;
    waitingForClick = false;
    
    // Update UI
    startButton.disabled = true;
    countdownElement.classList.remove('ready', 'go');
    countdownElement.style.cursor = 'default';
    feedbackText.textContent = 'Get ready... Countdown starting!';
    gameStatusElement.textContent = 'Counting...';
    gameStatusElement.style.color = '#FFA500';
    
    // Start countdown
    countdown = 5;
    countdownNumber.textContent = countdown;
    
    countdownInterval = setInterval(() => {
        countdown--;
        countdownNumber.textContent = countdown;
        
        // Visual feedback
        if (countdown === 0) {
            countdownElement.classList.add('go');
            countdownElement.style.cursor = 'pointer';
            feedbackText.textContent = 'NOW! Click the number!';
            waitingForClick = true;
            startTime = Date.now();
            gameStatusElement.textContent = 'Click Now!';
            gameStatusElement.style.color = '#ff4757';
        } else if (countdown <= 2) {
            countdownElement.classList.add('ready');
            feedbackText.textContent = `Almost there... ${countdown}`;
            gameStatusElement.textContent = `Get ready... ${countdown}`;
        } else {
            feedbackText.textContent = `Countdown: ${countdown}`;
        }
        
        if (countdown < 0) {
            clearInterval(countdownInterval);
            if (!waitingForClick) {
                feedbackText.textContent = 'Too slow! The number passed 0. Try again.';
                gameStatusElement.textContent = 'Missed';
                gameStatusElement.style.color = '#ff4757';
                resetGameState();
            }
        }
    }, 1000);
}

function handleCountdownClick() {
    if (!waitingForClick) return;
    
    endTime = Date.now();
    const reactionTime = endTime - startTime;
    
    // Update results
    attempts++;
    attemptsElement.textContent = attempts;
    reactionTimeElement.textContent = `${reactionTime}ms`;
    
    // Add to history
    reactionTimes.push(reactionTime);
    totalReactionTime += reactionTime;
    
    // Update history list
    updateHistory(reactionTime);
    
    // Update best time
    if (bestTime === null || reactionTime < bestTime) {
        bestTime = reactionTime;
        bestTimeElement.textContent = `${bestTime}ms`;
    }
    
    // Calculate average
    const averageTime = Math.round(totalReactionTime / reactionTimes.length);
    averageTimeElement.textContent = `${averageTime}ms`;
    
    // Provide feedback based on reaction time
    let feedbackMessage;
    let feedbackColor;
    
    if (reactionTime < 180) {
        feedbackMessage = '⚡ Superhuman speed! Are you a robot?';
        feedbackColor = '#00FFFF';
    } else if (reactionTime < 250) {
        feedbackMessage = '🚀 Excellent! Lightning fast reflexes!';
        feedbackColor = '#4CAF50';
    } else if (reactionTime < 350) {
        feedbackMessage = '👍 Great job! Faster than average!';
        feedbackColor = '#8BC34A';
    } else if (reactionTime < 450) {
        feedbackMessage = '👌 Good reaction time!';
        feedbackColor = '#FFC107';
    } else if (reactionTime < 600) {
        feedbackMessage = '💤 A bit slow... Try to focus more!';
        feedbackColor = '#FF9800';
    } else {
        feedbackMessage = '🐌 Too slow! Were you distracted?';
        feedbackColor = '#FF5722';
    }
    
    feedbackText.textContent = feedbackMessage;
    feedbackText.style.color = feedbackColor;
    
    // Reset for next round
    waitingForClick = false;
    startButton.disabled = false;
    gameStarted = false;
    countdownElement.classList.remove('go');
    countdownElement.style.cursor = 'default';
    gameStatusElement.textContent = 'Ready';
    gameStatusElement.style.color = '#4CAF50';
    
    // Auto-reset after 3 seconds
    setTimeout(() => {
        if (!gameStarted) {
            resetGame();
            feedbackText.textContent = 'Press "Start Test" to play again!';
            feedbackText.style.color = '';
        }
    }, 3000);
}

function updateHistory(reactionTime) {
    // Remove empty message if it exists
    const emptyMsg = historyList.querySelector('.history-empty');
    if (emptyMsg) {
        emptyMsg.remove();
    }
    
    // Create history item
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const attemptNumber = document.createElement('div');
    attemptNumber.className = 'history-time';
    attemptNumber.textContent = `Attempt ${attempts}`;
    
    const timeDisplay = document.createElement('div');
    timeDisplay.className = 'history-ms';
    timeDisplay.textContent = `${reactionTime}ms`;
    
    historyItem.appendChild(attemptNumber);
    historyItem.appendChild(timeDisplay);
    
    // Add to top of list
    historyList.insertBefore(historyItem, historyList.firstChild);
    
    // Limit to 5 items
    if (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastChild);
    }
}

function resetGame() {
    clearInterval(countdownInterval);
    countdown = 5;
    countdownNumber.textContent = countdown;
    countdownElement.classList.remove('ready', 'go');
    countdownElement.style.cursor = 'pointer';
    startButton.disabled = false;
    gameStarted = false;
    waitingForClick = false;
    gameStatusElement.textContent = 'Ready';
    gameStatusElement.style.color = '#4CAF50';
}

function resetGameState() {
    gameStarted = false;
    waitingForClick = false;
    startButton.disabled = false;
    countdownElement.classList.remove('ready', 'go');
    countdownElement.style.cursor = 'pointer';
    gameStatusElement.textContent = 'Ready';
    gameStatusElement.style.color = '#4CAF50';
}

function updateUI() {
    // Initial UI state
    startButton.disabled = false;
    countdownNumber.textContent = countdown;
    countdownElement.style.cursor = 'pointer';
    
    // Set initial text content
    reactionTimeElement.textContent = '-- ms';
    bestTimeElement.textContent = '-- ms';
    averageTimeElement.textContent = '-- ms';
    attemptsElement.textContent = '0';
    gameStatusElement.textContent = 'Ready';
    gameStatusElement.style.color = '#4CAF50';
    feedbackText.textContent = 'Press "Start Test" to begin the reaction speed test!';
}

// Add some fun effects
startButton.addEventListener('mouseenter', () => {
    if (!startButton.disabled) {
        startButton.style.transform = 'scale(1.05)';
    }
});

startButton.addEventListener('mouseleave', () => {
    startButton.style.transform = 'scale(1)';
});

countdownElement.addEventListener('mouseenter', () => {
    if (!gameStarted || waitingForClick) {
        countdownElement.style.transform = 'scale(1.02)';
    }
});

countdownElement.addEventListener('mouseleave', () => {
    countdownElement.style.transform = 'scale(1)';
});

// Add keyboard support
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'Enter') {
        if (!gameStarted && !startButton.disabled) {
            startGame();
        } else if (waitingForClick) {
            handleCountdownClick();
        }
    }
});

// Instructions for keyboard
const keyboardHint = document.createElement('p');
keyboardHint.className = 'keyboard-hint';
keyboardHint.innerHTML = '<i class="fas fa-keyboard"></i> You can also use <kbd>Space</kbd> or <kbd>Enter</kbd> to start and click!';

const instructionsDiv = document.querySelector('.instructions');
if (instructionsDiv) {
    instructionsDiv.appendChild(keyboardHint);
}

console.log('Reaction Speed Test v2.0 loaded successfully!');
console.log('New features:');
console.log('- Clickable number display (no separate button)');
console.log('- Single page layout (no scrolling)');
console.log('- Improved visual feedback');
console.log('- Attempt history tracking');
console.log('- Average time calculation');
console.log('- Enhanced UI with cards and grids');