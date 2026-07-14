import { Separator } from '@/shared/components/ui/separator';
import { cn } from '@/lib/utils';

interface TextSeparatorProps {
  children: React.ReactNode;
  position?: 'left' | 'center' | 'right';
  withLine?: boolean;
  className?: string;
  lineClassName?: string;
  textClassName?: string;
}

export const TextSeparator = ({
  children,
  position = 'center',
  withLine = true,
  className,
  lineClassName,
  textClassName,
}: TextSeparatorProps) => {
  // If no line, just return the text
  if (!withLine) {
    return (
      <div
        className={cn(
          'text-xs uppercase text-muted-foreground tracking-widest',
          position === 'left' && 'text-left',
          position === 'center' && 'text-center',
          position === 'right' && 'text-right',
          className,
        )}
      >
        <span className={textClassName}>{children}</span>
      </div>
    );
  }

  // With line - position determines layout
  return (
    <div className={cn('relative', className)}>
      {/* Full width line behind text */}
      <div className="absolute inset-0 flex items-center">
        <Separator className={cn('w-full', lineClassName)} />
      </div>

      {/* Text positioned based on variant */}
      <div
        className={cn(
          'relative flex',
          position === 'left' && 'justify-start',
          position === 'center' && 'justify-center',
          position === 'right' && 'justify-end',
        )}
      >
        <span
          className={cn(
            'bg-background px-2 text-xs uppercase text-muted-foreground tracking-widest',
            textClassName,
          )}
        >
          {children}
        </span>
      </div>
    </div>
  );
};
