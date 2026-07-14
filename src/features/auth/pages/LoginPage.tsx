import { useState } from 'react';
import { useAuthContext } from '@/features/auth';
import heroImg from '../LoginHeroVisual.webp';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { TextSeparator } from '@/shared/components/ui/text-separator';
import { Building } from 'lucide-react';
import { Spinner } from '@/shared/components/ui/spinner';
import { toast } from 'sonner';

export const LoginPage = () => {
  const { signInWithGoogle, loading: globalLoading } = useAuthContext();

  const [localLoading, setLocalLoading] = useState(false);

  const isLoading = globalLoading || localLoading;

  const handleGoogleSignIn = async () => {
    try {
      setLocalLoading(true);
      await signInWithGoogle();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      toast.error(errorMessage);
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(420px,45%)_1fr] dark bg-[#131315]">
      {/* Hero Image */}
      <aside className="relative hidden overflow-hidden lg:block">
        <img
          src={heroImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#131315]/40 to-[#131315]/80" />
        {/* Hero Text */}
        <div className="absolute inset-0 flex items-center p-[clamp(2rem,6vw,6rem)]">
          <div className="max-w-[clamp(320px,35vw,448px)] space-y-0">
            <h1 className="font-bold text-white text-[clamp(2rem,3.5vw,3rem)] leading-[clamp(2rem,3.5vw,3rem)] tracking-[-0.025em] pr-[clamp(2rem,8vw,10rem)] pb-4">
              Creative
              <br />
              Intelligence
              <br />
              Gallery
            </h1>
            <p className="text-muted-foreground text-[clamp(0.875rem,1.2vw,1rem)] leading-[clamp(1.4rem,1.8vw,1.6rem)] max-w-[clamp(280px,30vw,384px)] pt-[clamp(0.5rem,1vw,1rem)]">
              The ultimate showcase for high-performance HTML5 ads. Explore, review, and
              curate premium creative galleries with professional-grade intelligence.
            </p>
          </div>
        </div>
      </aside>

      {/* Login Form */}
      <main className="relative flex min-h-screen items-center justify-center overflow-y-auto px-6 py-12 lg:px-16">
        <Card className="w-full max-w-lg [--card-spacing:clamp(1.5rem,4vw,3rem)]">
          <CardHeader>
            <h2 className="font-semibold tracking-tight text-2xl lg:text-3xl">
              Welcome Back
            </h2>
            <p className="text-muted-foreground text-sm lg:text-base">
              Access your professional creative workspace.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 lg:gap-6">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              variant="google"
              className="h-9 lg:h-12 gap-2.5"
            >
              {isLoading ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Verifying Google account...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285f4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09"
                    />
                    <path
                      fill="#34a853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23"
                    />
                    <path
                      fill="#fbbc05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93z"
                    />
                    <path
                      fill="#ea4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53"
                    />
                  </svg>{' '}
                  Sign in with Google
                </>
              )}
            </Button>

            <TextSeparator
              className="opacity-40"
              textClassName="text-xs lg:text-sm dark:bg-card"
            >
              OR
            </TextSeparator>

            <div className="grid gap-2">
              <Label
                htmlFor="email"
                className="text-xs lg:text-sm text-[#B9CACB] opacity-60 tracking-wide"
              >
                EMAIL ADDRESS
              </Label>
              <Input
                disabled={isLoading}
                id="email"
                type="email"
                className="h-9 lg:h-12"
                placeholder="architect@intelligence.gallery"
                required
              />
            </div>

            <Button
              disabled={isLoading}
              variant="outline"
              className="h-9 lg:h-12 gap-2.5"
            >
              <Building className="dark:text-[#849495]" /> Enterprise Single Sign-On
            </Button>

            <Button
              disabled={isLoading}
              variant="link"
              className="text-xs lg:text-sm tracking-wide dark:text-muted-foreground font-normal"
            >
              Forgotten credentials?
            </Button>

            <p className="text-muted-foreground text-[0.55rem] lg:text-[0.6rem] w-full text-center opacity-50 mt-4">
              By continuing, you agree to our Service Terms and Privacy Protocol.
            </p>
          </CardContent>
        </Card>

        <footer className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center text-xs text-muted-foreground opacity-40 tracking-wide">
          Powered by <span className="font-bold tracking-normal">Smartly</span>
        </footer>
      </main>
    </div>
  );
};
