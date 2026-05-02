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
      const width = parseInt(widthInput.value) || 25;
      const height = parseInt(heightInput.value) || 25;

      this.onStartGame?.(seed, width, height);
    });

    pasteSeedBtn?.addEventListener('click', async () => {
      const text = await navigator.clipboard.readText();
      seedInput.value = text;
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
      if (seedSpan) {
        navigator.clipboard.writeText(seedSpan.textContent || '');
      }
    });

    hintBtn?.addEventListener('click', () => {
      this.onPathHint?.();
    });
  }

  public showMenu(): void {
    document.getElementById('menu')!.style.display = 'block';
    document.getElementById('game-container')!.style.display = 'none';
  }

  public showGame(): void {
    document.getElementById('menu')!.style.display = 'none';
    document.getElementById('game-container')!.style.display = 'flex';
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
