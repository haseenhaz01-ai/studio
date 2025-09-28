'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, Percent } from 'lucide-react';
import CurrencyConverter from './CurrencyConverter';
import EmiCalculator from './EmiCalculator';

const calculators = [
  { name: 'Currency', icon: Coins, component: <CurrencyConverter />, value: 'currency' },
  { name: 'EMI', icon: Percent, component: <EmiCalculator />, value: 'emi' },
];

export default function CalculatorTabs() {
  return (
    <Tabs defaultValue="currency" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        {calculators.map((calc) => (
          <TabsTrigger key={calc.value} value={calc.value} className="flex gap-2">
            <calc.icon className="h-4 w-4" />
            {calc.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {calculators.map((calc) => (
        <TabsContent key={calc.value} value={calc.value} className="pt-6">
          {calc.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
