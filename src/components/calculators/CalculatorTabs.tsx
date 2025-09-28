'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, PiggyBank, TrendingUp, Landmark, Percent, Receipt, Home, BarChart } from 'lucide-react';
import CurrencyConverter from './CurrencyConverter';
import EmiCalculator from './EmiCalculator';

const calculators = [
  { name: 'Currency', icon: Coins, component: <CurrencyConverter />, value: 'currency' },
  { name: 'EMI', icon: Percent, component: <EmiCalculator />, value: 'emi' },
  { name: 'SIP', icon: TrendingUp, component: <ComingSoon name="SIP" />, value: 'sip' },
  { name: 'Mutual Fund', icon: Landmark, component: <ComingSoon name="Mutual Fund" />, value: 'mutual-fund' },
  { name: 'Capital Gains', icon: Receipt, component: <ComingSoon name="Capital Gains" />, value: 'capital-gains' },
  { name: 'FD', icon: PiggyBank, component: <ComingSoon name="Fixed Deposit" />, value: 'fd' },
  { name: 'Real Estate', icon: Home, component: <ComingSoon name="Real Estate" />, value: 'real-estate' },
];

function ComingSoon({ name }: { name: string }) {
  return (
    <div className="flex h-96 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
      <BarChart className="mb-4 h-16 w-16 text-muted-foreground/50" />
      <h2 className="font-headline text-2xl text-muted-foreground">
        {name} Calculator
      </h2>
      <p className="text-muted-foreground/80">Coming Soon!</p>
    </div>
  );
}

export default function CalculatorTabs() {
  return (
    <Tabs defaultValue="currency" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
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
