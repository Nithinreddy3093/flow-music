// Audio Context Manager for handling browser autoplay policies
export class AudioContextManager {
  private static instance: AudioContextManager;
  private audioContext: AudioContext | null = null;
  private isUserInteracted = false;

  private constructor() {
    // Listen for user interaction to enable audio context
    this.addUserInteractionListeners();
  }

  static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager();
    }
    return AudioContextManager.instance;
  }

  private addUserInteractionListeners(): void {
    const enableAudio = () => {
      if (!this.isUserInteracted) {
        this.initializeAudioContext();
        this.isUserInteracted = true;
        console.log('Audio enabled after user interaction');
      }
    };

    // Listen for various user interactions
    ['click', 'touchstart', 'keydown'].forEach(event => {
      document.addEventListener(event, enableAudio, { once: true });
    });
  }

  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    } catch (error) {
      console.warn('AudioContext not supported:', error);
    }
  }

  async enableAudio(): Promise<void> {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.isUserInteracted = true;
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  isAudioEnabled(): boolean {
    return this.isUserInteracted && this.audioContext?.state === 'running';
  }
}