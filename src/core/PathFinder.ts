import { Cell, Position } from './types';

/**
 * PathFinder: BFS algorithm to find shortest path
 */
export class PathFinder {
  /**
   * Find shortest path from start to end using BFS
   */
  public static findPath(maze: Cell[][], start: Position, end: Position): Position[] {
    // TODO: Implement BFS to find shortest path
    // Return array of positions from start to end
    return [];
  }

  /**
   * Check if movement is valid (no wall blocking)
   */
  private static canMove(maze: Cell[][], from: Position, to: Position, direction: 'top' | 'right' | 'bottom' | 'left'): boolean {
    // TODO: Check if there's no wall in given direction
    return true;
  }
}
