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
import { Coins, Percent, Calculator, PiggyBank, BarChartBig, Archive, MousePointerClick, ChevronDown, LogOut, DollarSign, Tv, Scale, WalletCards, Clock, MousePointer2, Film, ClipboardList, CalendarClock, Timer, Gift, FlaskConical, Printer, LineChart, Sigma, HeartPulse, Receipt, Zap, Ruler, Divide, Thermometer, Landmark, Home, TrendingUp, Shuffle, Footprints, Baby, GraduationCap, HardHat, Network, KeyRound } from 'lucide-react';
import CurrencyConverter from './CurrencyConverter';
import LoanCalculator from './LoanCalculator';
import SimpleCalculator from './SimpleCalculator';
import RetirementCalculator from './RetirementCalculator';
import ContributionMarginCalculator from './ContributionMarginCalculator';
import CogsCalculator from './CogsCalculator';
import CpcCpmCalculator from './CpcCpmCalculator';
import ExitRateCalculator from './ExitRateCalculator';
import AdsenseCalculator from './AdsenseCalculator';
import GrpCalculator from './GrpCalculator';
import LernerIndexCalculator from './LernerIndexCalculator';
import LiquidNetWorthCalculator from './LiquidNetWorthCalculator';
import ManHoursCalculator from './ManHoursCalculator';
import CtrCalculator from './CtrCalculator';
import AvmCalculator from './AvmCalculator';
import EvmCalculator from './EvmCalculator';
import DateTimeCalculator from './DateTimeCalculator';
import TimeCalculator from './TimeCalculator';
import AgeCalculator from './AgeCalculator';
import PrintingCalculator from './PrintingCalculator';
import ScientificCalculator from './ScientificCalculator';
import GraphingCalculator from './GraphingCalculator';
import StatisticsCalculator from './StatisticsCalculator';
import BmiCalculator from './BmiCalculator';
import SalaryCalculator from './SalaryCalculator';
import CalorieCalculator from './CalorieCalculator';
import LengthCalculator from './LengthCalculator';
import FractionCalculator from './FractionCalculator';
import QuadraticCalculator from './QuadraticCalculator';
import TemperatureCalculator from './TemperatureCalculator';
import InflationCalculator from './InflationCalculator';
import SalesTaxCalculator from './SalesTaxCalculator';
import PercentageCalculator from './PercentageCalculator';
import RandomNumberGenerator from './RandomNumberGenerator';
import TriangleCalculator from './TriangleCalculator';
import BodyFatCalculator from './BodyFatCalculator';
import IdealWeightCalculator from './IdealWeightCalculator';
import PaceCalculator from './PaceCalculator';
import PregnancyCalculator from './PregnancyCalculator';
import GpaCalculator from './GpaCalculator';
import ConcreteCalculator from './ConcreteCalculator';
import SubnetCalculator from './SubnetCalculator';
import PasswordGenerator from './PasswordGenerator';
import PaypalFeeCalculator from './PaypalFeeCalculator';

const TriangleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
  </svg>
);


