import { Slider } from '@/components/ui/slider';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const ProgressBar = () => {
  const { status, seek, progress } = useMusicPlayer();

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * status.duration;
    seek(newTime);
  };

  return (
    <div className="w-full space-y-2">
      <Slider
        value={[progress * 100]}
        onValueChange={handleSeek}
        max={100}
        step={0.1}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(status.currentTime)}</span>
        <span>{formatTime(status.duration)}</span>
      </div>
    </div>
  );
};