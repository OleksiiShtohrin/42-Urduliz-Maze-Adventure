import { GameState } from '../core/types';

/**
 * UILayer: Manages menu and HUD interactions
 */
export class UILayer {
  private onStartGame?: (seed: number, width: number, height: number, perfectMode: boolean) => void;
  private onBackToMenu?: () => void;
  private onCopySeed?: (seed: number) => void;
  private onPathHint?: () => void;
  private copyFeedbackTimer?: number;

  constructor() {
    this.setupMenuListener();
    this.setupGameHUDListeners();
  }

  private setupMenuListener(): void {
    const startBtn = document.getElementById('start-btn');
    const seedInput = document.getElementById('seed') as HTMLInputElement;
    const widthInput = document.getElementById('width') as HTMLInputElement;
    const heightInput = document.getElementById('height') as HTMLInputElement;
    const perfectModeInput = document.getElementById('perfect-mode') as HTMLInputElement;
    const pasteSeedBtn = document.getElementById('paste-seed');

    startBtn?.addEventListener('click', () => {
      let seed = seedInput.value ? parseInt(seedInput.value) : Math.floor(Math.random() * 1000000);
      const width = Math.max(15, Math.min(50, parseInt(widthInput.value) || 25));
      const height = Math.max(15, Math.min(50, parseInt(heightInput.value) || 25));
      const perfectMode = perfectModeInput ? perfectModeInput.checked : true;

      this.onStartGame?.(seed, width, height, perfectMode);
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
      const seedText = seedSpan?.textContent?.trim();
      if (seedText) {
        const defaultLabel = copySeedBtn.dataset.defaultLabel || copySeedBtn.textContent || 'Copy';
        copySeedBtn.dataset.defaultLabel = defaultLabel;

        const finishCopyFeedback = (): void => {
          if (this.copyFeedbackTimer) {
            window.clearTimeout(this.copyFeedbackTimer);
          }

          copySeedBtn.textContent = 'Copied!';
          this.copyFeedbackTimer = window.setTimeout(() => {
            copySeedBtn.textContent = defaultLabel;
          }, 1200);
        };

        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(seedText).then(finishCopyFeedback).catch(async () => {
            if (this.copyWithFallback(seedText)) {
              finishCopyFeedback();
            }
          });
        } else {
          if (this.copyWithFallback(seedText)) {
            finishCopyFeedback();
          }
        }
      }
    });

    hintBtn?.addEventListener('click', () => {
      this.onPathHint?.();
    });
  }

  public showMenu(): void {
    const menu = document.getElementById('menu');
    const gameContainer = document.getElementById('game-container');
    if (menu) menu.style.display = 'grid';
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

  public setPathHintActive(active: boolean): void {
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
      hintBtn.textContent = active ? 'Hide Path' : 'Path Hint';
    }
  }

  public setStartGameCallback(callback: (seed: number, width: number, height: number, perfectMode: boolean) => void): void {
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

  private copyWithFallback(text: string): boolean {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(textarea);
    return copied;
  }
}
