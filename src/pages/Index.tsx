import { LibraryBrowser } from '@/components/music/LibraryBrowser';
import { MusicPlayer } from '@/components/music/MusicPlayer';
import { Queue } from '@/components/music/Queue';
import { AudioDebugPanel } from '@/components/music/AudioDebugPanel';

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-player-background to-player-surface border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-4">
              Design Patterns Music Player
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive music player demonstrating Singleton, Factory, Strategy, and Observer patterns 
              with support for multiple music sources and real-time state management.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Library Browser */}
          <div className="lg:col-span-2">
            <LibraryBrowser />
          </div>

          {/* Queue */}
          <div className="lg:col-span-1 space-y-6">
            <Queue />
            <AudioDebugPanel />
          </div>
        </div>
      </div>

      {/* Music Player */}
      <MusicPlayer />
    </div>
  );
};

export default Index;
