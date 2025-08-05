// Core types for the music player
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl?: string;
  url: string;
  source: MusicSource;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  coverUrl?: string;
}

export enum PlaybackState {
  STOPPED = 'stopped',
  PLAYING = 'playing',
  PAUSED = 'paused',
  LOADING = 'loading'
}

export enum RepeatMode {
  NONE = 'none',
  ONE = 'one',
  ALL = 'all'
}

export enum MusicSource {
  LOCAL = 'local',
  SPOTIFY = 'spotify'
}

export interface PlaybackStatus {
  currentSong: Song | null;
  state: PlaybackState;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  queue: Song[];
  currentIndex: number;
}

export interface MusicSourceAdapter {
  initialize(): Promise<void>;
  play(song: Song): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  stop(): Promise<void>;
  setVolume(volume: number): Promise<void>;
  seek(time: number): Promise<void>;
  getCurrentTime(): number;
  getDuration(): number;
  isSupported(song: Song): boolean;
}

export interface PlayerObserver {
  onStateChange(status: PlaybackStatus): void;
  onProgress(currentTime: number, duration: number): void;
  onError(error: string): void;
}