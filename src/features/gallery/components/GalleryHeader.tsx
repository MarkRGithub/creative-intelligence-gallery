import { useState } from 'react';
import { useAuthContext } from '@/features/auth';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { ArrowRight, MenuIcon, Power, UploadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/shared/components/ui/separator';
import { UploadModal } from './UploadModal';

export function GalleryHeader() {
  const { user, signOut, loading: globalLoading } = useAuthContext();
  const [localLoading, setLocalLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const isLoading = globalLoading || localLoading;

  const handleSignOut = async () => {
    try {
      setLocalLoading(true);
      await signOut();
      toast.success('Signed out successfully');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      toast.error(errorMessage);
      setLocalLoading(false);
    }
  };

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return '';
    return name
      .split(' ')
      .map((part: string) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  return (
    <header className="w-full flex items-center h-12 bg-primary text-primary-foreground px-6 lg:px-14">
      <div className="mx-auto w-full max-w-view flex items-center justify-between">
        <h1 className="font-extrabold text-sm lg:text-base lg:tracking-tight">
          CREATIVE INTELLIGENCE GALLERY
        </h1>
        {/* DESKTOP */}
        <div className="hidden lg:flex items-center gap-4">
          <Button
            variant="tertiary"
            size="sm"
            className="text-[0.625rem]"
            disabled={isLoading}
            onClick={handleUploadClick}
          >
            Submit Your Work
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" className="rounded-full" />}
            >
              <Avatar className="h-7 w-7 border border-white/20 hover:border-0">
                <AvatarImage
                  src={user?.user_metadata?.avatar_url}
                  alt={user?.user_metadata?.full_name || 'User'}
                />
                <AvatarFallback>
                  {getInitials(user?.user_metadata?.full_name) ||
                    user?.email?.charAt(0).toUpperCase() ||
                    'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex flex-col items-start gap-0.5 tracking-tight">
                  <span className="font-semibold">
                    {user?.user_metadata?.full_name || 'Guest'}
                  </span>
                  <span className="text-[0.625rem]">{user?.email}</span>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  className="tracking-tight text-xs font-medium cursor-pointer"
                  onClick={handleSignOut}
                  disabled={isLoading}
                >
                  <Power className="size-3.5" /> SIGN OUT
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* MOBILE */}
        <div className="lg:hidden flex items-center gap-2">
          <Sheet key="mobile-menu">
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="h-8 w-8" />}
            >
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent
              side="top"
              className="flex flex-col bg-[linear-gradient(to_bottom,#500088_10%,#6B21A8_40%)] [&>[data-slot=sheet-close]]:text-white [&>[data-slot=sheet-close]]:hover:text-white [&>[data-slot=sheet-close]]:hover:bg-white/10"
            >
              <SheetHeader>
                <SheetTitle className="font-extrabold text-white">
                  CREATIVE INTELLIGENCE GALLERY
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col px-6 gap-6">
                {/* User Info */}
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="size-16 border-3 border-white">
                    <AvatarImage
                      src={user?.user_metadata?.avatar_url}
                      alt={user?.user_metadata?.full_name || 'User'}
                    />
                    <AvatarFallback>
                      {getInitials(user?.user_metadata?.full_name) ||
                        user?.email?.charAt(0).toUpperCase() ||
                        'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-sm text-white tracking-wide">
                      {user?.user_metadata?.full_name || 'Guest'}
                    </span>
                    <span className="text-xs text-white/80 tracking-tight">
                      {user?.email || 'Not signed in'}
                    </span>
                  </div>
                </div>
              </div>
              <SheetFooter className="flex-1 mt-6 bg-background rounded-t-lg">
                <Button
                  variant="ghost"
                  className="justify-between"
                  disabled={isLoading}
                  onClick={handleUploadClick}
                >
                  <span className="flex items-center gap-3">
                    <UploadIcon />
                    Submit Your Work
                  </span>
                  <ArrowRight />
                </Button>
                <Separator />
                <Button
                  variant="ghost"
                  className="justify-between text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleSignOut}
                  disabled={isLoading}
                >
                  <span className="flex items-center gap-3">
                    <Power />
                    Sign Out
                  </span>
                  <ArrowRight />
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <UploadModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} />
    </header>
  );
}
