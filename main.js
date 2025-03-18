import './style.css';
import { Game } from './src/game.js';

document.querySelector('#app').innerHTML = `
  <h1 class="game-title">SNAKE</h1>
  <div class="game-container">
    <canvas class="game-canvas" width="400" height="400"></canvas>
    <div class="start-screen">
      <h2>SNAKE</h2>
      <button class="btn start-btn">START GAME</button>
      <div class="controls">
        <p>Use arrow keys to move</p>
        <p>Press P to pause</p>
        <p>Swipe on mobile</p>
      </div>
    </div>
    <div class="game-over">
      <h2>GAME OVER</h2>
      <p>Final Score: <span class="final-score">0</span></p>
      <p>High Score: <span class="high-score">0</span></p>
      <button class="btn restart-btn">PLAY AGAIN</button>
    </div>
    <div class="touch-controls">
      <button class="touch-btn up-btn">↑</button>
      <div class="touch-middle">
        <button class="touch-btn left-btn">←</button>
        <button class="touch-btn right-btn">→</button>
      </div>
      <button class="touch-btn down-btn">↓</button>
    </div>
  </div>
  <div class="score-container">
    <div class="score-display">SCORE: <span class="score">0</span></div>
    <div class="high-score-display">HIGH: <span class="current-high-score">0</span></div>
  </div>
`;

const canvas = document.querySelector('.game-canvas');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.current-high-score');
const finalScoreElement = document.querySelector('.final-score');
const highScoreGameOverElement = document.querySelector('.high-score');
const startScreen = document.querySelector('.start-screen');
const gameOverScreen = document.querySelector('.game-over');
const startButton = document.querySelector('.start-btn');
const restartButton = document.querySelector('.restart-btn');
const touchControls = document.querySelector('.touch-controls');

// Touch control buttons
const upButton = document.querySelector('.up-btn');
const downButton = document.querySelector('.down-btn');
const leftButton = document.querySelector('.left-btn');
const rightButton = document.querySelector('.right-btn');

const game = new Game(canvas, 20);

// Initialize high score display
highScoreElement.textContent = game.highScore;
highScoreGameOverElement.textContent = game.highScore;

function updateScore(score, highScore) {
  scoreElement.textContent = score;
  finalScoreElement.textContent = score;
  highScoreElement.textContent = highScore;
  highScoreGameOverElement.textContent = highScore;
}

function showGameOver() {
  gameOverScreen.classList.add('active');
  touchControls.classList.remove('active');
}

function hideGameOver() {
  gameOverScreen.classList.remove('active');
}

function startGame() {
  startScreen.style.display = 'none';
  hideGameOver();
  game.start();
  game.onScoreChange = updateScore;
  game.onGameOver = showGameOver;
  
  // Show touch controls on mobile
  if (isMobileDevice()) {
    touchControls.classList.add('active');
  }
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 800;
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Handle keyboard controls
window.addEventListener('keydown', (e) => {
  if (!game.isRunning) return;
  
  switch (e.key) {
    case 'ArrowUp':
      game.changeDirection('up');
      break;
    case 'ArrowDown':
      game.changeDirection('down');
      break;
    case 'ArrowLeft':
      game.changeDirection('left');
      break;
    case 'ArrowRight':
      game.changeDirection('right');
      break;
    case 'p':
    case 'P':
      const isPaused = game.togglePause();
      if (isPaused) {
        touchControls.classList.remove('active');
      } else if (isMobileDevice()) {
        touchControls.classList.add('active');
      }
      break;
  }
});

// Touch controls
upButton.addEventListener('click', () => game.changeDirection('up'));
downButton.addEventListener('click', () => game.changeDirection('down'));
leftButton.addEventListener('click', () => game.changeDirection('left'));
rightButton.addEventListener('click', () => game.changeDirection('right'));

// Swipe controls for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
  e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
  if (!game.isRunning || game.isPaused) return;
  
  const touchEndX = e.changedTouches[0].screenX;
  const touchEndY = e.changedTouches[0].screenY;
  
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;
  
  // Determine swipe direction based on which axis had the larger movement
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) {
      game.changeDirection('right');
    } else {
      game.changeDirection('left');
    }
  } else {
    if (diffY > 0) {
      game.changeDirection('down');
    } else {
      game.changeDirection('up');
    }
  }
  
  e.preventDefault();
}, { passive: false });

// Double tap to pause
let lastTap = 0;
canvas.addEventListener('touchend', (e) => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  
  if (tapLength < 300 && tapLength > 0) {
    game.togglePause();
    e.preventDefault();
  }
  
  lastTap = currentTime;
});
