'use client';

import {
  Coins, Percent, Calculator, PiggyBank, BarChartBig, Archive, MousePointerClick, LogOut, DollarSign, Tv, Scale, WalletCards, Clock, MousePointer2, Film, ClipboardList, CalendarClock, Timer, Gift, FlaskConical, Printer, LineChart, Sigma, HeartPulse, Receipt, Zap, Ruler, Divide, Thermometer, Landmark, Home, TrendingUp, Shuffle, Footprints, Baby, GraduationCap, HardHat, Network, KeyRound, Image, Crop, Type, QrCode, FileText, ScanSearch, Bitcoin, Palette, AlarmClock, Hourglass
} from 'lucide-react';
import type { Category } from './CalculatorGrid';
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
import ImageCompressor from './ImageCompressor';
import ImageResizer from './ImageResizer';
import FancyFontGenerator from './FancyFontGenerator';
import QrCodeGenerator from './QrCodeGenerator';
import WordCounter from './WordCounter';
import DuplicateSentenceChecker from './DuplicateSentenceChecker';
import CryptoConverter from './CryptoConverter';
import ColourConverter from './ColourConverter';
import StopwatchCalculator from './StopwatchCalculator';
import CountdownTimer from './CountdownTimer';

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

export const calculators = [
    { name: 'Currency', icon: Coins, component: <CurrencyConverter />, value: 'currency', category: 'financial' },
    { name: 'Crypto', icon: Bitcoin, component: <CryptoConverter />, value: 'crypto', category: 'financial' },
    { name: 'Loan', icon: Landmark, component: <LoanCalculator />, value: 'loan', category: 'financial' },
    { name: 'Retirement', icon: PiggyBank, component: <RetirementCalculator />, value: 'retirement', category: 'financial' },
    { name: 'Contrib. Margin', icon: BarChartBig, component: <ContributionMarginCalculator />, value: 'contribution-margin', category: 'financial' },
    { name: 'COGS', icon: Archive, component: <CogsCalculator />, value: 'cogs', category: 'financial' },
    { name: 'Lerner Index', icon: Scale, component: <LernerIndexCalculator />, value: 'lerner-index', category: 'financial' },
    { name: 'Liquid Net Worth', icon: WalletCards, component: <LiquidNetWorthCalculator />, value: 'liquid-net-worth', category: 'financial' },
    { name: 'Salary', icon: Receipt, component: <SalaryCalculator />, value: 'salary', category: 'financial' },
    { name: 'Inflation', icon: TrendingUp, component: <InflationCalculator />, value: 'inflation', category: 'financial' },
    { name: 'Sales Tax', icon: Percent, component: <SalesTaxCalculator />, value: 'sales-tax', category: 'financial' },
    { name: 'PayPal Fee', icon: Home, component: <PaypalFeeCalculator />, value: 'paypal-fee', category: 'financial' },
    { name: 'CPC/CPM', icon: MousePointerClick, component: <CpcCpmCalculator />, value: 'cpc-cpm', category: 'marketing' },
    { name: 'CTR', icon: MousePointer2, component: <CtrCalculator />, value: 'ctr', category: 'marketing' },
    { name: 'Exit Rate', icon: LogOut, component: <ExitRateCalculator />, value: 'exit-rate', category: 'marketing' },
    { name: 'AdSense', icon: DollarSign, component: <AdsenseCalculator />, value: 'adsense', category: 'marketing' },
    { name: 'GRP', icon: Tv, component: <GrpCalculator />, value: 'grp', category: 'marketing' },
    { name: 'AVM', icon: Film, component: <AvmCalculator />, value: 'avm', category: 'marketing' },
    { name: 'Standard', icon: Calculator, component: <SimpleCalculator />, value: 'simple', category: 'math-general' },
    { name: 'Percentage', icon: Percent, component: <PercentageCalculator />, value: 'percentage', category: 'math-general' },
    { name: 'Printing', icon: Printer, component: <PrintingCalculator/>, value: 'printing', category: 'math-general' },
    { name: 'Man-Hours', icon: Clock, component: <ManHoursCalculator />, value: 'man-hours', category: 'math-general' },
    { name: 'EVM', icon: ClipboardList, component: <EvmCalculator />, value: 'evm', category: 'math-general' },
    { name: 'Date', icon: CalendarClock, component: <DateTimeCalculator />, value: 'date-time', category: 'math-general' },
    { name: 'Time', icon: Timer, component: <TimeCalculator />, value: 'time', category: 'math-general' },
    { name: 'Age', icon: Gift, component: <AgeCalculator />, value: 'age', category: 'math-general' },
    { name: 'Length', icon: Ruler, component: <LengthCalculator />, value: 'length', category: 'math-general' },
    { name: 'Temperature', icon: Thermometer, component: <TemperatureCalculator />, value: 'temperature', category: 'math-general' },
    { name: 'Fraction', icon: Divide, component: <FractionCalculator />, value: 'fraction', category: 'math-general' },
    { name: 'Random Number', icon: Shuffle, component: <RandomNumberGenerator />, value: 'random-number', category: 'math-general' },
    { name: 'Stopwatch', icon: AlarmClock, component: <StopwatchCalculator />, value: 'stopwatch', category: 'math-general' },
    { name: 'Countdown', icon: Hourglass, component: <CountdownTimer />, value: 'countdown', category: 'math-general' },
    { name: 'BMI', icon: HeartPulse, component: <BmiCalculator />, value: 'bmi', category: 'health' },
    { name: 'Body Fat', icon: HeartPulse, component: <BodyFatCalculator />, value: 'body-fat', category: 'health' },
    { name: 'Calorie', icon: Zap, component: <CalorieCalculator />, value: 'calorie', category: 'health' },
    { name: 'Ideal Weight', icon: HeartPulse, component: <IdealWeightCalculator />, value: 'ideal-weight', category: 'health' },
    { name: 'Pace', icon: Footprints, component: <PaceCalculator />, value: 'pace', category: 'health' },
    { name: 'Pregnancy', icon: Baby, component: <PregnancyCalculator />, value: 'pregnancy', category: 'health' },
    { name: 'Scientific', icon: FlaskConical, component: <ScientificCalculator />, value: 'scientific', category: 'science-education' },
    { name: 'Graphing', icon: LineChart, component: <GraphingCalculator />, value: 'graphing', category: 'science-education' },
    { name: 'Quadratic', icon: Sigma, component: <QuadraticCalculator />, value: 'quadratic', category: 'science-education' },
    { name: 'Triangle', icon: TriangleIcon, component: <TriangleCalculator />, value: 'triangle', category: 'science-education' },
    { name: 'Statistics', icon: Sigma, component: <StatisticsCalculator />, value: 'statistics', category: 'science-education' },
    { name: 'GPA', icon: GraduationCap, component: <GpaCalculator />, value: 'gpa', category: 'science-education' },
    { name: 'Concrete', icon: HardHat, component: <ConcreteCalculator />, value: 'concrete', category: 'construction-it' },
    { name: 'Subnet', icon: Network, component: <SubnetCalculator />, value: 'subnet', category: 'construction-it' },
    { name: 'Password', icon: KeyRound, component: <PasswordGenerator />, value: 'password-generator', category: 'tools' },
    { name: 'Image Compressor', icon: Image, component: <ImageCompressor />, value: 'image-compressor', category: 'tools' },
    { name: 'Image Resizer', icon: Crop, component: <ImageResizer />, value: 'image-resizer', category: 'tools' },
    { name: 'Fancy Fonts', icon: Type, component: <FancyFontGenerator />, value: 'fancy-font-generator', category: 'tools' },
    { name: 'QR Code', icon: QrCode, component: <QrCodeGenerator />, value: 'qr-code-generator', category: 'tools' },
    { name: 'Word Counter', icon: FileText, component: <WordCounter />, value: 'word-counter', category: 'tools' },
    { name: 'Duplicate Checker', icon: ScanSearch, component: <DuplicateSentenceChecker />, value: 'duplicate-sentence-checker', category: 'tools' },
    { name: 'Colour Converter', icon: Palette, component: <ColourConverter />, value: 'colour-converter', category: 'tools' },
];

