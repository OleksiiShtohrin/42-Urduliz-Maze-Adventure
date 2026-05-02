/**
 * Entry point for the whole application
 */

// Import Game class
import { Game } from './game/Game';

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.start();
  });
} else {
  const game = new Game();
  game.start();
}