const calculators = [
  { name: 'Currency', icon: Coins, component: <CurrencyConverter />, value: 'currency', category: 'business' },
  { name: 'Loan', icon: Landmark, component: <LoanCalculator />, value: 'loan', category: 'business' },
  { name: 'Retirement', icon: PiggyBank, component: <RetirementCalculator />, value: 'retirement', category: 'business' },
  { name: 'Contrib. Margin', icon: BarChartBig, component: <ContributionMarginCalculator />, value: 'contribution-margin', category: 'business' },
  { name: 'COGS', icon: Archive, component: <CogsCalculator />, value: 'cogs', category: 'business' },
  { name: 'Lerner Index', icon: Scale, component: <LernerIndexCalculator />, value: 'lerner-index', category: 'business' },
  { name: 'Liquid Net Worth', icon: WalletCards, component: <LiquidNetWorthCalculator />, value: 'liquid-net-worth', category: 'business' },
  { name: 'Salary', icon: Receipt, component: <SalaryCalculator />, value: 'salary', category: 'business' },
  { name: 'Inflation', icon: TrendingUp, component: <InflationCalculator />, value: 'inflation', category: 'business' },
  { name: 'Sales Tax', icon: Percent, component: <SalesTaxCalculator />, value: 'sales-tax', category: 'business' },
  { name: 'PayPal Fee', icon: Home, component: <PaypalFeeCalculator />, value: 'paypal-fee', category: 'business' },
  { name: 'CPC/CPM', icon: MousePointerClick, component: <CpcCpmCalculator />, value: 'cpc-cpm', category: 'marketing' },
  { name: 'CTR', icon: MousePointer2, component: <CtrCalculator />, value: 'ctr', category: 'marketing' },
  { name: 'Exit Rate', icon: LogOut, component: <ExitRateCalculator />, value: 'exit-rate', category: 'marketing' },
  { name: 'AdSense', icon: DollarSign, component: <AdsenseCalculator />, value: 'adsense', category: 'marketing' },
  { name: 'GRP', icon: Tv, component: <GrpCalculator />, value: 'grp', category: 'marketing' },
  { name: 'AVM', icon: Film, component: <AvmCalculator />, value: 'avm', category: 'marketing' },
  { name: 'Standard', icon: Calculator, component: <SimpleCalculator />, value: 'simple', category: 'general' },
  { name: 'Percentage', icon: Percent, component: <PercentageCalculator />, value: 'percentage', category: 'general' },
  { name: 'Printing', icon: Printer, component: <PrintingCalculator/>, value: 'printing', category: 'general' },
  { name: 'Man-Hours', icon: Clock, component: <ManHoursCalculator />, value: 'man-hours', category: 'general' },
  { name: 'EVM', icon: ClipboardList, component: <EvmCalculator />, value: 'evm', category: 'general' },
  { name: 'Date', icon: CalendarClock, component: <DateTimeCalculator />, value: 'date-time', category: 'general' },
  { name: 'Time', icon: Timer, component: <TimeCalculator />, value: 'time', category: 'general' },
  { name: 'Age', icon: Gift, component: <AgeCalculator />, value: 'age', category: 'general' },
  { name: 'Length', icon: Ruler, component: <LengthCalculator />, value: 'length', category: 'general' },
  { name: 'Temperature', icon: Thermometer, component: <TemperatureCalculator />, value: 'temperature', category: 'general' },
  { name: 'Fraction', icon: Divide, component: <FractionCalculator />, value: 'fraction', category: 'general' },
  { name: 'Random Number', icon: Shuffle, component: <RandomNumberGenerator />, value: 'random-number', category: 'general' },
  { name: 'Password', icon: KeyRound, component: <PasswordGenerator />, value: 'password-generator', category: 'general' },
  { name: 'BMI', icon: HeartPulse, component: <BmiCalculator />, value: 'bmi', category: 'health' },
  { name: 'Body Fat', icon: HeartPulse, component: <BodyFatCalculator />, value: 'body-fat', category: 'health' },
  { name: 'Calorie', icon: Zap, component: <CalorieCalculator />, value: 'calorie', category: 'health' },
  { name: 'Ideal Weight', icon: HeartPulse, component: <IdealWeightCalculator />, value: 'ideal-weight', category: 'health' },
  { name: 'Pace', icon: Footprints, component: <PaceCalculator />, value: 'pace', category: 'health' },
  { name: 'Pregnancy', icon: Baby, component: <PregnancyCalculator />, value: 'pregnancy', category: 'health' },
  { name: 'Scientific', icon: FlaskConical, component: <ScientificCalculator />, value: 'scientific', category: 'science' },
  { name: 'Graphing', icon: LineChart, component: <GraphingCalculator />, value: 'graphing', category: 'science' },
  { name: 'Quadratic', icon: Sigma, component: <QuadraticCalculator />, value: 'quadratic', category: 'science' },
  { name: 'Triangle', icon: TriangleIcon, component: <TriangleCalculator />, value: 'triangle', category: 'science' },
  { name: 'Statistics', icon: Sigma, component: <StatisticsCalculator />, value: 'statistics', category: 'statistics' },
  { name: 'GPA', icon: GraduationCap, component: <GpaCalculator />, value: 'gpa', category: 'education' },
  { name: 'Concrete', icon: HardHat, component: <ConcreteCalculator />, value: 'concrete', category: 'construction' },
  { name: 'Subnet', icon: Network, component: <SubnetCalculator />, value: 'subnet', category: 'networking' },
];

