// Singleton Pattern: Main music player service with Observer Pattern for notifications
import { 
  Song, 
  PlaybackState, 
  PlaybackStatus, 
  RepeatMode, 
  PlayerObserver,
  MusicSourceAdapter 
} from '../../types/music';
import { MusicSourceFactory } from './MusicSourceFactory';

export class MusicPlayerService {
  private static instance: MusicPlayerService;
  private observers: PlayerObserver[] = [];
  private currentAdapter: MusicSourceAdapter | null = null;
  private progressInterval: NodeJS.Timeout | null = null;
  
  private status: PlaybackStatus = {
    currentSong: null,
    state: PlaybackState.STOPPED,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    repeatMode: RepeatMode.NONE,
    isShuffled: false,
    queue: [],
    currentIndex: -1
  };

  private constructor() {
    this.startProgressTracking();
  }

  // Singleton Pattern
  static getInstance(): MusicPlayerService {
    if (!MusicPlayerService.instance) {
      MusicPlayerService.instance = new MusicPlayerService();
    }
    return MusicPlayerService.instance;
  }

  // Observer Pattern
  addObserver(observer: PlayerObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: PlayerObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  private notifyObservers(): void {
    this.observers.forEach(observer => {
      observer.onStateChange(this.status);
    });
  }

  private notifyProgress(): void {
    this.observers.forEach(observer => {
      observer.onProgress(this.status.currentTime, this.status.duration);
    });
  }

  private notifyError(error: string): void {
    this.observers.forEach(observer => {
      observer.onError(error);
    });
  }

  private startProgressTracking(): void {
    this.progressInterval = setInterval(() => {
      if (this.currentAdapter && this.status.state === PlaybackState.PLAYING) {
        this.status.currentTime = this.currentAdapter.getCurrentTime();
        this.status.duration = this.currentAdapter.getDuration();
        this.notifyProgress();

        // Auto-advance to next song
        if (this.status.currentTime >= this.status.duration && this.status.duration > 0) {
          this.next();
        }
      }
    }, 1000);
  }

  // Command Pattern: Playback controls
  async play(song?: Song): Promise<void> {
    try {
      if (song) {
        await this.loadSong(song);
      }

      if (!this.currentAdapter || !this.status.currentSong) {
        throw new Error('No song loaded');
      }

      if (this.status.state === PlaybackState.PAUSED) {
        await this.currentAdapter.resume();
      } else {
        await this.currentAdapter.play(this.status.currentSong);
      }

      this.status.state = PlaybackState.PLAYING;
      this.notifyObservers();
    } catch (error) {
      this.notifyError(`Failed to play: ${error}`);
    }
  }

  async pause(): Promise<void> {
    try {
      if (this.currentAdapter && this.status.state === PlaybackState.PLAYING) {
        await this.currentAdapter.pause();
        this.status.state = PlaybackState.PAUSED;
        this.notifyObservers();
      }
    } catch (error) {
      this.notifyError(`Failed to pause: ${error}`);
    }
  }

  async stop(): Promise<void> {
    try {
      if (this.currentAdapter) {
        await this.currentAdapter.stop();
        this.status.state = PlaybackState.STOPPED;
        this.status.currentTime = 0;
        this.notifyObservers();
      }
    } catch (error) {
      this.notifyError(`Failed to stop: ${error}`);
    }
  }

  async next(): Promise<void> {
    if (this.status.queue.length === 0) return;

    let nextIndex = this.status.currentIndex + 1;
    
    if (this.status.repeatMode === RepeatMode.ONE) {
      nextIndex = this.status.currentIndex;
    } else if (nextIndex >= this.status.queue.length) {
      if (this.status.repeatMode === RepeatMode.ALL) {
        nextIndex = 0;
      } else {
        await this.stop();
        return;
      }
    }

    this.status.currentIndex = nextIndex;
    await this.play(this.status.queue[nextIndex]);
  }

  async previous(): Promise<void> {
    if (this.status.queue.length === 0) return;

    // If we're more than 3 seconds into the song, restart it
    if (this.status.currentTime > 3) {
      await this.seek(0);
      return;
    }

    let prevIndex = this.status.currentIndex - 1;
    
    if (prevIndex < 0) {
      if (this.status.repeatMode === RepeatMode.ALL) {
        prevIndex = this.status.queue.length - 1;
      } else {
        prevIndex = 0;
      }
    }

    this.status.currentIndex = prevIndex;
    await this.play(this.status.queue[prevIndex]);
  }

  async seek(time: number): Promise<void> {
    try {
      if (this.currentAdapter) {
        await this.currentAdapter.seek(time);
        this.status.currentTime = time;
        this.notifyObservers();
      }
    } catch (error) {
      this.notifyError(`Failed to seek: ${error}`);
    }
  }

  async setVolume(volume: number): Promise<void> {
    try {
      const normalizedVolume = Math.max(0, Math.min(1, volume));
      this.status.volume = normalizedVolume;
      
      if (this.currentAdapter) {
        await this.currentAdapter.setVolume(normalizedVolume);
      }
      
      this.notifyObservers();
    } catch (error) {
      this.notifyError(`Failed to set volume: ${error}`);
    }
  }

  toggleMute(): void {
    this.status.isMuted = !this.status.isMuted;
    const volume = this.status.isMuted ? 0 : this.status.volume;
    this.setVolume(volume);
  }

  setRepeatMode(mode: RepeatMode): void {
    this.status.repeatMode = mode;
    this.notifyObservers();
  }

  toggleShuffle(): void {
    this.status.isShuffled = !this.status.isShuffled;
    if (this.status.isShuffled) {
      this.shuffleQueue();
    }
    this.notifyObservers();
  }

  // Queue management
  setQueue(songs: Song[], startIndex: number = 0): void {
    this.status.queue = [...songs];
    this.status.currentIndex = startIndex;
    this.notifyObservers();
  }

  addToQueue(song: Song): void {
    this.status.queue.push(song);
    this.notifyObservers();
  }

  removeFromQueue(index: number): void {
    if (index >= 0 && index < this.status.queue.length) {
      this.status.queue.splice(index, 1);
      
      // Adjust current index if necessary
      if (index <= this.status.currentIndex && this.status.currentIndex > 0) {
        this.status.currentIndex--;
      }
      
      this.notifyObservers();
    }
  }

  private shuffleQueue(): void {
    const currentSong = this.status.queue[this.status.currentIndex];
    const remainingSongs = [...this.status.queue];
    
    // Remove current song from shuffle
    if (this.status.currentIndex >= 0) {
      remainingSongs.splice(this.status.currentIndex, 1);
    }
    
    // Shuffle remaining songs
    for (let i = remainingSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingSongs[i], remainingSongs[j]] = [remainingSongs[j], remainingSongs[i]];
    }
    
    // Reconstruct queue with current song at the beginning
    if (currentSong) {
      this.status.queue = [currentSong, ...remainingSongs];
      this.status.currentIndex = 0;
    } else {
      this.status.queue = remainingSongs;
    }
  }

  private async loadSong(song: Song): Promise<void> {
    this.status.state = PlaybackState.LOADING;
    this.notifyObservers();

    try {
      this.currentAdapter = await MusicSourceFactory.getAdapter(song.source);
      this.status.currentSong = song;
      this.status.currentTime = 0;
      this.status.duration = song.duration;
    } catch (error) {
      this.status.state = PlaybackState.STOPPED;
      throw error;
    }
  }

  getStatus(): PlaybackStatus {
    return { ...this.status };
  }

  destroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    this.observers = [];
    this.currentAdapter = null;
  }
}