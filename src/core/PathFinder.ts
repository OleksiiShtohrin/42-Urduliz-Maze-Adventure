import { Cell, Position } from './types';

/**
 * PathFinder: BFS algorithm to find shortest path
 */
export class PathFinder {
  /**
   * Find shortest path from start to end using BFS
   */
  public static findPath(maze: Cell[][], start: Position, end: Position): Position[] {
    if (maze.length === 0) return [];

    const width = maze[0].length;
    const height = maze.length;

    // BFS queue: { position, path }
    const queue: Array<{ pos: Position; path: Position[] }> = [{ pos: start, path: [start] }];
    const visited = new Set<string>();
    visited.add(`${start.x},${start.y}`);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const { pos, path } = current;

      // Check if we reached the end
      if (pos.x === end.x && pos.y === end.y) {
        return path;
      }

      // Try all 4 directions
      const directions = [
        { dx: 0, dy: -1, dir: 'top' as const },
        { dx: 1, dy: 0, dir: 'right' as const },
        { dx: 0, dy: 1, dir: 'bottom' as const },
        { dx: -1, dy: 0, dir: 'left' as const },
      ];

      for (const dir of directions) {
        const nextX = pos.x + dir.dx;
        const nextY = pos.y + dir.dy;
        const key = `${nextX},${nextY}`;

        // Check bounds
        if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue;

        // Check if already visited
        if (visited.has(key)) continue;

        // Check if we can move in this direction (no wall)
        if (!this.canMove(maze, pos, { x: nextX, y: nextY }, dir.dir)) continue;

        visited.add(key);
        queue.push({
          pos: { x: nextX, y: nextY },
          path: [...path, { x: nextX, y: nextY }],
        });
      }
    }

    // No path found
    return [];
  }

  /**
   * Check if movement is valid (no wall blocking)
   */
  private static canMove(
    maze: Cell[][],
    from: Position,
    to: Position,
    direction: 'top' | 'right' | 'bottom' | 'left'
  ): boolean {
    const cell = maze[from.y][from.x];

    if (!cell) return false;

    // Check if there's a wall blocking movement in this direction
    switch (direction) {
      case 'top':
        return !cell.walls.top;
      case 'right':
        return !cell.walls.right;
      case 'bottom':
        return !cell.walls.bottom;
      case 'left':
        return !cell.walls.left;
      default:
        return false;
    }
  }
}
