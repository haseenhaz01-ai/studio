'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Coins, Percent, Calculator, PiggyBank, BarChartBig, Archive, MousePointerClick, ChevronDown, LogOut, DollarSign, Tv, Scale, WalletCards, Clock } from 'lucide-react';
import CurrencyConverter from './CurrencyConverter';
import EmiCalculator from './EmiCalculator';
import SimpleCalculator from './SimpleCalculator';
import InvestmentCalculator from './InvestmentCalculator';
import ContributionMarginCalculator from './ContributionMarginCalculator';
import CogsCalculator from './CogsCalculator';
import CpcCpmCalculator from './CpcCpmCalculator';
import ExitRateCalculator from './ExitRateCalculator';
import AdsenseCalculator from './AdsenseCalculator';
import GrpCalculator from './GrpCalculator';
import LernerIndexCalculator from './LernerIndexCalculator';
import LiquidNetWorthCalculator from './LiquidNetWorthCalculator';
import ManHoursCalculator from './ManHoursCalculator';

const calculators = [
  { name: 'Currency', icon: Coins, component: <CurrencyConverter />, value: 'currency', category: 'finance' },
  { name: 'EMI', icon: Percent, component: <EmiCalculator />, value: 'emi', category: 'finance' },
  { name: 'Investment', icon: PiggyBank, component: <InvestmentCalculator />, value: 'investment', category: 'finance' },
  { name: 'Contrib. Margin', icon: BarChartBig, component: <ContributionMarginCalculator />, value: 'contribution-margin', category: 'finance' },
  { name: 'COGS', icon: Archive, component: <CogsCalculator />, value: 'cogs', category: 'finance' },
  { name: 'Lerner Index', icon: Scale, component: <LernerIndexCalculator />, value: 'lerner-index', category: 'finance' },
  { name: 'Liquid Net Worth', icon: WalletCards, component: <LiquidNetWorthCalculator />, value: 'liquid-net-worth', category: 'finance' },
  { name: 'CPC/CPM', icon: MousePointerClick, component: <CpcCpmCalculator />, value: 'cpc-cpm', category: 'marketing' },
  { name: 'Exit Rate', icon: LogOut, component: <ExitRateCalculator />, value: 'exit-rate', category: 'marketing' },
  { name: 'AdSense', icon: DollarSign, component: <AdsenseCalculator />, value: 'adsense', category: 'marketing' },
  { name: 'GRP', icon: Tv, component: <GrpCalculator />, value: 'grp', category: 'marketing' },
  { name: 'Simple', icon: Calculator, component: <SimpleCalculator />, value: 'simple', category: 'general' },
  { name: 'Man-Hours', icon: Clock, component: <ManHoursCalculator />, value: 'man-hours', category: 'general' },
];

const financeCalculators = calculators.filter(c => c.category === 'finance');
const marketingCalculators = calculators.filter(c => c.category === 'marketing');
const otherCalculators = calculators.filter(c => c.category !== 'finance' && c.category !== 'marketing');


export default function CalculatorTabs() {
  const [activeCalculator, setActiveCalculator] = useState(calculators[0]);
  const ActiveCalcIcon = activeCalculator.icon;

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full max-w-sm text-lg py-6">
              <ActiveCalcIcon className="h-5 w-5 mr-3" />
              {activeCalculator.name}
              <ChevronDown className="h-5 w-5 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
            <DropdownMenuLabel>Finance</DropdownMenuLabel>
            {financeCalculators.map((calc) => (
              <DropdownMenuItem key={calc.value} onClick={() => setActiveCalculator(calc)} className="flex gap-2">
                <calc.icon className="h-4 w-4" />
                {calc.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Marketing</DropdownMenuLabel>
            {marketingCalculators.map((calc) => (
              <DropdownMenuItem key={calc.value} onClick={() => setActiveCalculator(calc)} className="flex gap-2">
                <calc.icon className="h-4 w-4" />
                {calc.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
             {otherCalculators.map((calc) => (
              <DropdownMenuItem key={calc.value} onClick={() => setActiveCalculator(calc)} className="flex gap-2">
                <calc.icon className="h-4 w-4" />
                {calc.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        {activeCalculator.component}
      </div>
    </div>
  );
}
