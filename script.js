// DOM Elements
const countdownElement = document.getElementById('countdown');
const countdownNumber = document.getElementById('countdown-number');
const startButton = document.getElementById('start-btn');
const clickButton = document.getElementById('click-btn');
const instructions = document.getElementById('instructions');
const results = document.getElementById('results');
const feedback = document.getElementById('feedback');
const feedbackText = document.getElementById('feedback-text');
const reactionTimeElement = document.getElementById('reaction-time');
const bestTimeElement = document.getElementById('best-time');
const attemptsElement = document.getElementById('attempts');

// Game state
let countdown = 5;
let countdownInterval;
let gameStarted = false;
let waitingForClick = false;
let startTime;
let endTime;
let bestTime = null;
let attempts = 0;

// Initialize
updateUI();

// Event Listeners
startButton.addEventListener('click', startGame);
clickButton.addEventListener('click', handleClick);

function startGame() {
    if (gameStarted) return;
    
    resetGame();
    gameStarted = true;
    waitingForClick = false;
    
    // Update UI
    startButton.disabled = true;
    clickButton.disabled = true;
    countdownElement.classList.remove('ready', 'go');
    feedbackText.textContent = 'Get ready... Countdown starting!';
    
    // Start countdown
    countdown = 5;
    countdownNumber.textContent = countdown;
    
    countdownInterval = setInterval(() => {
        countdown--;
        countdownNumber.textContent = countdown;
        
        // Visual feedback
        if (countdown === 0) {
            countdownElement.classList.add('go');
            feedbackText.textContent = 'NOW! Click the button!';
            waitingForClick = true;
            clickButton.disabled = false;
            startTime = Date.now();
        } else if (countdown <= 2) {
            countdownElement.classList.add('ready');
            feedbackText.textContent = `Almost there... ${countdown}`;
        } else {
            feedbackText.textContent = `Countdown: ${countdown}`;
        }
        
        if (countdown < 0) {
            clearInterval(countdownInterval);
            if (!waitingForClick) {
                feedbackText.textContent = 'Too slow! Try again.';
                resetGameState();
            }
        }
    }, 1000);
}

function handleClick() {
    if (!waitingForClick) return;
    
    endTime = Date.now();
    const reactionTime = endTime - startTime;
    
    // Update results
    attempts++;
    attemptsElement.textContent = attempts;
    reactionTimeElement.textContent = `${reactionTime}ms`;
    
    // Update best time
    if (bestTime === null || reactionTime < bestTime) {
        bestTime = reactionTime;
        bestTimeElement.textContent = `${bestTime}ms`;
    }
    
    // Provide feedback based on reaction time
    let feedbackMessage;
    if (reactionTime < 200) {
        feedbackMessage = '⚡ Superhuman speed! Are you a robot?';
    } else if (reactionTime < 300) {
        feedbackMessage = '🚀 Excellent! Lightning fast reflexes!';
    } else if (reactionTime < 400) {
        feedbackMessage = '👍 Great job! Faster than average!';
    } else if (reactionTime < 500) {
        feedbackMessage = '👌 Good reaction time!';
    } else if (reactionTime < 700) {
        feedbackMessage = '💤 A bit slow... Try to focus more!';
    } else {
        feedbackMessage = '🐌 Too slow! Were you distracted?';
    }
    
    feedbackText.textContent = feedbackMessage;
    
    // Reset for next round
    waitingForClick = false;
    clickButton.disabled = true;
    startButton.disabled = false;
    gameStarted = false;
    
    // Auto-reset after 3 seconds
    setTimeout(() => {
        if (!gameStarted) {
            resetGame();
            feedbackText.textContent = 'Press "Start Test" to play again!';
        }
    }, 3000);
}

function resetGame() {
    clearInterval(countdownInterval);
    countdown = 5;
    countdownNumber.textContent = countdown;
    countdownElement.classList.remove('ready', 'go');
    startButton.disabled = false;
    clickButton.disabled = true;
    gameStarted = false;
    waitingForClick = false;
}

function resetGameState() {
    gameStarted = false;
    waitingForClick = false;
    startButton.disabled = false;
    clickButton.disabled = true;
    countdownElement.classList.remove('ready', 'go');
}

function updateUI() {
    // Initial UI state
    startButton.disabled = false;
    clickButton.disabled = true;
    countdownNumber.textContent = countdown;
    
    // Set initial text content
    reactionTimeElement.textContent = '--';
    bestTimeElement.textContent = '--';
    attemptsElement.textContent = '0';
    feedbackText.textContent = 'Press "Start Test" to begin!';
}

// Add some fun effects
clickButton.addEventListener('mouseenter', () => {
    if (!clickButton.disabled) {
        clickButton.style.transform = 'scale(1.05)';
    }
});

clickButton.addEventListener('mouseleave', () => {
    clickButton.style.transform = 'scale(1)';
});

startButton.addEventListener('mouseenter', () => {
    if (!startButton.disabled) {
        startButton.style.transform = 'scale(1.05)';
    }
});

startButton.addEventListener('mouseleave', () => {
    startButton.style.transform = 'scale(1)';
});

// Add keyboard support
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'Enter') {
        if (!gameStarted && !startButton.disabled) {
            startGame();
        } else if (waitingForClick && !clickButton.disabled) {
            handleClick();
        }
    }
});

// Instructions for keyboard
instructions.innerHTML += `
    <p><i class="fas fa-keyboard"></i> You can also use <kbd>Space</kbd> or <kbd>Enter</kbd> to start and click!</p>
`;

console.log('Reaction Speed Test loaded successfully!');
console.log('Game features:');
console.log('- Countdown from 5 to 0');
console.log('- Reaction time measurement');
console.log('- Best time tracking');
console.log('- Attempt counter');
console.log('- Visual and audio feedback');
console.log('- Keyboard support (Space/Enter)');