import { LayoutGroup } from 'framer-motion';
import { type AlbumData } from '../types/spotify';
import { AlbumTile } from './AlbumTile';

interface AlbumGridProps {
  albums: AlbumData[];
  isFavorite: (albumId: string) => boolean;
  onToggleFavorite: (albumId: string) => void;
}

export function AlbumGrid({ albums, isFavorite, onToggleFavorite }: AlbumGridProps) {
  return (
    <LayoutGroup>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {albums.map((album) => (
          <AlbumTile
            key={album.id}
            album={album}
            starred={isFavorite(album.id)}
            onToggleStar={() => onToggleFavorite(album.id)}
          />
        ))}
      </div>
    </LayoutGroup>
  );
}
