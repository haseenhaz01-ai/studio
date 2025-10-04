'use client';

import type { Category } from '@/lib/constants';
import { calculators } from '@/lib/constants';
import CalculatorCard from './CalculatorCard';

interface CalculatorListProps {
  category: Category;
  onCalculatorSelect: (calculator: typeof calculators[0]) => void;
  onBack: () => void;
}

export default function CalculatorList({ category, onCalculatorSelect, onBack }: CalculatorListProps) {
  const CategoryIcon = category.icon;
  return (
    <div>
      <button onClick={onBack} className="mb-6 text-sm font-medium text-primary hover:underline">
        &larr; Back to Categories
      </button>
      <div className="mb-8 flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg`} style={{backgroundColor: `hsl(var(--cat-${category.slug}))`}}>
            <CategoryIcon className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold font-headline tracking-tight">{category.name} Calculators</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {category.calculators.map(calc => (
          <CalculatorCard
            key={calc.value}
            calculator={calc}
            onSelect={() => onCalculatorSelect(calc)}
          />
        ))}
      </div>
    </div>
  );
}
