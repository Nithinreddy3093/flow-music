import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const CurrentTrack = () => {
  const { status, isPlaying } = useMusicPlayer();

  if (!status.currentSong) {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-player-surface rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 bg-muted rounded opacity-50" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-muted rounded w-32 mb-2 opacity-50" />
          <div className="h-3 bg-muted rounded w-24 opacity-30" />
        </div>
      </div>
    );
  }

  const { currentSong } = status;

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <img
          src={currentSong.coverUrl || '/placeholder.svg'}
          alt={`${currentSong.album} cover`}
          className={cn(
            "w-16 h-16 rounded-lg object-cover transition-all duration-300",
            isPlaying && "animate-pulse-glow"
          )}
        />
        {isPlaying && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-transparent animate-pulse" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">
          {currentSong.title}
        </h3>
        <p className="text-sm text-muted-foreground truncate">
          {currentSong.artist}
        </p>
        <div className="flex items-center space-x-2 mt-1">
          <Badge 
            variant="secondary" 
            className="text-xs"
          >
            {currentSong.source.toUpperCase()}
          </Badge>
        </div>
      </div>
    </div>
  );
};