'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { scrollToHash } from '@/lib/utils';

interface SmoothScrollLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Link that smooth-scrolls to the target section when the href has a hash and we're on the same page.
 * Use for in-page anchors (e.g. /#how-it-works) so scroll behavior is always smooth.
 */
export function SmoothScrollLink({ href, children, className, onClick }: SmoothScrollLinkProps) {
  const pathname = usePathname();
  const isHashLink = href.includes('#');
  const isSamePage = pathname === '/' || pathname === href.replace(/#.*/, '');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHashLink && isSamePage) {
      e.preventDefault();
      scrollToHash(href);
    }
    onClick?.();
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
