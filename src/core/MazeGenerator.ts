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
  private visited: boolean[][];
  private randomState: number;

  // Zone 42 boundaries
  private zone42: { x: number; y: number; width: number; height: number };

  constructor(config: MazeConfig) {
    this.width = config.width;
    this.height = config.height;
    this.seed = config.seed;
    this.maze = [];
    this.visited = [];
    this.randomState = config.seed;

    // Calculate zone 42 position (centered)
    this.zone42 = {
      x: Math.floor((this.width - 7) / 2),
      y: Math.floor((this.height - 5) / 2),
      width: 7,
      height: 5,
    };
  }

  /**
   * Check if position is in zone 42
   */
  private isInZone42(x: number, y: number): boolean {
    return (
      x >= this.zone42.x &&
      x < this.zone42.x + this.zone42.width &&
      y >= this.zone42.y &&
      y < this.zone42.y + this.zone42.height
    );
  }

  /**
   * Generate the maze using seed for reproducibility
   */
  public generate(): Cell[][] {
    // Initialize grid with all walls
    this.initializeMaze();
    this.initializeVisited();

    // Start DFS from (1, 1) leaving room for borders
    this.carvePath(1, 1);

    // Ensure zone 42 is completely surrounded by walls
    this.protectZone42();

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

  private initializeVisited(): void {
    this.visited = [];
    for (let y = 0; y < this.height; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < this.width; x++) {
        // Mark zone 42 and borders as visited to avoid carving through them
        row.push(x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1 || this.isInZone42(x, y));
      }
      this.visited.push(row);
    }
  }

  /**
   * DFS carving algorithm
   * 1. Mark current cell as visited
   * 2. Remove wall to random unvisited neighbor
   * 3. Recursively carve from that neighbor
   * 4. Backtrack when all neighbors visited
   */
  private carvePath(x: number, y: number): void {
    this.visited[y][x] = true;

    // Get unvisited neighbors in random order
    const neighbors = this.getUnvisitedNeighbors(x, y);

    for (const neighbor of neighbors) {
      if (!this.visited[neighbor.y][neighbor.x]) {
        // Remove wall between current cell and neighbor
        this.removeWall(x, y, neighbor.x, neighbor.y);
        // Recursively carve from neighbor
        this.carvePath(neighbor.x, neighbor.y);
      }
    }
  }

  /**
   * Seeded random number generator (linear congruential generator)
   * Ensures reproducibility: same seed always produces same sequence
   */
  private seededRandom(min: number, max: number): number {
    // Linear Congruential Generator
    this.randomState = (this.randomState * 1664525 + 1013904223) & 0x7fffffff;
    return min + (this.randomState % (max - min + 1));
  }

  /**
   * Get unvisited neighbors for DFS, shuffled randomly
   */
  private getUnvisitedNeighbors(x: number, y: number): Array<{ x: number; y: number; dir: string }> {
    const neighbors: Array<{ x: number; y: number; dir: string }> = [];

    // Check all 4 directions (2-cell steps to maintain odd grid)
    const directions = [
      { dx: 0, dy: -2, dir: 'top' },
      { dx: 2, dy: 0, dir: 'right' },
      { dx: 0, dy: 2, dir: 'bottom' },
      { dx: -2, dy: 0, dir: 'left' },
    ];

    for (const dir of directions) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;

      // Check bounds and not visited
      if (nx > 0 && nx < this.width - 1 && ny > 0 && ny < this.height - 1) {
        if (!this.visited[ny][nx] && !this.isInZone42(nx, ny)) {
          neighbors.push({ x: nx, y: ny, dir: dir.dir });
        }
      }
    }

    // Fisher-Yates shuffle with seeded random
    for (let i = neighbors.length - 1; i > 0; i--) {
      const j = this.seededRandom(0, i);
      [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
    }

    return neighbors;
  }

  /**
   * Remove wall between two adjacent cells (they are 2 cells apart)
   */
  private removeWall(x1: number, y1: number, x2: number, y2: number): void {
    // Determine direction and remove walls
    if (x2 === x1 + 2) {
      // Moving right
      this.maze[y1][x1].walls.right = false;
      this.maze[y1][x1 + 1].walls.top = false;
      this.maze[y1][x1 + 1].walls.bottom = false;
      this.maze[y1][x1 + 1].walls.right = false;
      this.maze[y1][x1 + 1].walls.left = false;
      this.maze[y1][x2].walls.left = false;
    } else if (x2 === x1 - 2) {
      // Moving left
      this.maze[y1][x1].walls.left = false;
      this.maze[y1][x1 - 1].walls.top = false;
      this.maze[y1][x1 - 1].walls.bottom = false;
      this.maze[y1][x1 - 1].walls.left = false;
      this.maze[y1][x1 - 1].walls.right = false;
      this.maze[y1][x2].walls.right = false;
    } else if (y2 === y1 + 2) {
      // Moving down
      this.maze[y1][x1].walls.bottom = false;
      this.maze[y1 + 1][x1].walls.top = false;
      this.maze[y1 + 1][x1].walls.bottom = false;
      this.maze[y1 + 1][x1].walls.left = false;
      this.maze[y1 + 1][x1].walls.right = false;
      this.maze[y2][x1].walls.top = false;
    } else if (y2 === y1 - 2) {
      // Moving up
      this.maze[y1][x1].walls.top = false;
      this.maze[y1 - 1][x1].walls.top = false;
      this.maze[y1 - 1][x1].walls.bottom = false;
      this.maze[y1 - 1][x1].walls.left = false;
      this.maze[y1 - 1][x1].walls.right = false;
      this.maze[y2][x1].walls.bottom = false;
    }
  }

  /**
   * Ensure zone 42 is completely surrounded by walls
   */
  private protectZone42(): void {
    // Build walls around zone 42
    const x1 = this.zone42.x - 1;
    const x2 = this.zone42.x + this.zone42.width;
    const y1 = this.zone42.y - 1;
    const y2 = this.zone42.y + this.zone42.height;

    // Set all walls around the boundary to intact
    for (let x = x1; x <= x2; x++) {
      if (x >= 0 && x < this.width) {
        // Top border
        if (y1 >= 0 && y1 < this.height) {
          this.maze[y1][x].walls.bottom = true;
        }
        // Bottom border
        if (y2 >= 0 && y2 < this.height) {
          this.maze[y2][x].walls.top = true;
        }
      }
    }

    for (let y = y1; y <= y2; y++) {
      if (y >= 0 && y < this.height) {
        // Left border
        if (x1 >= 0 && x1 < this.width) {
          this.maze[y][x1].walls.right = true;
        }
        // Right border
        if (x2 >= 0 && x2 < this.width) {
          this.maze[y][x2].walls.left = true;
        }
      }
    }
  }
}
