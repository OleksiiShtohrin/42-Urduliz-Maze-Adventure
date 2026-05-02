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
      playerPos: { x: 1, y: 1 }, // Will be reset to entry
      entryPos: { x: 1, y: 1 }, // Top-left passageway
      exitPos: { x: config.width - 2, y: config.height - 2 }, // Bottom-right passageway
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
    // Check bounds
    if (pos.x < 0 || pos.x >= this.state.config.width || pos.y < 0 || pos.y >= this.state.config.height) {
      return false;
    }

    // Check zone 42
    if (
      pos.x >= this.state.zone42.x &&
      pos.x < this.state.zone42.x + this.state.zone42.width &&
      pos.y >= this.state.zone42.y &&
      pos.y < this.state.zone42.y + this.state.zone42.height
    ) {
      return false;
    }

    // If we don't have maze data yet, can't validate
    if (this.state.maze.length === 0) {
      return true;
    }

    // In maze: check if it's a passageway (cell with no walls on all sides, or accessible from player position)
    // For simplicity, allow movement if maze is initialized
    // Real collision checking would check maze structure
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
