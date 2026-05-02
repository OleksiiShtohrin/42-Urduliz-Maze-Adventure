/**
 * InputController: Handles keyboard and mobile input
 */
export class InputController {
  private keysPressed: { [key: string]: boolean } = {};
  private moveCallback?: (dx: number, dy: number) => void;
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchThreshold: number = 30; // pixels for swipe detection

  constructor() {
    this.setupKeyboardListeners();
    this.setupTouchListeners();
  }

  private setupKeyboardListeners(): void {
    document.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (this.keysPressed[key]) return; // Ignore repeated keydown
      
      this.keysPressed[key] = true;
      this.handleKeyboardMovement(key);
    });

    document.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      this.keysPressed[key] = false;
    });
  }

  private handleKeyboardMovement(key: string): void {
    if (!this.moveCallback) return;

    // Arrow keys or WASD
    if (key === 'arrowup' || key === 'w') this.moveCallback(0, -1);
    if (key === 'arrowdown' || key === 's') this.moveCallback(0, 1);
    if (key === 'arrowleft' || key === 'a') this.moveCallback(-1, 0);
    if (key === 'arrowright' || key === 'd') this.moveCallback(1, 0);
  }

  private setupTouchListeners(): void {
    // Touch swipe detection for mobile
    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    });

    document.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;

      const deltaX = endX - this.touchStartX;
      const deltaY = endY - this.touchStartY;

      // Determine swipe direction
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (Math.max(absDeltaX, absDeltaY) > this.touchThreshold) {
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0) this.moveCallback?.(1, 0); // Right
          else this.moveCallback?.(-1, 0); // Left
        } else {
          // Vertical swipe
          if (deltaY > 0) this.moveCallback?.(0, 1); // Down
          else this.moveCallback?.(0, -1); // Up
        }
      }
    });
  }

  public setMoveCallback(callback: (dx: number, dy: number) => void): void {
    this.moveCallback = callback;
  }
}
