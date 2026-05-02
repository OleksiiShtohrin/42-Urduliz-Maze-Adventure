# Urduliz Maze Adventure - Web Game

2D procedually generated maze game in browser using TypeScript and Canvas.

## 🎮 Features

- **Procedural Maze Generation**: DFS Recursive Backtracker algorithm
- **Canyon Exploration**: Navigate through a garden-like maze
- **Seed-based Reproducibility**: Same seed = same maze
- **Path Finding**: BFS algorithm for shortest path hints
- **Responsive Controls**: Keyboard (WASD/Arrows) + Mobile support
- **Beautiful Graphics**: Garden/nature-themed 2D visuals

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open http://localhost:8080 in your browser.

### Build for Production
```bash
npm run build
```

## 📋 Game Instructions

1. **Main Menu**:
   - Enter a seed (or leave empty for random)
   - Set maze width and height (15-50)
   - Click Play

2. **Controls**:
   - **Desktop**: WASD or Arrow Keys
   - **Mobile**: Use on-screen controls (TBD)

3. **Gameplay**:
   - Find the exit (bottom-right)
   - Use "Path Hint" button to see the shortest route
   - Copy the seed to share your maze

## 🏗️ Project Structure

```
src/
├── core/           - Maze logic (generation, state, pathfinding)
├── render/         - Canvas rendering and styles
├── input/          - Keyboard and mobile input handling
├── ui/             - Menu and HUD interface
├── game/           - Main game orchestrator
└── main.ts         - Entry point
```

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Rendering**: HTML5 Canvas
- **Build Tool**: Webpack 5
- **Styling**: CSS3

## 📚 Game Mechanics

### Maze Generation (v1)
- Algorithm: **Recursive Backtracker (DFS)**
- Type: **Perfect maze** (no cycles, single solution)
- Seed: Fully deterministic (same seed = same maze)
- Central Zone: Reserved 7x5 area with 42 School logo
- Boundaries: 1 cell border of walls

### Path Finding
- Algorithm: **Breadth-First Search (BFS)**
- Used for: "Path Hint" feature to show shortest route to exit

### Movement
- Grid-based: 1 cell = 1 move
- Collision: Cannot walk through walls
- Entry: Automatically placed (top-left edge)
- Exit: Automatically placed (bottom-right edge)

## 🎨 Visual Style

- **Paths**: Brown/tan walkable terrain
- **Walls**: Dark green bushes/flowers
- **Player**: Pink/magenta character
- **Exit**: Magical portal glow effect
- **Zone 42**: Centered reserved area with school logo

## 🚧 Roadmap v2

- [ ] Sound and music
- [ ] Additional maze algorithms (Prim, Eller)
- [ ] Character animation
- [ ] Manual entry/exit selection
- [ ] More decorative elements
- [ ] Leaderboard/stats

## 📄 License

MIT

## 👤 Author

Based on school A-Maze-ing project, adapted for web.
