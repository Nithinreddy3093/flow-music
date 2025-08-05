import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Repeat1,
  Shuffle, 
  Volume2,
  VolumeX,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { RepeatMode } from '@/types/music';
import { cn } from '@/lib/utils';

export const PlayerControls = () => {
  const { 
    status,
    togglePlayPause,
    previous,
    next,
    setRepeatMode,
    toggleShuffle,
    setVolume,
    toggleMute,
    isPlaying,
    isPaused,
    isLoading
  } = useMusicPlayer();

  const getRepeatIcon = () => {
    switch (status.repeatMode) {
      case RepeatMode.ONE:
        return <Repeat1 className="w-4 h-4" />;
      case RepeatMode.ALL:
        return <Repeat className="w-4 h-4" />;
      default:
        return <Repeat className="w-4 h-4" />;
    }
  };

  const cycleRepeatMode = () => {
    const modes = [RepeatMode.NONE, RepeatMode.ALL, RepeatMode.ONE];
    const currentIndex = modes.indexOf(status.repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto space-x-4">
      {/* Secondary Controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleShuffle}
          className={cn(
            "transition-colors",
            status.isShuffled ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Shuffle className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={cycleRepeatMode}
          className={cn(
            "transition-colors",
            status.repeatMode !== RepeatMode.NONE ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {getRepeatIcon()}
        </Button>
      </div>

      {/* Main Controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={previous}
          disabled={!status.currentSong}
          className="text-foreground hover:text-primary"
        >
          <SkipBack className="w-5 h-5" />
        </Button>

        <Button
          onClick={togglePlayPause}
          disabled={!status.currentSong || isLoading}
          className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={next}
          disabled={!status.currentSong}
          className="text-foreground hover:text-primary"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2 min-w-[100px]">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="text-muted-foreground hover:text-foreground"
        >
          {status.isMuted || status.volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>

        <Slider
          value={[status.isMuted ? 0 : status.volume * 100]}
          onValueChange={(value) => setVolume(value[0] / 100)}
          max={100}
          step={1}
          className="w-16"
        />
      </div>
    </div>
  );
};