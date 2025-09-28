import { Wallet } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-border/50">
      <div className="container mx-auto flex items-center gap-3 px-4 py-4">
        <div className="rounded-lg bg-primary p-2 text-primary-foreground">
          <Wallet className="h-6 w-6" />
        </div>
        <h1 className="font-headline text-2xl font-bold text-foreground">
          FinCalc Pro
        </h1>
      </div>
    </header>
  );
};

export default Header;