const businessCalculators = calculators.filter(c => c.category === 'business');
const marketingCalculators = calculators.filter(c => c.category === 'marketing');
const generalCalculators = calculators.filter(c => c.category === 'general');
const healthCalculators = calculators.filter(c => c.category === 'health');
const scienceCalculators = calculators.filter(c => c.category === 'science');
const statisticsCalculators = calculators.filter(c => c.category === 'statistics');
const educationCalculators = calculators.filter(c => c.category === 'education');
const constructionCalculators = calculators.filter(c => c.category === 'construction');
const networkingCalculators = calculators.filter(c => c.category === 'networking');


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
              <ChevronDown className="h-5 w.5 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
            <DropdownMenuLabel>Business</DropdownMenuLabel>
            {businessCalculators.map((calc) => (
              <DropdownMenuItem key={calc.value} onClick={() => setActiveCalculator(calc)} className="flex gap-2">
                <calc.icon className="h-4 w-4" />
                {calc.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Marketing</DropdownMenuLabel>
            {marketingCalculators.map((calc) => (
              <DropdownMenuItem key={calc.value} onClick={() => setActiveCalculator(calc)} className="flex gap_2">
                <calc.icon className="h-4 w-4" />
                {calc.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>General</DropdownMenuLabel>
             {generalCalculators.map((calc) => (
              <DropdownMenuItem key={calc.value} onClick={() => setActiveCalculator(calc)} className="flex gap-2">
                <calc.icon className="h-4 w-4" />
                {calc.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Health & Fitness</DropdownMenuLabel>
             {healthCalculators.map((calc) => (
              <DropdownMenuItem key={calc.value} onClick={() => setActiveCalculator(calc)} className="flex gap-2">
                <calc.icon className="h-4 w-4" />
                {calc.name}
              </DropdownMenuItem>
            ))}
             <DropdownMenuSeparator />
            <DropdownMenuLabel>Science</DropdownMenuLabel>
             {scienceCalculators.map((calc) => (
              <DropdownMenuItem key={calc.value} onClick={() => setActiveCalculator(calc)} className="flex gap-2">
                <calc.icon className="h-4 w-4" />
                {calc.name}
              </DropdownMenuItem>
            ))}
             <DropdownMenuSeparator />
            <DropdownMenuLabel>Statistics</DropdownMenuLabel>
             {statisticsCalculators.map((calc) => (
              <DropdownMenuItem key={calc.value} onClick={() => setActiveCalculator(calc)} className="flex gap-2">
                <calc.icon className="h-4 w-4" />
                {calc.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Education</DropdownMenuLabel>
             {educationCalculators.map((calc) => (
              <DropdownMenuItem key={calc.value} onClick={() => setActiveCalculator(calc)} className="flex gap-2">
                <calc.icon className="h-4 w-4" />
                {calc.name}
              </DropdownMenuItem>
            ))}
             <DropdownMenuSeparator />
            <DropdownMenuLabel>Construction</DropdownMenuLabel>
             {constructionCalculators.map((calc) => (
              <DropdownMenuItem key={calc.value} onClick={() => setActiveCalculator(calc)} className="flex gap-2">
                <calc.icon className="h-4 w-4" />
                {calc.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Networking</DropdownMenuLabel>
             {networkingCalculators.map((calc) => (
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
