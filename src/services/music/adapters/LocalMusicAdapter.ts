// Strategy Pattern: Local files music adapter
import { MusicSourceAdapter, Song, MusicSource } from '../../../types/music';
import { AudioContextManager } from '../AudioContextManager';

export class LocalMusicAdapter implements MusicSourceAdapter {
  private audioElement: HTMLAudioElement | null = null;
  private currentSong: Song | null = null;

  async initialize(): Promise<void> {
    // Initialize audio context for better browser compatibility
    const audioManager = AudioContextManager.getInstance();
    await audioManager.enableAudio();
    console.log('Local music adapter initialized with audio context');
  }

  async play(song: Song): Promise<void> {
    if (!this.isSupported(song)) {
      throw new Error('Song not supported by local adapter');
    }

    try {
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.remove();
      }

      console.log(`Loading audio: ${song.url}`);
      this.audioElement = new Audio(song.url);
      this.currentSong = song;
      
      // Configure audio element
      this.audioElement.preload = 'metadata';
      this.audioElement.crossOrigin = 'anonymous';
      
      // Add error handling
      this.audioElement.onerror = (e) => {
        console.error('Audio load error:', e);
        throw new Error(`Failed to load audio: ${song.url}`);
      };
      
      this.audioElement.onloadstart = () => {
        console.log('Audio loading started');
      };
      
      this.audioElement.oncanplay = () => {
        console.log('Audio can play');
      };
      
      // Ensure audio context is enabled
      const audioManager = AudioContextManager.getInstance();
      await audioManager.enableAudio();
      
      // Attempt to play with user interaction handling
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      
      console.log('Audio playback started successfully');
    } catch (error) {
      console.error('Audio playback error:', error);
      throw new Error(`Failed to play local file: ${error}`);
    }
  }

  async pause(): Promise<void> {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  async resume(): Promise<void> {
    if (this.audioElement) {
      await this.audioElement.play();
    }
  }

  async stop(): Promise<void> {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
  }

  async setVolume(volume: number): Promise<void> {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  async seek(time: number): Promise<void> {
    if (this.audioElement) {
      this.audioElement.currentTime = time;
    }
  }

  getCurrentTime(): number {
    return this.audioElement?.currentTime || 0;
  }

  getDuration(): number {
    return this.audioElement?.duration || 0;
  }

  isSupported(song: Song): boolean {
    return song.source === MusicSource.LOCAL;
  }

  getAudioElement(): HTMLAudioElement | null {
    return this.audioElement;
  }
}