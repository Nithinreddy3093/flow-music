// Strategy Pattern: Spotify mock adapter
import { MusicSourceAdapter, Song, MusicSource } from '../../../types/music';

export class SpotifyMusicAdapter implements MusicSourceAdapter {
  private isInitialized = false;
  private currentSong: Song | null = null;
  private mockAudioElement: HTMLAudioElement | null = null;
  private progressInterval: NodeJS.Timeout | null = null;

  async initialize(): Promise<void> {
    // Mock Spotify SDK initialization
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isInitialized = true;
        console.log('Spotify adapter initialized (mock)');
        resolve();
      }, 1000);
    });
  }

  async play(song: Song): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Spotify adapter not initialized');
    }

    if (!this.isSupported(song)) {
      throw new Error('Song not supported by Spotify adapter');
    }

    try {
      // Mock Spotify playback - in reality this would use Spotify Web API
      console.log(`Playing Spotify track: ${song.title} by ${song.artist}`);
      
      // Create a mock audio element for demonstration
      if (this.mockAudioElement) {
        this.mockAudioElement.pause();
        this.mockAudioElement.remove();
      }

      // Use a demo audio file for Spotify mock
      this.mockAudioElement = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      this.currentSong = song;
      
      // Add error handling for mock audio
      this.mockAudioElement.onerror = (e) => {
        console.error('Mock Spotify audio error:', e);
      };
      
      // Start mock audio playback
      try {
        await this.mockAudioElement.play();
        console.log('Mock Spotify playback started');
      } catch (error) {
        console.log('Mock Spotify playback failed, continuing with mock timer:', error);
      }
      
      // Mock the playback progress
      this.startMockPlayback();
      
    } catch (error) {
      throw new Error(`Failed to play Spotify track: ${error}`);
    }
  }

  private startMockPlayback(): void {
    // Mock progress updates
    let currentTime = 0;
    this.progressInterval = setInterval(() => {
      currentTime += 1;
      // This would emit progress events in real implementation
    }, 1000);
  }

  async pause(): Promise<void> {
    console.log('Pausing Spotify playback (mock)');
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.mockAudioElement) {
      this.mockAudioElement.pause();
    }
  }

  async resume(): Promise<void> {
    console.log('Resuming Spotify playback (mock)');
    this.startMockPlayback();
    if (this.mockAudioElement) {
      await this.mockAudioElement.play().catch(() => {
        // Ignore errors for mock audio
      });
    }
  }

  async stop(): Promise<void> {
    console.log('Stopping Spotify playback (mock)');
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.mockAudioElement) {
      this.mockAudioElement.pause();
      this.mockAudioElement.currentTime = 0;
    }
  }

  async setVolume(volume: number): Promise<void> {
    console.log(`Setting Spotify volume to ${volume} (mock)`);
    if (this.mockAudioElement) {
      this.mockAudioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  async seek(time: number): Promise<void> {
    console.log(`Seeking Spotify track to ${time}s (mock)`);
    if (this.mockAudioElement) {
      this.mockAudioElement.currentTime = time;
    }
  }

  getCurrentTime(): number {
    return this.mockAudioElement?.currentTime || 0;
  }

  getDuration(): number {
    return this.currentSong?.duration || 0;
  }

  isSupported(song: Song): boolean {
    return song.source === MusicSource.SPOTIFY;
  }
}