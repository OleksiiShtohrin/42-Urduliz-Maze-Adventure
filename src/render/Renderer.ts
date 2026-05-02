import { GameState } from '../core/types';
import { Cell, Position } from '../core/types';

/**
 * Renderer: Renders maze and game state to Canvas
 */
export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number = 20; // pixels per cell

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Render the entire game state
   */
  public render(state: GameState): void {
    // Clear canvas
    this.ctx.fillStyle = '#2a5d3f';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // TODO: Implement rendering:
    // 1. Draw maze walls and paths
    // 2. Draw zone 42 with logo
    // 3. Draw player character at playerPos
    // 4. Draw entry and exit markers
    // 5. Draw path hint if available
  }

  /**
   * Draw a single cell (wall or path)
   */
  private drawCell(x: number, y: number, cell: Cell, isWall: boolean): void {
    const px = x * this.cellSize;
    const py = y * this.cellSize;

    if (isWall) {
      this.ctx.fillStyle = '#1a3a2a'; // Bush/wall color
    } else {
      this.ctx.fillStyle = '#8b7355'; // Path/floor color
    }

    this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
  }

  /**
   * Draw player character at position
   */
  private drawPlayer(pos: Position): void {
    // TODO: Draw player sprite or colored circle at position
    const px = pos.x * this.cellSize;
    const py = pos.y * this.cellSize;

    this.ctx.fillStyle = '#ff69b4'; // Pink for player
    this.ctx.beginPath();
    this.ctx.arc(px + this.cellSize / 2, py + this.cellSize / 2, this.cellSize / 2 - 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Draw entry and exit markers
   */
  private drawMarkers(state: GameState): void {
    // TODO: Draw entry (top-left) and exit (bottom-right) markers
  }

  /**
   * Draw zone 42 with logo placeholder
   */
  private drawZone42(state: GameState): void {
    // TODO: Draw zone 42 area with logo or placeholder
  }

  /**
   * Draw path hint (highlighted cells)
   */
  private drawPathHint(path: Position[]): void {
    // TODO: Draw path with semi-transparent highlighting
  }
}
