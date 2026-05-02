import { GameState, MazeConfig, Position } from './types';

/**
 * MazeState: Manages game state representation
 */
export class MazeState {
  public state: GameState;

  constructor(config: MazeConfig) {
    const zone42 = {
      x: Math.floor((config.width - 7) / 2),
      y: Math.floor((config.height - 5) / 2),
      width: 7,
      height: 5,
    };

    const exitInteriorX = (config.width - 2) % 2 === 0 ? config.width - 3 : config.width - 2;

    this.state = {
      config,
      maze: [],
      playerPos: { x: 1, y: 0 },
      entryPos: { x: 1, y: 0 },
      exitPos: { x: exitInteriorX, y: config.height - 1 },
      zone42,
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

    // Keep a one-cell moat around zone 42 sealed as well
    const moatX = Math.max(0, this.state.zone42.x - 1);
    const moatY = Math.max(0, this.state.zone42.y - 1);
    const moatWidth = Math.min(this.state.config.width - moatX, this.state.zone42.width + 2);
    const moatHeight = Math.min(this.state.config.height - moatY, this.state.zone42.height + 2);

    if (pos.x >= moatX && pos.x < moatX + moatWidth && pos.y >= moatY && pos.y < moatY + moatHeight) {
      return false;
    }

    // If we don't have maze data yet, can't validate walls
    if (this.state.maze.length === 0) {
      return true;
    }

    return !!this.state.maze[pos.y]?.[pos.x];
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