export const categories = [
    { name: 'Financial', slug: 'financial', calculators: calculators.filter(c => c.category === 'financial') },
    { name: 'Marketing & Web', slug: 'marketing', calculators: calculators.filter(c => c.category === 'marketing') },
    { name: 'Math & General', slug: 'math-general', calculators: calculators.filter(c => c.category === 'math-general') },
    { name: 'Health & Fitness', slug: 'health', calculators: calculators.filter(c => c.category === 'health') },
    { name: 'Science & Education', slug: 'science-education', calculators: calculators.filter(c => c.category === 'science-education') },
    { name: 'Construction & IT', slug: 'construction-it', calculators: calculators.filter(c => c.category === 'construction-it') },
    { name: 'Tools', slug: 'tools', calculators: calculators.filter(c => c.category === 'tools') },
];

interface CalculatorListProps {
  category: Category;
  onCalculatorSelect: (calculator: typeof calculators[0]) => void;
  onBack: () => void;
}

export default function CalculatorList({ category, onCalculatorSelect, onBack }: CalculatorListProps) {
  return (
    <div>
      <button onClick={onBack} className="mb-6 text-sm font-medium text-primary hover:underline">
        &larr; Back to Categories
      </button>
      <div className="mb-8 flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg`} style={{backgroundColor: `hsl(var(--cat-${category.slug}))`}}>
            {category.calculators[0] && <category.calculators[0].icon className="h-6 w-6 text-white" />}
        </div>
        <h2 className="text-3xl font-bold font-headline tracking-tight">{category.name} Calculators</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {category.calculators.map(calc => {
          const Icon = calc.icon;
          return (
            <button
              key={calc.value}
              onClick={() => onCalculatorSelect(calc)}
              className="group flex items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">{calc.name}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}