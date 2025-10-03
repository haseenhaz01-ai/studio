import Link from 'next/link';
import { Timer } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-lg bg-primary p-2 text-primary-foreground">
            <Timer className="h-6 w-6" />
          </div>
          <h1 className="font-headline text-2xl font-bold text-foreground">
            TimeKit
          </h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
