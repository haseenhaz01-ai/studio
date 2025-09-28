import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorTabs from '@/components/calculators/CalculatorTabs';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-8">
        <CalculatorTabs />
      </main>
      <Footer />
    </div>
  );
}
