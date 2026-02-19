export interface AlbumData {
  id: string;
  name: string;
  artist: string;
  coverArtUrl: string;
  durationMs: number;
  spotifyUrl: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}
