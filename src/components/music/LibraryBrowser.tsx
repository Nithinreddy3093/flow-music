import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Plus } from 'lucide-react';
import { SongList } from './SongList';
import { mockSongs, mockPlaylists } from '@/data/mockSongs';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { Song } from '@/types/music';

export const LibraryBrowser = () => {
  const [activeTab, setActiveTab] = useState('songs');
  const { setQueue, addToQueue, play } = useMusicPlayer();

  const handlePlayPlaylist = async (songs: Song[]) => {
    setQueue(songs, 0);
    if (songs.length > 0) {
      await play(songs[0]);
    }
  };

  const handleAddToQueue = (song: Song) => {
    addToQueue(song);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Music Library</h2>
        <p className="text-muted-foreground">
          Explore your music collection from different sources
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="songs">All Songs</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>

        <TabsContent value="songs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">All Songs ({mockSongs.length})</h3>
            <Button 
              onClick={() => handlePlayPlaylist(mockSongs)}
              className="bg-primary hover:bg-primary/90"
            >
              <Play className="w-4 h-4 mr-2" />
              Play All
            </Button>
          </div>
          <SongList songs={mockSongs} />
        </TabsContent>

        <TabsContent value="playlists" className="space-y-4">
          <h3 className="text-lg font-semibold">Playlists</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockPlaylists.map((playlist) => (
              <Card key={playlist.id} className="hover:bg-player-surface transition-colors">
                <CardHeader className="pb-4">
                  <div className="aspect-square rounded-lg overflow-hidden mb-4">
                    <img
                      src={playlist.coverUrl || '/placeholder.svg'}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-lg">{playlist.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {playlist.songs.length} songs
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handlePlayPlaylist(playlist.songs)}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => playlist.songs.forEach(addToQueue)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};