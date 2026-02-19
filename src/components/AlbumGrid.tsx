import { type AlbumData } from '../types/spotify';
import { AlbumTile } from './AlbumTile';

interface AlbumGridProps {
  albums: AlbumData[];
}

export function AlbumGrid({ albums }: AlbumGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {albums.map((album) => (
        <AlbumTile key={album.id} album={album} />
      ))}
    </div>
  );
}
