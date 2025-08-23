# React + Vite

# game-tetris

game-tetris is a classic **X and O game** built with **React + Vite**.  
The application features smooth animations, turn management, and engaging visual
effects.

## 🕹️ Game Flow (Roadmap)

0. **Start the Application**  
   The app initializes with routing and basic navigation setup.

1. **Home Page**  
   Landing page with a **Start Game** button.

2. **GameSettingModal / Settings**  
   Player selects the game settings (ege, lenguage, Hero) (e.g., difficulty,
   player symbol, AI options).  
   Settings are stored in the application state.

3. **TocTacToeGame/Game Board**

   - Displays a 3x3 grid for the game.
   - Handles player turns, marking X = Your hero or O = Computer.
   - Blocks invalid moves and prevents clicking already occupied cells.
   - Tracks the state of the board and checks for win or draw conditions.
   - Updates the board and triggers visual/audio feedback for moves.

4. **Game Logic (Core)**

   - Manages game rules and turn alternation.
   - Checks for winning combinations and draw conditions.
   - Updates the board and triggers visual/audio feedback for moves.
   - Includes animations for moves, highlights winning lines, and optional
     character effects.

5. **Win / Draw Modal**

   - Displays the result with a **Congratulations!** or **Draw!** message.
   - Shows confetti animation or visual effects for victory.
   - Includes a **Play Again** button to reset the board and start a new game.

---

## ✨ Features

- Classic TicTacToe gameplay with X and O.
- Configurable difficulty and optional AI opponent.
- Smooth animations for moves and win/draw.
- Audio feedback for player actions.
- Visual highlighting of winning lines.
- Instant replay option to start a new round.

---

## Build Notes

- Ensure proper signing configuration if building for Android:
  ```properties
  RELEASE_STORE_FILE=keystore/my-release-key.jks
  RELEASE_STORE_PASSWORD=yourKeystorePassword
  RELEASE_KEY_ALIAS=my-key-alias
  RELEASE_KEY_PASSWORD=yourKeyPassword
  ```
