export class Game {
  constructor(canvas, gridSize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gridSize = gridSize;
    this.cellSize = canvas.width / gridSize;
    this.snake = [];
    this.food = { x: 0, y: 0 };
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.speed = 150;
    this.isRunning = false;
    this.isPaused = false;
    this.gameLoop = null;
    this.onScoreChange = null;
    this.onGameOver = null;
    this.highScore = localStorage.getItem('snakeHighScore') || 0;
    
    // Visual effects
    this.glowIntensity = 0;
    this.glowDirection = 1;
    this.foodPulse = 0;
    this.lastFrameTime = 0;
    this.eatEffect = { active: false, time: 0, x: 0, y: 0 };
    
    // Initialize animation loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }
  
  start() {
    this.snake = [
      { x: Math.floor(this.gridSize / 2), y: Math.floor(this.gridSize / 2) }
    ];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.speed = 150;
    this.isRunning = true;
    this.isPaused = false;
    this.generateFood();
    
    if (this.onScoreChange) {
      this.onScoreChange(this.score, this.highScore);
    }
    
    clearInterval(this.gameLoop);
    this.gameLoop = setInterval(() => this.update(), this.speed);
  }
  
  generateFood() {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      };
    } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    this.food = newFood;
  }
  
  changeDirection(newDirection) {
    // Prevent 180-degree turns
    if (
      (this.direction === 'up' && newDirection === 'down') ||
      (this.direction === 'down' && newDirection === 'up') ||
      (this.direction === 'left' && newDirection === 'right') ||
      (this.direction === 'right' && newDirection === 'left')
    ) {
      return;
    }
    
    this.nextDirection = newDirection;
  }
  
  togglePause() {
    if (!this.isRunning) return;
    
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      clearInterval(this.gameLoop);
    } else {
      this.gameLoop = setInterval(() => this.update(), this.speed);
    }
    
    return this.isPaused;
  }
  
  update() {
    if (!this.isRunning || this.isPaused) return;
    
    // Update direction
    this.direction = this.nextDirection;
    
    // Calculate new head position
    const head = { ...this.snake[0] };
    
    switch (this.direction) {
      case 'up':
        head.y -= 1;
        break;
      case 'down':
        head.y += 1;
        break;
      case 'left':
        head.x -= 1;
        break;
      case 'right':
        head.x += 1;
        break;
    }
    
    // Check for collisions with walls
    if (
      head.x < 0 ||
      head.x >= this.gridSize ||
      head.y < 0 ||
      head.y >= this.gridSize
    ) {
      this.gameOver();
      return;
    }
    
    // Check for collisions with self
    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.gameOver();
      return;
    }
    
    // Add new head
    this.snake.unshift(head);
    
    // Check if food is eaten
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      
      // Trigger eat effect
      this.eatEffect = {
        active: true,
        time: 0,
        x: this.food.x * this.cellSize + this.cellSize / 2,
        y: this.food.y * this.cellSize + this.cellSize / 2
      };
      
      // Update high score if needed
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('snakeHighScore', this.highScore);
      }
      
      // Increase speed every 50 points
      if (this.score % 50 === 0 && this.speed > 70) {
        this.speed -= 10;
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), this.speed);
      }
      
      if (this.onScoreChange) {
        this.onScoreChange(this.score, this.highScore);
      }
      
      this.generateFood();
    } else {
      // Remove tail if no food eaten
      this.snake.pop();
    }
  }
  
  gameOver() {
    this.isRunning = false;
    clearInterval(this.gameLoop);
    
    if (this.onGameOver) {
      this.onGameOver(this.score, this.highScore);
    }
  }
  
  animate(timestamp) {
    // Calculate delta time for smooth animations
    const deltaTime = timestamp - this.lastFrameTime || 0;
    this.lastFrameTime = timestamp;
    
    // Update visual effects
    this.updateEffects(deltaTime);
    
    // Draw the game
    this.draw();
    
    // Continue animation loop
    requestAnimationFrame(this.animate);
  }
  
  updateEffects(deltaTime) {
    // Update glow effect
    this.glowIntensity += 0.003 * this.glowDirection * deltaTime;
    if (this.glowIntensity > 1) {
      this.glowIntensity = 1;
      this.glowDirection = -1;
    } else if (this.glowIntensity < 0.5) {
      this.glowIntensity = 0.5;
      this.glowDirection = 1;
    }
    
    // Update food pulse
    this.foodPulse += 0.005 * deltaTime;
    if (this.foodPulse > Math.PI * 2) {
      this.foodPulse = 0;
    }
    
    // Update eat effect
    if (this.eatEffect.active) {
      this.eatEffect.time += deltaTime;
      if (this.eatEffect.time > 300) {
        this.eatEffect.active = false;
      }
    }
  }
  
  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw grid (subtle)
    this.ctx.strokeStyle = '#222';
    this.ctx.lineWidth = 0.5;
    for (let i = 0; i <= this.gridSize; i++) {
      const pos = i * this.cellSize;
      
      // Vertical line
      this.ctx.beginPath();
      this.ctx.moveTo(pos, 0);
      this.ctx.lineTo(pos, this.canvas.height);
      this.ctx.stroke();
      
      // Horizontal line
      this.ctx.beginPath();
      this.ctx.moveTo(0, pos);
      this.ctx.lineTo(this.canvas.width, pos);
      this.ctx.stroke();
    }
    
    // Draw eat effect
    if (this.eatEffect.active) {
      const progress = this.eatEffect.time / 300;
      const radius = this.cellSize * (1 + progress);
      const alpha = 1 - progress;
      
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
      this.ctx.beginPath();
      this.ctx.arc(
        this.eatEffect.x,
        this.eatEffect.y,
        radius,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    }
    
    // Draw food with pulsing effect
    const foodPulseScale = 0.15 * Math.sin(this.foodPulse) + 0.85;
    const foodSize = this.cellSize * foodPulseScale;
    
    // Use direct color values instead of CSS variables for food
    this.ctx.fillStyle = '#ff3860'; // Direct color instead of var(--food-color)
    this.ctx.shadowColor = '#ff3860'; // Direct color
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.arc(
      this.food.x * this.cellSize + this.cellSize / 2,
      this.food.y * this.cellSize + this.cellSize / 2,
      foodSize / 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    
    // Reset shadow for other elements
    this.ctx.shadowBlur = 0;
    
    // Draw snake
    this.snake.forEach((segment, index) => {
      // Head has different style
      if (index === 0) {
        // Use direct color values instead of CSS variables for snake head
        this.ctx.fillStyle = '#39ff14'; // Direct color instead of var(--snake-color)
        this.ctx.shadowColor = '#39ff14'; // Direct color
        this.ctx.shadowBlur = 10 * this.glowIntensity;
        
        // Draw rounded rectangle for head
        const radius = this.cellSize / 4;
        const x = segment.x * this.cellSize;
        const y = segment.y * this.cellSize;
        const width = this.cellSize;
        const height = this.cellSize;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.arcTo(x + width, y, x + width, y + height, radius);
        this.ctx.arcTo(x + width, y + height, x, y + height, radius);
        this.ctx.arcTo(x, y + height, x, y, radius);
        this.ctx.arcTo(x, y, x + width, y, radius);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draw eyes
        this.ctx.fillStyle = '#000';
        this.ctx.shadowBlur = 0;
        
        const eyeSize = this.cellSize / 6;
        const eyeOffset = this.cellSize / 4;
        
        // Position eyes based on direction
        let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
        
        switch (this.direction) {
          case 'up':
            leftEyeX = x + eyeOffset;
            leftEyeY = y + eyeOffset;
            rightEyeX = x + width - eyeOffset - eyeSize;
            rightEyeY = y + eyeOffset;
            break;
          case 'down':
            leftEyeX = x + eyeOffset;
            leftEyeY = y + height - eyeOffset - eyeSize;
            rightEyeX = x + width - eyeOffset - eyeSize;
            rightEyeY = y + height - eyeOffset - eyeSize;
            break;
          case 'left':
            leftEyeX = x + eyeOffset;
            leftEyeY = y + eyeOffset;
            rightEyeX = x + eyeOffset;
            rightEyeY = y + height - eyeOffset - eyeSize;
            break;
          case 'right':
            leftEyeX = x + width - eyeOffset - eyeSize;
            leftEyeY = y + eyeOffset;
            rightEyeX = x + width - eyeOffset - eyeSize;
            rightEyeY = y + height - eyeOffset - eyeSize;
            break;
        }
        
        this.ctx.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize);
        this.ctx.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize);
      } else {
        // Body segments - use direct color values
        const alpha = 1 - (index / this.snake.length) * 0.6;
        this.ctx.fillStyle = `rgba(57, 255, 20, ${alpha})`; // Direct color with alpha
        
        // Smaller segments for body with gap
        const gap = 2;
        const segSize = this.cellSize - gap * 2;
        this.ctx.fillRect(
          segment.x * this.cellSize + gap,
          segment.y * this.cellSize + gap,
          segSize,
          segSize
        );
      }
    });
    
    // Draw pause indicator if paused
    if (this.isPaused && this.isRunning) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '20px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
    }
    
    // Reset shadow
    this.ctx.shadowBlur = 0;
  }
}
