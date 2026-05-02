import { Cell, MazeConfig, Position } from './types';

/**
 * MazeGenerator: DFS Recursive Backtracker algorithm
 * Generates a perfect maze (no cycles, single solution)
 */
export class MazeGenerator {
  private width: number;
  private height: number;
  private seed: number;
  private maze: Cell[][];

  constructor(config: MazeConfig) {
    this.width = config.width;
    this.height = config.height;
    this.seed = config.seed;
    this.maze = [];
  }

  /**
   * Generate the maze using seed for reproducibility
   */
  public generate(): Cell[][] {
    // Initialize grid with all walls
    this.initializeMaze();

    // Start DFS from (1, 1) leaving room for borders
    this.carvePath(1, 1);

    return this.maze;
  }

  private initializeMaze(): void {
    this.maze = [];
    for (let y = 0; y < this.height; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < this.width; x++) {
        row.push({
          x,
          y,
          walls: { top: true, right: true, bottom: true, left: true },
        });
      }
      this.maze.push(row);
    }
  }

  /**
   * DFS carving algorithm
   * TODO: Implement DFS recursive backtracker:
   * 1. Mark current cell as visited
   * 2. Remove wall to random unvisited neighbor
   * 3. Recursively carve from that neighbor
   * 4. Backtrack when all neighbors visited
   */
  private carvePath(x: number, y: number): void {
    // TO BE IMPLEMENTED
  }

  /**
   * Seeded random number generator (for reproducibility)
   */
  private seededRandom(min: number, max: number): number {
    // TODO: Use seed to generate reproducible random numbers
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get unvisited neighbors for DFS
   */
  private getUnvisitedNeighbors(x: number, y: number): Array<{ x: number; y: number; dir: string }> {
    // TODO: Return unvisited neighbors and direction
    return [];
  }

  /**
   * Remove wall between two adjacent cells
   */
  private removeWall(x1: number, y1: number, x2: number, y2: number): void {
    // TODO: Remove walls between adjacent cells
  }
}
