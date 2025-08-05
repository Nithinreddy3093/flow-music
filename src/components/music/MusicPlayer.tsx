import { Card } from '@/components/ui/card';
import { CurrentTrack } from './CurrentTrack';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';
import { cn } from '@/lib/utils';

interface MusicPlayerProps {
  className?: string;
}

export const MusicPlayer = ({ className }: MusicPlayerProps) => {
  return (
    <Card className={cn(
      "sticky bottom-0 left-0 right-0 z-50 border-t bg-player-background/95 backdrop-blur-lg",
      className
    )}>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Main Player Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Current Track Info */}
            <div className="lg:col-span-1">
              <CurrentTrack />
            </div>

            {/* Player Controls and Progress */}
            <div className="lg:col-span-1 space-y-4">
              <PlayerControls />
              <ProgressBar />
            </div>

            {/* Additional Controls/Info */}
            <div className="lg:col-span-1 flex justify-end">
              <div className="text-xs text-muted-foreground">
                Design Patterns Demo
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};