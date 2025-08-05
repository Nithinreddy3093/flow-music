// React hook for music player integration
import { useState, useEffect, useCallback } from 'react';
import { MusicPlayerService } from '../services/music/MusicPlayerService';
import { 
  Song, 
  PlaybackStatus, 
  RepeatMode, 
  PlayerObserver, 
  PlaybackState 
} from '../types/music';

export const useMusicPlayer = () => {
  const [status, setStatus] = useState<PlaybackStatus>(() => 
    MusicPlayerService.getInstance().getStatus()
  );
  const [error, setError] = useState<string | null>(null);

  const player = MusicPlayerService.getInstance();

  useEffect(() => {
    const observer: PlayerObserver = {
      onStateChange: (newStatus: PlaybackStatus) => {
        setStatus(newStatus);
      },
      onProgress: (currentTime: number, duration: number) => {
        setStatus(prev => ({
          ...prev,
          currentTime,
          duration
        }));
      },
      onError: (errorMessage: string) => {
        setError(errorMessage);
      }
    };

    player.addObserver(observer);

    return () => {
      player.removeObserver(observer);
    };
  }, [player]);

  const play = useCallback(async (song?: Song) => {
    setError(null);
    await player.play(song);
  }, [player]);

  const pause = useCallback(async () => {
    await player.pause();
  }, [player]);

  const stop = useCallback(async () => {
    await player.stop();
  }, [player]);

  const next = useCallback(async () => {
    await player.next();
  }, [player]);

  const previous = useCallback(async () => {
    await player.previous();
  }, [player]);

  const seek = useCallback(async (time: number) => {
    await player.seek(time);
  }, [player]);

  const setVolume = useCallback(async (volume: number) => {
    await player.setVolume(volume);
  }, [player]);

  const toggleMute = useCallback(() => {
    player.toggleMute();
  }, [player]);

  const setRepeatMode = useCallback((mode: RepeatMode) => {
    player.setRepeatMode(mode);
  }, [player]);

  const toggleShuffle = useCallback(() => {
    player.toggleShuffle();
  }, [player]);

  const setQueue = useCallback((songs: Song[], startIndex: number = 0) => {
    player.setQueue(songs, startIndex);
  }, [player]);

  const addToQueue = useCallback((song: Song) => {
    player.addToQueue(song);
  }, [player]);

  const removeFromQueue = useCallback((index: number) => {
    player.removeFromQueue(index);
  }, [player]);

  const togglePlayPause = useCallback(async () => {
    if (status.state === PlaybackState.PLAYING) {
      await pause();
    } else {
      await play();
    }
  }, [status.state, play, pause]);

  return {
    // State
    status,
    error,
    
    // Actions
    play,
    pause,
    stop,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    setRepeatMode,
    toggleShuffle,
    setQueue,
    addToQueue,
    removeFromQueue,
    togglePlayPause,
    
    // Computed
    isPlaying: status.state === PlaybackState.PLAYING,
    isPaused: status.state === PlaybackState.PAUSED,
    isLoading: status.state === PlaybackState.LOADING,
    progress: status.duration > 0 ? status.currentTime / status.duration : 0,
  };
};