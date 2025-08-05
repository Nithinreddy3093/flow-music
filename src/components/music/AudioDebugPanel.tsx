import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { AudioContextManager } from '@/services/music/AudioContextManager';

export const AudioDebugPanel = () => {
  const { status } = useMusicPlayer();
  const [audioContextState, setAudioContextState] = useState<string>('unknown');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    const updateAudioState = () => {
      const manager = AudioContextManager.getInstance();
      const context = manager.getAudioContext();
      setAudioContextState(context?.state || 'not-initialized');
      setIsAudioEnabled(manager.isAudioEnabled());
    };

    updateAudioState();
    const interval = setInterval(updateAudioState, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEnableAudio = async () => {
    try {
      const manager = AudioContextManager.getInstance();
      await manager.enableAudio();
      setIsAudioEnabled(true);
    } catch (error) {
      console.error('Failed to enable audio:', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-sm">Audio Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs">Audio Context:</span>
          <Badge variant={audioContextState === 'running' ? 'default' : 'destructive'}>
            {audioContextState}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs">Audio Enabled:</span>
          <Badge variant={isAudioEnabled ? 'default' : 'destructive'}>
            {isAudioEnabled ? 'Yes' : 'No'}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs">Player State:</span>
          <Badge variant="outline">{status.state}</Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs">Current Song:</span>
          <span className="text-xs truncate max-w-[120px]">
            {status.currentSong?.title || 'None'}
          </span>
        </div>
        
        {!isAudioEnabled && (
          <Button size="sm" onClick={handleEnableAudio} className="w-full">
            Enable Audio
          </Button>
        )}
      </CardContent>
    </Card>
  );
};