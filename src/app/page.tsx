'use client';

import { useState, createElement } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorGrid, { Category } from '@/components/calculators/CalculatorGrid';
import CalculatorList from '@/components/calculators/CalculatorList';

export default function Home() {
  const [activeCalculator, setActiveCalculator] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const handleCalculatorSelect = (calculator: any) => {
    setActiveCalculator(calculator);
  };

  const handleCategorySelect = (category: Category | null) => {
    setActiveCategory(category);
    setActiveCalculator(null);
  };
  
  const handleBack = () => {
    setActiveCategory(null);
    setActiveCalculator(null);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background px-4 py-8 md:p-8">
        <div className="mx-auto w-full max-w-5xl">
          {activeCalculator ? (
            <div>
               <button onClick={handleBack} className="mb-4 text-sm font-medium text-primary hover:underline">
                &larr; Back to {activeCategory?.name}
              </button>
              {createElement(activeCalculator.component)}
            </div>
          ) : activeCategory ? (
            <CalculatorList
              category={activeCategory}
              onCalculatorSelect={handleCalculatorSelect}
              onBack={handleBack}
            />
          ) : (
            <CalculatorGrid onCategorySelect={handleCategorySelect} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
