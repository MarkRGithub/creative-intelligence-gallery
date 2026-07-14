import { Outlet } from 'react-router-dom';

import { GalleryHeader, GalleryFooter } from '@/features/gallery';

export function GalleryLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <GalleryHeader />

      <main className="flex-1 bg-[#FCF8FF]">
        <Outlet />
      </main>

      <GalleryFooter />
    </div>
  );
}
