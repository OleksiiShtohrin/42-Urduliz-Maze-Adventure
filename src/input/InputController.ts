/**
 * InputController: Handles keyboard and mobile input
 */
export class InputController {
  private keysPressed: { [key: string]: boolean } = {};
  private moveCallback?: (dx: number, dy: number) => void;

  constructor() {
    this.setupKeyboardListeners();
    this.setupMobileListeners();
  }

  private setupKeyboardListeners(): void {
    document.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      this.keysPressed[key] = true;

      // Emit movement immediately for responsive feel
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

  private setupMobileListeners(): void {
    // TODO: Implement touch joystick or button controls for mobile
    // Options:
    // 1. Arrow buttons on screen
    // 2. Virtual joystick
    // 3. Swipe detection
  }

  public setMoveCallback(callback: (dx: number, dy: number) => void): void {
    this.moveCallback = callback;
  }
}
