import { GameState } from '../core/types';

/**
 * UILayer: Manages menu and HUD interactions
 */
export class UILayer {
  private onStartGame?: (seed: number, width: number, height: number) => void;
  private onBackToMenu?: () => void;
  private onCopySeed?: (seed: number) => void;
  private onPathHint?: () => void;

  constructor() {
    this.setupMenuListener();
    this.setupGameHUDListeners();
  }

  private setupMenuListener(): void {
    const startBtn = document.getElementById('start-btn');
    const seedInput = document.getElementById('seed') as HTMLInputElement;
    const widthInput = document.getElementById('width') as HTMLInputElement;
    const heightInput = document.getElementById('height') as HTMLInputElement;
    const pasteSeedBtn = document.getElementById('paste-seed');

    startBtn?.addEventListener('click', () => {
      let seed = seedInput.value ? parseInt(seedInput.value) : Math.floor(Math.random() * 1000000);
      const width = Math.max(15, Math.min(50, parseInt(widthInput.value) || 25));
      const height = Math.max(15, Math.min(50, parseInt(heightInput.value) || 25));

      this.onStartGame?.(seed, width, height);
    });

    pasteSeedBtn?.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        seedInput.value = text;
      } catch (err) {
        console.error('Failed to read clipboard:', err);
      }
    });
  }

  private setupGameHUDListeners(): void {
    const backBtn = document.getElementById('back-btn');
    const copySeedBtn = document.getElementById('copy-seed');
    const hintBtn = document.getElementById('hint-btn');

    backBtn?.addEventListener('click', () => {
      this.onBackToMenu?.();
    });

    copySeedBtn?.addEventListener('click', () => {
      const seedSpan = document.getElementById('seed-value');
      if (seedSpan && seedSpan.textContent) {
        navigator.clipboard.writeText(seedSpan.textContent).then(() => {
          // Optional: show feedback
          const originalText = copySeedBtn.textContent;
          copySeedBtn.textContent = 'Copied!';
          setTimeout(() => {
            copySeedBtn.textContent = originalText;
          }, 1500);
        });
      }
    });

    hintBtn?.addEventListener('click', () => {
      this.onPathHint?.();
    });
  }

  public showMenu(): void {
    const menu = document.getElementById('menu');
    const gameContainer = document.getElementById('game-container');
    if (menu) menu.style.display = 'block';
    if (gameContainer) gameContainer.style.display = 'none';
  }

  public showGame(): void {
    const menu = document.getElementById('menu');
    const gameContainer = document.getElementById('game-container');
    if (menu) menu.style.display = 'none';
    if (gameContainer) gameContainer.style.display = 'flex';
  }

  public updateSeedDisplay(seed: number): void {
    const seedSpan = document.getElementById('seed-value');
    if (seedSpan) {
      seedSpan.textContent = seed.toString();
    }
  }

  public setStartGameCallback(callback: (seed: number, width: number, height: number) => void): void {
    this.onStartGame = callback;
  }

  public setBackToMenuCallback(callback: () => void): void {
    this.onBackToMenu = callback;
  }

  public setPathHintCallback(callback: () => void): void {
    this.onPathHint = callback;
  }

  public setCopySeedCallback(callback: (seed: number) => void): void {
    this.onCopySeed = callback;
  }
}
