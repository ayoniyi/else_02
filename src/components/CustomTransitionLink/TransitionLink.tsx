// components/TransitionLink.tsx
import { useRouter } from "next/router";
import { useTransition } from "@/context/TransitionContext";
import { MouseEvent, ReactNode } from "react";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const TransitionLink = ({ href, children, className }: TransitionLinkProps) => {
  const router = useRouter();
  const { triggerExit } = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Don't navigate if we're already on this page
    if (router.asPath === href) return;

    triggerExit(() => {
      router.push(href);
    });
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default TransitionLink;
