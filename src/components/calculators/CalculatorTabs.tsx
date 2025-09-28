'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, Percent, Calculator, PiggyBank, BarChartBig } from 'lucide-react';
import CurrencyConverter from './CurrencyConverter';
import EmiCalculator from './EmiCalculator';
import SimpleCalculator from './SimpleCalculator';
import InvestmentCalculator from './InvestmentCalculator';
import ContributionMarginCalculator from './ContributionMarginCalculator';

const calculators = [
  { name: 'Currency', icon: Coins, component: <CurrencyConverter />, value: 'currency' },
  { name: 'EMI', icon: Percent, component: <EmiCalculator />, value: 'emi' },
  { name: 'Investment', icon: PiggyBank, component: <InvestmentCalculator />, value: 'investment' },
  { name: 'Contrib. Margin', icon: BarChartBig, component: <ContributionMarginCalculator />, value: 'contribution-margin' },
  { name: 'Simple', icon: Calculator, component: <SimpleCalculator />, value: 'simple' },
];

export default function CalculatorTabs() {
  return (
    <Tabs defaultValue="currency" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
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
