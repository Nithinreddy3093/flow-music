// Mock data for demonstration
import { Song, MusicSource } from '../types/music';

export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: 355,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    url: 'https://www.soundjay.com/misc/sounds/clock-ticking-4.wav',
    source: MusicSource.LOCAL
  },
  {
    id: '2',
    title: 'Imagine',
    artist: 'John Lennon',
    album: 'Imagine',
    duration: 183,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    source: MusicSource.LOCAL
  },
  {
    id: '3',
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    duration: 391,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    url: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
    source: MusicSource.LOCAL
  },
  {
    id: '4',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    coverUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop',
    url: 'spotify:track:4example',
    source: MusicSource.SPOTIFY
  },
  {
    id: '5',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 233,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    url: 'spotify:track:5example',
    source: MusicSource.SPOTIFY
  },
  {
    id: '6',
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    duration: 174,
    coverUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop',
    url: 'spotify:track:6example',
    source: MusicSource.SPOTIFY
  }
];

export const mockPlaylists = [
  {
    id: 'p1',
    name: 'Classic Rock Hits',
    songs: mockSongs.slice(0, 3),
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
  },
  {
    id: 'p2',
    name: 'Modern Pop',
    songs: mockSongs.slice(3),
    coverUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop'
  }
];