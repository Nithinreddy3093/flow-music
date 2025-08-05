// Factory Pattern: Creates appropriate music source adapters
import { MusicSourceAdapter, MusicSource } from '../../types/music';
import { LocalMusicAdapter } from './adapters/LocalMusicAdapter';
import { SpotifyMusicAdapter } from './adapters/SpotifyMusicAdapter';

export class MusicSourceFactory {
  private static adapters: Map<MusicSource, MusicSourceAdapter> = new Map();

  static async getAdapter(source: MusicSource): Promise<MusicSourceAdapter> {
    if (!this.adapters.has(source)) {
      const adapter = this.createAdapter(source);
      await adapter.initialize();
      this.adapters.set(source, adapter);
    }
    
    return this.adapters.get(source)!;
  }

  private static createAdapter(source: MusicSource): MusicSourceAdapter {
    switch (source) {
      case MusicSource.LOCAL:
        return new LocalMusicAdapter();
      case MusicSource.SPOTIFY:
        return new SpotifyMusicAdapter();
      default:
        throw new Error(`Unsupported music source: ${source}`);
    }
  }

  static getSupportedSources(): MusicSource[] {
    return Object.values(MusicSource);
  }
}