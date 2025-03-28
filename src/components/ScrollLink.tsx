import React from 'react';

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function ScrollLink({ href, children, className = '' }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const navHeight = 80; // Approximate height of the navigation bar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update URL without scrolling
      window.history.pushState(null, '', href);
    }
  };

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className={`${className} transition-all duration-300 hover:scale-105`}
    >
      {children}
    </a>
  );
} 