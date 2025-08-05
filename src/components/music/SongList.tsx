import { Play, Pause, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Song } from '@/types/music';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { cn } from '@/lib/utils';

interface SongListProps {
  songs: Song[];
  onSongSelect?: (song: Song, index: number) => void;
  showQueue?: boolean;
  className?: string;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const SongList = ({ 
  songs, 
  onSongSelect, 
  showQueue = false,
  className 
}: SongListProps) => {
  const { status, play, pause, setQueue, isPlaying } = useMusicPlayer();

  const handleSongClick = async (song: Song, index: number) => {
    if (onSongSelect) {
      onSongSelect(song, index);
    } else {
      // Set the queue with all songs and play the selected one
      setQueue(songs, index);
      await play(song);
    }
  };

  const handlePlayPause = async (song: Song, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const isCurrentSong = status.currentSong?.id === song.id;
    
    if (isCurrentSong && isPlaying) {
      await pause();
    } else {
      if (!isCurrentSong) {
        setQueue(songs, index);
      }
      await play(song);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {songs.map((song, index) => {
        const isCurrentSong = status.currentSong?.id === song.id;
        const isCurrentlyPlaying = isCurrentSong && isPlaying;

        return (
          <Card
            key={song.id}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 hover:bg-player-surface-hover",
              isCurrentSong && "bg-player-surface border-primary/30"
            )}
            onClick={() => handleSongClick(song, index)}
          >
            <div className="flex items-center space-x-4">
              {/* Play/Pause Button */}
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 rounded-full flex-shrink-0"
                onClick={(e) => handlePlayPause(song, index, e)}
              >
                {isCurrentlyPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>

              {/* Album Cover */}
              <div className="w-12 h-12 flex-shrink-0">
                {song.coverUrl ? (
                  <img
                    src={song.coverUrl}
                    alt={`${song.album} cover`}
                    className="w-full h-full rounded object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                    <Music className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <h4 className={cn(
                  "font-medium truncate",
                  isCurrentSong ? "text-primary" : "text-foreground"
                )}>
                  {song.title}
                </h4>
                <p className="text-sm text-muted-foreground truncate">
                  {song.artist} • {song.album}
                </p>
              </div>

              {/* Duration and Source */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Badge variant="outline" className="text-xs">
                  {song.source.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {formatDuration(song.duration)}
                </span>
              </div>

              {/* Playing Indicator */}
              {isCurrentlyPlaying && (
                <div className="flex-shrink-0">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-4 bg-primary rounded-full animate-pulse"
                        style={{
                          animationDelay: `${i * 0.2}s`,
                          animationDuration: '1s'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      })}

      {songs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No songs available</p>
        </div>
      )}
    </div>
  );
};