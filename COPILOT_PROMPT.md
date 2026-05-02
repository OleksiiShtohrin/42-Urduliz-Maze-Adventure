# COPILOT PROMPT FOR COMPLETING URDULIZ MAZE ADVENTURE

## ⚡ Goal
Complete the implementation of Urduliz Maze Adventure web game in TypeScript using HTML5 Canvas.

## 📋 What's Already Done
- Project structure and file organization
- TypeScript configuration (tsconfig.json)
- Webpack build setup
- HTML5 Canvas skeleton with menu and game UI
- CSS styles for menu and HUD
- Type definitions for game state
- Skeleton classes with TODO comments for:
  - MazeGenerator (DFS Recursive Backtracker)
  - MazeState (game state management)
  - PathFinder (BFS for shortest path)
  - Renderer (Canvas drawing)
  - InputController (keyboard + mobile controls)
  - UILayer (menu and HUD)
  - Game (game orchestrator)

## 🎯 What Needs to Be Implemented

### 1. MazeGenerator.ts - DFS Recursive Backtracker
**Algorithm**: Generate a perfect maze (no cycles) using Depth-First Search with backtracking.

Requirements:
- Use the seed to make generation reproducible
- Carve paths through a grid of walls
- Avoid the central zone 42 (always reserved and surrounded by walls)
- Return a 2D array of Cell objects with wall information

Key methods to complete:
- `carvePath(x, y)`: DFS carving from given cell
- `getUnvisitedNeighbors(x, y)`: Get unvisited neighbors for carving
- `removeWall(x1, y1, x2, y2)`: Remove wall between adjacent cells
- `seededRandom(min, max)`: Reproducible random using seed

### 2. MazeState.ts - Game State Management
Complete methods:
- `isWalkable(pos)`: Check if cell is not a wall and not in zone 42
- `movePlayer(dx, dy)`: Move player if walkable, check for exit win condition

### 3. PathFinder.ts - BFS Shortest Path
Implement BFS algorithm:
- `findPath(maze, start, end)`: Find shortest path between two points
- `canMove(maze, from, to, direction)`: Check if movement is valid (no wall blocking)

### 4. Renderer.ts - Canvas Drawing
Complete rendering methods:
- `render(state)`: Main render loop - draw everything
- `drawCell(x, y, cell, isWall)`: Draw individual maze cells
- `drawPlayer(pos)`: Draw player character
- `drawMarkers(state)`: Draw entry and exit markers
- `drawZone42(state)`: Draw central zone with 42 logo placeholder
- `drawPathHint(path)`: Draw highlighted path when hint is active

Visual style:
- Paths: #8b7355 (brown soil/stone) or similar walkable tile
- Walls: #1a3a2a (dark green bushes) or similar obstacle
- Player: #ff69b4 (pink/magenta) or animated character sprite
- Zone 42: Different color with "42" text or logo in center
- Entry: Green marker or glow
- Exit: Purple/magical glow effect
- Path hint: Semi-transparent yellow/green highlighting

### 5. InputController.ts - Mobile Touch Support
Implement:
- `setupMobileListeners()`: Add touch/mobile controls
  - Option 1: Four arrow buttons on screen
  - Option 2: Implement virtual joystick (D-pad)
  - Option 3: Swipe detection

### 6. General Improvements
- Implement missing TODOs in all files
- Ensure proper error handling
- Add console logging for debugging
- Test maze generation with different seeds
- Verify wallframing around zone 42 works correctly
- Test player movement and collision detection

## 🔧 Tech Stack
- TypeScript 5+
- Webpack 5 for bundling
- HTML5 Canvas for rendering
- Vanilla JS for input/events

## 📦 Build & Run
```bash
npm install
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run type-check   # Check TypeScript types
```

## 🎮 Game Flow
1. Menu appears: user sets seed (or random), width (15-50), height (15-50)
2. Click Start → maze generates with DFS
3. Player spawns at entry (top-left edge)
4. Controls: WASD or arrow keys (+ mobile controls)
5. Goal: reach exit (bottom-right edge)
6. Button "Path Hint" shows BFS shortest path
7. Button "Back" returns to menu

## 🧪 Test Cases to Verify
- Different seeds produce different but reproducible mazes
- Maze size 15x15 to 50x50 works
- No walls in zone 42, surrounded by walls on edges
- Player can't walk through walls
- Player detects exit and wins
- BFS path is indeed shortest path
- Mobile controls work (if implemented with joystick)
- Seed copy-paste works

## 📝 Format Notes
- Use TypeScript strict mode
- Follow existing code style
- Add comments for complex logic
- Keep functions focused (single responsibility)
- Use type safety - no `any` types

---

Ready to code! Start with MazeGenerator.carvePath() since maze generation is blocking for other features.
