import { GameState } from '../core/types';
import { Cell, Position } from '../core/types';

/**
 * Renderer: Renders maze and game state to Canvas
 */
export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number = 16; // pixels per cell

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    if (!this.ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }
  }

  /**
   * Render the entire game state
   */
  public render(state: GameState): void {
    // Clear canvas with background color
    this.ctx.fillStyle = '#1a4d2e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (state.maze.length === 0) return;

    // Draw maze
    this.drawMaze(state);

    // Draw zone 42
    this.drawZone42(state);

    // Draw path hint if active
    if (state.currentPath && state.currentPath.length > 0) {
      this.drawPathHint(state.currentPath);
    }

    // Draw markers (entry and exit)
    this.drawMarkers(state);

    // Draw player
    this.drawPlayer(state.playerPos);
  }

  /**
   * Draw the entire maze
   */
  private drawMaze(state: GameState): void {
    const maze = state.maze;

    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const cell = maze[y][x];
        const px = x * this.cellSize;
        const py = y * this.cellSize;

        // Draw cell floor
        this.ctx.fillStyle = '#8b7355'; // Brown path
        this.ctx.fillRect(px, py, this.cellSize, this.cellSize);

        // Draw walls as lines
        this.ctx.strokeStyle = '#2a5d3f'; // Dark green wall
        this.ctx.lineWidth = 2;

        if (cell.walls.top) {
          this.ctx.beginPath();
          this.ctx.moveTo(px, py);
          this.ctx.lineTo(px + this.cellSize, py);
          this.ctx.stroke();
        }

        if (cell.walls.right) {
          this.ctx.beginPath();
          this.ctx.moveTo(px + this.cellSize, py);
          this.ctx.lineTo(px + this.cellSize, py + this.cellSize);
          this.ctx.stroke();
        }

        if (cell.walls.bottom) {
          this.ctx.beginPath();
          this.ctx.moveTo(px, py + this.cellSize);
          this.ctx.lineTo(px + this.cellSize, py + this.cellSize);
          this.ctx.stroke();
        }

        if (cell.walls.left) {
          this.ctx.beginPath();
          this.ctx.moveTo(px, py);
          this.ctx.lineTo(px, py + this.cellSize);
          this.ctx.stroke();
        }
      }
    }
  }

  /**
   * Draw zone 42 with logo placeholder
   */
  private drawZone42(state: GameState): void {
    const z = state.zone42;
    const px = z.x * this.cellSize;
    const py = z.y * this.cellSize;
    const w = z.width * this.cellSize;
    const h = z.height * this.cellSize;

    // Fill zone 42 with special color
    this.ctx.fillStyle = '#d4af37'; // Gold
    this.ctx.fillRect(px, py, w, h);

    // Draw border
    this.ctx.strokeStyle = '#9d8b16';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(px, py, w, h);

    // Draw "42" text
    this.ctx.fillStyle = '#000';
    this.ctx.font = `bold ${Math.floor(this.cellSize * 2)}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('42', px + w / 2, py + h / 2);
  }

  /**
   * Draw entry and exit markers
   */
  private drawMarkers(state: GameState): void {
    // Draw entry marker (green glow)
    const entryPx = state.entryPos.x * this.cellSize;
    const entryPy = state.entryPos.y * this.cellSize;

    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    this.ctx.fillRect(entryPx, entryPy, this.cellSize, this.cellSize);

    // Draw exit marker (purple/magical glow)
    const exitPx = state.exitPos.x * this.cellSize;
    const exitPy = state.exitPos.y * this.cellSize;

    // Animated glow effect
    const glowIntensity = (Math.sin(Date.now() / 500) + 1) / 2; // 0 to 1
    this.ctx.fillStyle = `rgba(186, 85, 211, ${0.2 + glowIntensity * 0.3})`;
    this.ctx.fillRect(exitPx, exitPy, this.cellSize, this.cellSize);

    // Add spiral effect for portal
    this.ctx.strokeStyle = `rgba(186, 85, 211, ${0.5 + glowIntensity * 0.5})`;
    this.ctx.lineWidth = 1;
    const centerX = exitPx + this.cellSize / 2;
    const centerY = exitPy + this.cellSize / 2;
    const radius = this.cellSize / 4;

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  /**
   * Draw player character at position
   */
  private drawPlayer(pos: Position): void {
    const px = pos.x * this.cellSize;
    const py = pos.y * this.cellSize;

    // Draw player as a circle with color
    this.ctx.fillStyle = '#ff69b4'; // Hot pink
    this.ctx.beginPath();
    this.ctx.arc(px + this.cellSize / 2, py + this.cellSize / 2, this.cellSize / 2.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Add a border
    this.ctx.strokeStyle = '#ff1493';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Draw "eyes" for character
    this.ctx.fillStyle = '#fff';
    const eyeRadius = this.cellSize / 10;
    const eyeOffsetX = this.cellSize / 6;
    const eyeOffsetY = -this.cellSize / 8;

    this.ctx.beginPath();
    this.ctx.arc(px + this.cellSize / 2 - eyeOffsetX, py + this.cellSize / 2 + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(px + this.cellSize / 2 + eyeOffsetX, py + this.cellSize / 2 + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Draw path hint (highlighted cells)
   */
  private drawPathHint(path: Position[]): void {
    // Draw path with semi-transparent highlighting
    for (let i = 0; i < path.length; i++) {
      const pos = path[i];
      const px = pos.x * this.cellSize;
      const py = pos.y * this.cellSize;

      // Gradient from yellow to transparent
      const opacity = (1 - i / path.length) * 0.4;
      this.ctx.fillStyle = `rgba(255, 255, 100, ${opacity})`;
      this.ctx.fillRect(px, py, this.cellSize, this.cellSize);

      // Draw line segments
      if (i < path.length - 1) {
        const nextPos = path[i + 1];
        const nextPx = nextPos.x * this.cellSize + this.cellSize / 2;
        const nextPy = nextPos.y * this.cellSize + this.cellSize / 2;
        const currentPx = px + this.cellSize / 2;
        const currentPy = py + this.cellSize / 2;

        this.ctx.strokeStyle = 'rgba(255, 255, 100, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(currentPx, currentPy);
        this.ctx.lineTo(nextPx, nextPy);
        this.ctx.stroke();
      }
    }
  }
}
