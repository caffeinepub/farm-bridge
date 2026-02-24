import { ReactNode } from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  level?: 'h1' | 'h2' | 'h3';
  children?: ReactNode;
}

export default function SectionHeading({ title, subtitle, level = 'h1', children }: SectionHeadingProps) {
  const HeadingTag = level;
  const headingClass = level === 'h1' ? 'heading-1' : level === 'h2' ? 'heading-2' : 'heading-3';

  return (
    <div className="space-y-3">
      <HeadingTag className={`${headingClass} font-heading`}>{title}</HeadingTag>
      {subtitle && <p className="body-large text-muted-foreground max-w-3xl">{subtitle}</p>}
      {children}
    </div>
  );
}
