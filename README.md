# 🐍 Arcade Snake Game

A modern implementation of the classic Snake game with arcade-style visuals and enhanced gameplay features.

## 🎮 Play Now

You can play the game by running:

```bash
npm run dev
```

And opening the provided local URL in your browser.

## ✨ Features

- 🎯 Classic snake gameplay with modern visuals
- 🌟 Glowing effects and visual animations
- 📱 Mobile support with touch controls and swipe gestures
- 🏆 High score tracking with local storage
- ⏸️ Pause functionality (press 'P' or double-tap on mobile)
- 🚀 Progressive difficulty (snake speeds up as you score more points)
- 👁️ Visual feedback when eating food
- 🎨 Retro arcade-style design with pixel font

## 🕹️ Controls

### Desktop:
- **Arrow Keys**: Control snake direction
- **P**: Pause/Resume game

### Mobile:
- **Swipe**: Control snake direction
- **On-screen buttons**: Directional controls
- **Double tap**: Pause/Resume game

## 🛠️ Technical Details

### Built With
- Vanilla JavaScript
- HTML5 Canvas for rendering
- CSS for styling
- Vite for development and building

### Project Structure
- `src/game.js` - Core game logic and rendering
- `main.js` - Game initialization and input handling
- `style.css` - Game styling
- `index.html` - Main HTML structure

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/snake-game.git
cd snake-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the provided local URL (usually http://localhost:5173)

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 Game Mechanics

- The snake moves continuously in the current direction
- Eating food increases the snake's length and your score
- The game ends if the snake hits the wall or itself
- Every 50 points, the snake's speed increases
- Your high score is saved between sessions

## 🧠 Implementation Details

The game uses HTML5 Canvas for rendering with a game loop that:
1. Updates the snake position based on current direction
2. Checks for collisions with walls, self, and food
3. Updates the score and snake length when food is eaten
4. Renders the game state with visual effects

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Font: "Press Start 2P" from Google Fonts
- Inspired by the classic Snake game from Nokia phones
