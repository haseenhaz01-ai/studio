import Link from 'next/link';
import { KeyRound } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2 text-primary-foreground">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="font-headline text-2xl font-bold text-foreground">
              ILo e Tools
            </h1>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
