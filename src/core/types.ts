/**
 * Core types for the maze game
 */

export interface Cell {
  x: number;
  y: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
}

export interface Position {
  x: number;
  y: number;
}

export interface MazeConfig {
  width: number;
  height: number;
  seed: number;
  perfectMode: boolean;
}

export interface GameState {
  config: MazeConfig;
  maze: Cell[][];
  playerPos: Position;
  entryPos: Position;
  exitPos: Position;
  zone42: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  currentPath: Position[] | null; // For path hint
  gameOver: boolean;
}

export type GameMode = 'menu' | 'game' | 'gameover';
