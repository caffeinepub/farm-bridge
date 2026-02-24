import { Button } from '@/components/ui/button';
import { forwardRef, ComponentPropsWithoutRef } from 'react';

type ButtonProps = ComponentPropsWithoutRef<typeof Button>;

const CTAButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={`bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-medium hover:shadow-large transition-all font-semibold ${className}`}
        {...props}
      />
    );
  }
);

CTAButton.displayName = 'CTAButton';

export default CTAButton;
