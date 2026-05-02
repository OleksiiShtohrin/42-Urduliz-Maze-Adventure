import { GameState, MazeConfig, Position } from './types';

/**
 * MazeState: Manages game state representation
 */
export class MazeState {
  public state: GameState;

  constructor(config: MazeConfig) {
    this.state = {
      config,
      maze: [],
      playerPos: { x: 0, y: 0 },
      entryPos: { x: 1, y: 0 }, // Top-left, automatically placed
      exitPos: { x: config.width - 2, y: config.height - 1 }, // Bottom-right
      zone42: {
        x: Math.floor((config.width - 7) / 2),
        y: Math.floor((config.height - 5) / 2),
        width: 7,
        height: 5,
      },
      currentPath: null,
      gameOver: false,
    };
  }

  /**
   * Check if position is walkable (not a wall, not in zone 42)
   */
  public isWalkable(pos: Position): boolean {
    // TODO: Check maze structure and zone 42 boundaries
    return true;
  }

  /**
   * Move player in given direction (if walkable)
   */
  public movePlayer(dx: number, dy: number): boolean {
    const newX = this.state.playerPos.x + dx;
    const newY = this.state.playerPos.y + dy;
    
    if (this.isWalkable({ x: newX, y: newY })) {
      this.state.playerPos = { x: newX, y: newY };
      
      // Check if reached exit
      if (newX === this.state.exitPos.x && newY === this.state.exitPos.y) {
        this.state.gameOver = true;
      }
      
      return true;
    }
    return false;
  }

  /**
   * Reset player position to entry
   */
  public resetPlayer(): void {
    this.state.playerPos = { ...this.state.entryPos };
    this.state.gameOver = false;
    this.state.currentPath = null;
  }

  /**
   * Set path hint for current player position
   */
  public setPathHint(path: Position[]): void {
    this.state.currentPath = path;
  }

  /**
   * Clear path hint
   */
  public clearPathHint(): void {
    this.state.currentPath = null;
  }
}
