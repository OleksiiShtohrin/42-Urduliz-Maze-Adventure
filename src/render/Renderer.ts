import { GameState } from '../core/types';
import { Cell, Position } from '../core/types';

/**
 * Renderer: Renders maze and game state to Canvas
 */
export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number = 20;
  private layoutSignature: string = '';
  private cameraX: number = 0;
  private cameraY: number = 0;

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
    this.updateLayout(state);

    // Flat black backdrop to match the reference artwork.
    this.ctx.fillStyle = '#000000';
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
        const px = this.worldToScreenX(x);
        const py = this.worldToScreenY(y);

        // Warm, paper-like corridor tone.
        this.ctx.fillStyle = '#e4dccd';
        this.ctx.fillRect(px, py, this.cellSize, this.cellSize);

        // Dark, crisp wall lines.
        this.ctx.strokeStyle = '#111111';
        this.ctx.lineWidth = 1.35;

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

        // A faint grid keeps the maze readable without overpowering the reference style.
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(px + 0.5, py + 0.5, this.cellSize - 1, this.cellSize - 1);
      }
    }
  }

  /**
   * Draw zone 42 with logo placeholder
   */
  private drawZone42(state: GameState): void {
    const z = state.zone42;
    const px = this.worldToScreenX(z.x);
    const py = this.worldToScreenY(z.y);
    const w = z.width * this.cellSize;
    const h = z.height * this.cellSize;

    // Center block should read like a protected logo plaque.
    this.ctx.fillStyle = '#2a2a2a';
    this.ctx.fillRect(px, py, w, h);

    // Thin, hard border like the reference's graphic treatment.
    this.ctx.strokeStyle = '#111111';
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeRect(px, py, w, h);

    // Bright text keeps the center block iconic and legible.
    this.ctx.fillStyle = '#f4f4f4';
    this.ctx.font = `900 ${Math.floor(this.cellSize * 1.55)}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('42', px + w / 2, py + h / 2);
  }

  /**
   * Draw entry and exit markers
   */
  private drawMarkers(state: GameState): void {
    // Draw entry marker (subtle green circle)
    const entryPx = this.worldToScreenX(state.entryPos.x);
    const entryPy = this.worldToScreenY(state.entryPos.y);

    this.ctx.strokeStyle = 'rgba(40, 40, 40, 0.8)';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.arc(entryPx + this.cellSize / 2, entryPy + this.cellSize / 2, this.cellSize / 3, 0, Math.PI * 2);
    this.ctx.stroke();

    // Draw exit marker (mysterious portal glow)
    const exitPx = this.worldToScreenX(state.exitPos.x);
    const exitPy = this.worldToScreenY(state.exitPos.y);

    // Animated glow effect
    const glowIntensity = (Math.sin(Date.now() / 600) + 1) / 2; // 0 to 1
    
    // Outer ring
    this.ctx.strokeStyle = `rgba(210, 210, 210, ${0.18 + glowIntensity * 0.18})`;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(exitPx + this.cellSize / 2, exitPy + this.cellSize / 2, this.cellSize / 3.5, 0, Math.PI * 2);
    this.ctx.stroke();

    // Inner glow
    this.ctx.fillStyle = `rgba(230, 230, 230, ${0.12 + glowIntensity * 0.12})`;
    this.ctx.beginPath();
    this.ctx.arc(exitPx + this.cellSize / 2, exitPy + this.cellSize / 2, this.cellSize / 4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Draw player character at position
   */
  private drawPlayer(pos: Position): void {
    const px = this.worldToScreenX(pos.x);
    const py = this.worldToScreenY(pos.y);

    // Small, simple marker closer to the reference screenshot.
    this.ctx.fillStyle = '#f8f8f8';
    this.ctx.beginPath();
    this.ctx.arc(px + this.cellSize / 2, py + this.cellSize / 2, this.cellSize / 3.6, 0, Math.PI * 2);
    this.ctx.fill();

    // Add thin border
    this.ctx.strokeStyle = '#666666';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    // Small dot in the center for direction indicator
    this.ctx.fillStyle = '#202020';
    this.ctx.beginPath();
    this.ctx.arc(px + this.cellSize / 2, py + this.cellSize / 2, this.cellSize / 14, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Draw path hint (highlighted cells as a subtle line)
   */
  private drawPathHint(path: Position[]): void {
    if (path.length === 0) return;

    // Draw path as a continuous line (like tracing a route on a map)
    this.ctx.strokeStyle = 'rgba(120, 120, 120, 0.45)';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    
    for (let i = 0; i < path.length; i++) {
      const pos = path[i];
      const px = this.worldToScreenX(pos.x) + this.cellSize / 2;
      const py = this.worldToScreenY(pos.y) + this.cellSize / 2;

      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }
    
    this.ctx.stroke();

    // Subtle waypoints along the path
    for (let i = 0; i < path.length; i += Math.ceil(path.length / 8)) {
      const pos = path[i];
      const px = this.worldToScreenX(pos.x) + this.cellSize / 2;
      const py = this.worldToScreenY(pos.y) + this.cellSize / 2;

      this.ctx.fillStyle = 'rgba(100, 100, 100, 0.24)';
      this.ctx.beginPath();
      this.ctx.arc(px, py, this.cellSize / 6, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private updateLayout(state: GameState): void {
    const signature = `${window.innerWidth}x${window.innerHeight}`;
    const availableWidth = Math.min(Math.max(320, window.innerWidth - 48), 1400);
    const availableHeight = Math.min(Math.max(240, window.innerHeight - 190), 900);

    if (signature !== this.layoutSignature) {
      this.canvas.width = availableWidth;
      this.canvas.height = availableHeight;
      this.canvas.style.width = `${availableWidth}px`;
      this.canvas.style.height = `${availableHeight}px`;
      this.layoutSignature = signature;
    }

    const mazeWidth = state.config.width * this.cellSize;
    const mazeHeight = state.config.height * this.cellSize;
    const playerCenterX = (state.playerPos.x + 0.5) * this.cellSize;
    const playerCenterY = (state.playerPos.y + 0.5) * this.cellSize;

    if (mazeWidth <= this.canvas.width) {
      this.cameraX = -(this.canvas.width - mazeWidth) / 2;
    } else {
      this.cameraX = Math.min(Math.max(playerCenterX - this.canvas.width / 2, 0), mazeWidth - this.canvas.width);
    }

    if (mazeHeight <= this.canvas.height) {
      this.cameraY = -(this.canvas.height - mazeHeight) / 2;
    } else {
      this.cameraY = Math.min(Math.max(playerCenterY - this.canvas.height / 2, 0), mazeHeight - this.canvas.height);
    }
  }

  private worldToScreenX(cellX: number): number {
    return cellX * this.cellSize - this.cameraX;
  }

  private worldToScreenY(cellY: number): number {
    return cellY * this.cellSize - this.cameraY;
  }
}
