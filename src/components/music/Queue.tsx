import { X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { cn } from '@/lib/utils';

export const Queue = () => {
  const { status, removeFromQueue, play } = useMusicPlayer();

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSongClick = async (index: number) => {
    const song = status.queue[index];
    if (song) {
      await play(song);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Queue</CardTitle>
        <p className="text-sm text-muted-foreground">
          {status.queue.length} songs
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-4">
            {status.queue.map((song, index) => {
              const isCurrentSong = index === status.currentIndex;
              
              return (
                <div
                  key={`${song.id}-${index}`}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors group hover:bg-player-surface",
                    isCurrentSong && "bg-player-surface border border-primary/30"
                  )}
                  onClick={() => handleSongClick(index)}
                >
                  {/* Drag Handle */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className={cn(
                        "font-medium text-sm truncate",
                        isCurrentSong ? "text-primary" : "text-foreground"
                      )}>
                        {song.title}
                      </h4>
                      {isCurrentSong && (
                        <Badge variant="default" className="text-xs px-2 py-0">
                          Playing
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {song.artist}
                    </p>
                  </div>

                  {/* Duration */}
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {formatDuration(song.duration)}
                  </span>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromQueue(index);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              );
            })}

            {status.queue.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Queue is empty</p>
                <p className="text-xs mt-1">Add songs to start playing</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};