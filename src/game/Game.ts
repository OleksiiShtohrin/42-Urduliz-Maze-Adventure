import { MazeGenerator } from '../core/MazeGenerator';
import { MazeState } from '../core/MazeState';
import { PathFinder } from '../core/PathFinder';
import { Renderer } from '../render/Renderer';
import { InputController } from '../input/InputController';
import { UILayer } from '../ui/UILayer';
import { GameState, MazeConfig, GameMode } from '../core/types';

/**
 * Main Game orchestrator
 */
export class Game {
  private canvas: HTMLCanvasElement;
  private renderer: Renderer;
  private inputController: InputController;
  private uiLayer: UILayer;

  private mazeGenerator?: MazeGenerator;
  private gameState?: MazeState;
  private currentMode: GameMode = 'menu';

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.renderer = new Renderer(this.canvas);
    this.inputController = new InputController();
    this.uiLayer = new UILayer();

    this.setupEventListeners();
    this.uiLayer.showMenu();
  }

  private setupEventListeners(): void {
    this.uiLayer.setStartGameCallback((seed, width, height) => {
      this.startGame(seed, width, height);
    });

    this.uiLayer.setBackToMenuCallback(() => {
      this.backToMenu();
    });

    this.uiLayer.setPathHintCallback(() => {
      this.showPathHint();
    });

    this.inputController.setMoveCallback((dx, dy) => {
      if (this.gameState) {
        this.tryMovePlayer(dx, dy);
      }
    });
  }

  /**
   * Try to move player with collision detection against maze walls
   */
  private tryMovePlayer(dx: number, dy: number): void {
    if (!this.gameState) return;

    const currentPos = this.gameState.state.playerPos;
    const maze = this.gameState.state.maze;

    // Get the current cell
    const cell = maze[currentPos.y]?.[currentPos.x];
    if (!cell) return;

    const newX = currentPos.x + dx;
    const newY = currentPos.y + dy;

    // Check bounds
    if (newX < 0 || newX >= maze[0].length || newY < 0 || newY >= maze.length) {
      return;
    }

    // Check if there's a wall in the direction of movement
    let canMove = false;

    if (dx > 0 && !cell.walls.right) canMove = true; // Moving right
    if (dx < 0 && !cell.walls.left) canMove = true; // Moving left
    if (dy > 0 && !cell.walls.bottom) canMove = true; // Moving down
    if (dy < 0 && !cell.walls.top) canMove = true; // Moving up

    if (canMove) {
      this.gameState.movePlayer(dx, dy);

      // Check if player reached exit
      if (this.gameState.state.gameOver) {
        console.log('🎉 You reached the exit! Success!');
      }
    }
  }

  private startGame(seed: number, width: number, height: number): void {
    // Validate input
    width = Math.max(15, Math.min(50, width));
    height = Math.max(15, Math.min(50, height));

    const config: MazeConfig = {
      seed,
      width,
      height,
      perfectMode: true, // Always true in v1
    };

    // Generate maze
    this.mazeGenerator = new MazeGenerator(config);
    const maze = this.mazeGenerator.generate();

    // Initialize game state
    this.gameState = new MazeState(config);
    this.gameState.state.maze = maze;
    this.gameState.resetPlayer();

    // Update UI
    this.uiLayer.updateSeedDisplay(seed);
    this.uiLayer.showGame();

    this.currentMode = 'game';
    this.gameLoop();
  }

  private backToMenu(): void {
    this.currentMode = 'menu';
    this.gameState = undefined;
    this.mazeGenerator = undefined;
    this.uiLayer.showMenu();
  }

  private showPathHint(): void {
    if (!this.gameState) return;

    const path = PathFinder.findPath(
      this.gameState.state.maze,
      this.gameState.state.playerPos,
      this.gameState.state.exitPos
    );

    this.gameState.setPathHint(path);
  }

  private gameLoop(): void {
    if (this.currentMode !== 'game' || !this.gameState) {
      return;
    }

    // Render current state
    this.renderer.render(this.gameState.state);

    // Request next frame
    requestAnimationFrame(() => this.gameLoop());
  }

  public start(): void {
    console.log('Urduliz Maze Adventure started');
  }
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.start();
  });
} else {
  const game = new Game();
  game.start();
}
