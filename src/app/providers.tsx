import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/contexts/AuthProvider';
import { Toaster } from '@/shared/components/ui/sonner';
import { TooltipProvider } from '@/shared/components/ui/tooltip';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <TooltipProvider>
          {children}
          <Toaster richColors />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
