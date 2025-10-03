import CalculatorTabs from '@/components/calculators/CalculatorTabs';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <CalculatorTabs />
        </div>
      </main>
      <Footer />
    </div>
  );
}
