import { Cell, MazeConfig, Position } from './types';

/**
 * MazeGenerator: DFS Recursive Backtracker algorithm
 * Generates a seeded maze and can optionally add loops when perfect mode is off
 */
export class MazeGenerator {
  private width: number;
  private height: number;
  private seed: number;
  private perfectMode: boolean;
  private maze: Cell[][];
  private visited: boolean[][];
  private randomState: number;

  // Zone 42 boundaries
  private zone42: { x: number; y: number; width: number; height: number };
  private protectedArea: { x: number; y: number; width: number; height: number };

  constructor(config: MazeConfig) {
    this.width = config.width;
    this.height = config.height;
    this.seed = config.seed;
    this.perfectMode = config.perfectMode;
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

    this.protectedArea = {
      x: Math.max(0, this.zone42.x - 1),
      y: Math.max(0, this.zone42.y - 1),
      width: Math.min(this.width - Math.max(0, this.zone42.x - 1), this.zone42.width + 2),
      height: Math.min(this.height - Math.max(0, this.zone42.y - 1), this.zone42.height + 2),
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

  private isInProtectedArea(x: number, y: number): boolean {
    return (
      x >= this.protectedArea.x &&
      x < this.protectedArea.x + this.protectedArea.width &&
      y >= this.protectedArea.y &&
      y < this.protectedArea.y + this.protectedArea.height
    );
  }

  private getExitInteriorX(): number {
    const candidate = this.width - 2;
    return candidate % 2 === 0 ? candidate - 1 : candidate;
  }

  private getExitInteriorY(): number {
    const candidate = this.height - 2;
    return candidate % 2 === 0 ? candidate - 1 : candidate;
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

    if (!this.perfectMode) {
      this.addExtraLoops();
    }

    // Ensure zone 42 is completely surrounded by walls
    this.protectZone42();

    // Open edge portals after generation so entry/exit are always reachable
    this.openPortals();

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
        // Mark borders and protected area as visited to avoid carving through them
        row.push(x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1 || this.isInProtectedArea(x, y));
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
        if (!this.visited[ny][nx] && !this.isInProtectedArea(nx, ny)) {
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
    // Build walls around the protected area
    const x1 = this.protectedArea.x;
    const x2 = this.protectedArea.x + this.protectedArea.width - 1;
    const y1 = this.protectedArea.y;
    const y2 = this.protectedArea.y + this.protectedArea.height - 1;

    // Set all walls around the boundary to intact
    for (let x = x1; x <= x2; x++) {
      if (x >= 0 && x < this.width) {
        if (y1 >= 0 && y1 < this.height) {
          this.maze[y1][x].walls.top = true;
          this.maze[y1][x].walls.right = true;
          this.maze[y1][x].walls.bottom = true;
          this.maze[y1][x].walls.left = true;
        }
        if (y2 >= 0 && y2 < this.height) {
          this.maze[y2][x].walls.top = true;
          this.maze[y2][x].walls.right = true;
          this.maze[y2][x].walls.bottom = true;
          this.maze[y2][x].walls.left = true;
        }
      }
    }

    for (let y = y1; y <= y2; y++) {
      if (y >= 0 && y < this.height) {
        if (x1 >= 0 && x1 < this.width) {
          this.maze[y][x1].walls.top = true;
          this.maze[y][x1].walls.right = true;
          this.maze[y][x1].walls.bottom = true;
          this.maze[y][x1].walls.left = true;
        }
        if (x2 >= 0 && x2 < this.width) {
          this.maze[y][x2].walls.top = true;
          this.maze[y][x2].walls.right = true;
          this.maze[y][x2].walls.bottom = true;
          this.maze[y][x2].walls.left = true;
        }
      }
    }
  }

  /**
   * Create a few extra openings so the maze gets loops when perfect mode is off.
   */
  private addExtraLoops(): void {
    const candidates: Array<{
      x: number;
      y: number;
      side: 'right' | 'bottom';
      opposite: 'left' | 'top';
      nx: number;
      ny: number;
    }> = [];

    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        if (this.isInProtectedArea(x, y)) continue;

        const rightX = x + 1;
        const bottomY = y + 1;

        if (rightX < this.width - 1 && !this.isInProtectedArea(rightX, y) && this.maze[y][x].walls.right) {
          candidates.push({ x, y, side: 'right', opposite: 'left', nx: rightX, ny: y });
        }

        if (bottomY < this.height - 1 && !this.isInProtectedArea(x, bottomY) && this.maze[y][x].walls.bottom) {
          candidates.push({ x, y, side: 'bottom', opposite: 'top', nx: x, ny: bottomY });
        }
      }
    }

    for (let i = candidates.length - 1; i > 0; i--) {
      const j = this.seededRandom(0, i);
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const openings = Math.min(candidates.length, Math.max(12, Math.floor(candidates.length * 0.08)));

    for (let i = 0; i < openings; i++) {
      const candidate = candidates[i];
      this.maze[candidate.y][candidate.x].walls[candidate.side] = false;
      this.maze[candidate.ny][candidate.nx].walls[candidate.opposite] = false;
    }
  }

  /**
   * Open the top entry and bottom-right exit portals.
   */
  private openPortals(): void {
    const entryBorder = { x: 1, y: 0 };
    const entryInterior = { x: 1, y: 1 };
    const exitBorderX = this.getExitInteriorX();
    const exitBorderY = this.height - 1;
    const exitInteriorY = this.getExitInteriorY();
    const exitBorder = { x: exitBorderX, y: exitBorderY };
    const exitInterior = { x: exitBorderX, y: exitInteriorY };
    const exitCorridor = { x: exitBorderX, y: exitInteriorY + 1 };

    if (this.maze[entryBorder.y]?.[entryBorder.x] && this.maze[entryInterior.y]?.[entryInterior.x]) {
      this.maze[entryBorder.y][entryBorder.x].walls.bottom = false;
      this.maze[entryInterior.y][entryInterior.x].walls.top = false;
    }

    if (this.maze[exitBorder.y]?.[exitBorder.x] && this.maze[exitInterior.y]?.[exitInterior.x]) {
      if (this.maze[exitCorridor.y]?.[exitCorridor.x]) {
        this.maze[exitInterior.y][exitInterior.x].walls.bottom = false;
        this.maze[exitCorridor.y][exitCorridor.x].walls.top = false;
        this.maze[exitCorridor.y][exitCorridor.x].walls.bottom = false;
        this.maze[exitBorder.y][exitBorder.x].walls.top = false;
      } else {
        this.maze[exitBorder.y][exitBorder.x].walls.top = false;
        this.maze[exitInterior.y][exitInterior.x].walls.bottom = false;
      }
    }
  }
}
