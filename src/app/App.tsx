import { Routes, Route } from 'react-router-dom';

import { PublicRoute } from '@/app/routes/PublicRoute';
import { ProtectedRoute } from '@/app/routes/ProtectedRoute';

import { GalleryLayout } from '@/app/layouts/GalleryLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { GalleryContent } from '@/features/gallery';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<GalleryLayout />}>
          <Route index element={<GalleryContent />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
