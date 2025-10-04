import {
  Coins, Percent, Calculator, PiggyBank, BarChartBig, Archive, MousePointerClick, LogOut, DollarSign, Tv, Scale, WalletCards, Film, ClipboardList, FlaskConical, Printer, LineChart, Sigma, HeartPulse, Receipt, Zap, Ruler, Divide, Thermometer, Landmark, Home, TrendingUp, Shuffle, Footprints, Baby, GraduationCap, HardHat, Network, KeyRound, Image, Crop, Type, QrCode, FileText, ScanSearch, Bitcoin, Palette, CalendarClock, Timer, Gift
} from 'lucide-react';
import CurrencyConverter from '@/components/calculators/CurrencyConverter';
import LoanCalculator from '@/components/calculators/LoanCalculator';
import SimpleCalculator from '@/components/calculators/SimpleCalculator';
import RetirementCalculator from '@/components/calculators/RetirementCalculator';
import ContributionMarginCalculator from '@/components/calculators/ContributionMarginCalculator';
import CogsCalculator from '@/components/calculators/CogsCalculator';
import CpcCpmCalculator from '@/components/calculators/CpcCpmCalculator';
import ExitRateCalculator from '@/components/calculators/ExitRateCalculator';
import AdsenseCalculator from '@/components/calculators/AdsenseCalculator';
import GrpCalculator from '@/components/calculators/GrpCalculator';
import LernerIndexCalculator from '@/components/calculators/LernerIndexCalculator';
import LiquidNetWorthCalculator from '@/components/calculators/LiquidNetWorthCalculator';
import CtrCalculator from '@/components/calculators/CtrCalculator';
import AvmCalculator from '@/components/calculators/AvmCalculator';
import EvmCalculator from '@/components/calculators/EvmCalculator';
import PrintingCalculator from '@/components/calculators/PrintingCalculator';
import ScientificCalculator from '@/components/calculators/ScientificCalculator';
import GraphingCalculator from '@/components/calculators/GraphingCalculator';
import StatisticsCalculator from '@/components/calculators/StatisticsCalculator';
import BmiCalculator from '@/components/calculators/BmiCalculator';
import SalaryCalculator from '@/components/calculators/SalaryCalculator';
import CalorieCalculator from '@/components/calculators/CalorieCalculator';
import LengthCalculator from '@/components/calculators/LengthCalculator';
import FractionCalculator from '@/components/calculators/FractionCalculator';
import QuadraticCalculator from '@/components/calculators/QuadraticCalculator';
import TemperatureCalculator from '@/components/calculators/TemperatureCalculator';
import InflationCalculator from '@/components/calculators/InflationCalculator';
import SalesTaxCalculator from '@/components/calculators/SalesTaxCalculator';
import PercentageCalculator from '@/components/calculators/PercentageCalculator';
import RandomNumberGenerator from '@/components/calculators/RandomNumberGenerator';
import TriangleCalculator from '@/components/calculators/TriangleCalculator';
import BodyFatCalculator from '@/components/calculators/BodyFatCalculator';
import IdealWeightCalculator from '@/components/calculators/IdealWeightCalculator';
import PaceCalculator from '@/components/calculators/PaceCalculator';
import PregnancyCalculator from '@/components/calculators/PregnancyCalculator';
import GpaCalculator from '@/components/calculators/GpaCalculator';
import ConcreteCalculator from '@/components/calculators/ConcreteCalculator';
import SubnetCalculator from '@/components/calculators/SubnetCalculator';
import PasswordGenerator from '@/components/calculators/PasswordGenerator';
import PaypalFeeCalculator from '@/components/calculators/PaypalFeeCalculator';
import ImageCompressor from '@/components/calculators/ImageCompressor';
import ImageResizer from '@/components/calculators/ImageResizer';
import FancyFontGenerator from '@/components/calculators/FancyFontGenerator';
import QrCodeGenerator from '@/components/calculators/QrCodeGenerator';
import WordCounter from '@/components/calculators/WordCounter';
import DuplicateSentenceChecker from '@/components/calculators/DuplicateSentenceChecker';
import CryptoConverter from '@/components/calculators/CryptoConverter';
import ColourConverter from '@/components/calculators/ColourConverter';
import DateCalculator from '@/components/calculators/DateCalculator';
import Stopwatch from '@/components/calculators/Stopwatch';
import TimeCalculator from '@/components/calculators/TimeCalculator';
import WorldClock from '@/components/calculators/WorldClock';

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
    { name: 'CTR', icon: MousePointerClick, component: <CtrCalculator />, value: 'ctr', category: 'marketing' },
    { name: 'Exit Rate', icon: LogOut, component: <ExitRateCalculator />, value: 'exit-rate', category: 'marketing' },
    { name: 'AdSense', icon: DollarSign, component: <AdsenseCalculator />, value: 'adsense', category: 'marketing' },
    { name: 'GRP', icon: Tv, component: <GrpCalculator />, value: 'grp', category: 'marketing' },
    { name: 'AVM', icon: Film, component: <AvmCalculator />, value: 'avm', category: 'marketing' },
    { name: 'Standard', icon: Calculator, component: <SimpleCalculator />, value: 'simple', category: 'math-general' },
    { name: 'Percentage', icon: Percent, component: <PercentageCalculator />, value: 'percentage', category: 'math-general' },
    { name: 'Printing', icon: Printer, component: <PrintingCalculator/>, value: 'printing', category: 'math-general' },
    { name: 'EVM', icon: ClipboardList, component: <EvmCalculator />, value: 'evm', category: 'math-general' },
    { name: 'Length', icon: Ruler, component: <LengthCalculator />, value: 'length', category: 'math-general' },
    { name: 'Temperature', icon: Thermometer, component: <TemperatureCalculator />, value: 'temperature', category: 'math-general' },
    { name: 'Fraction', icon: Divide, component: <FractionCalculator />, value: 'fraction', category: 'math-general' },
    { name: 'Random Number', icon: Shuffle, component: <RandomNumberGenerator />, value: 'random-number', category: 'math-general' },
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
    { name: 'Date Calculator', icon: CalendarClock, component: <DateCalculator />, value: 'date-calculator', category: 'tools' },
    { name: 'Stopwatch', icon: Timer, component: <Stopwatch />, value: 'stopwatch', category: 'tools' },
    { name: 'Time Calculator', icon: CalendarClock, component: <TimeCalculator />, value: 'time-calculator', category: 'tools' },
    { name: 'World Clock', icon: Gift, component: <WorldClock />, value: 'world-clock', category: 'tools' }
];

export const categories = [
    { name: 'Financial', slug: 'financial', icon: Coins, calculators: calculators.filter(c => c.category === 'financial') },
    { name: 'Marketing & Web', slug: 'marketing', icon: MousePointerClick, calculators: calculators.filter(c => c.category === 'marketing') },
    { name: 'Math & General', slug: 'math-general', icon: Calculator, calculators: calculators.filter(c => c.category === 'math-general') },
    { name: 'Health & Fitness', slug: 'health', icon: HeartPulse, calculators: calculators.filter(c => c.category === 'health') },
    { name: 'Science & Education', slug: 'science-education', icon: FlaskConical, calculators: calculators.filter(c => c.category === 'science-education') },
    { name: 'Construction & IT', slug: 'construction-it', icon: HardHat, calculators: calculators.filter(c => c.category === 'construction-it') },
    { name: 'Tools', slug: 'tools', icon: KeyRound, calculators: calculators.filter(c => c.category === 'tools') },
];

  export const CURRENCIES = [
    { value: 'USD', label: 'USD - United States Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'GBP', label: 'GBP - British Pound Sterling' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'CHF', label: 'CHF - Swiss Franc' },
    { value: 'CNY', label: 'CNY - Chinese Yuan' },
    { value: 'SEK', label: 'SEK - Swedish Krona' },
    { value: 'NZD', label: 'NZD - New Zealand Dollar' },
    { value: 'INR', label: 'INR - Indian Rupee' },
  ];

  export const CRYPTOCURRENCIES = [
    { value: 'BTC', label: 'BTC - Bitcoin' },
    { value: 'ETH', label: 'ETH - Ethereum' },
    { value: 'USDT', label: 'USDT - Tether' },
    { value: 'BNB', label: 'BNB - Binance Coin' },
    { value: 'SOL', label: 'SOL - Solana' },
    { value: 'XRP', label: 'XRP - XRP' },
    { value: 'DOGE', label: 'DOGE - Dogecoin' },
    { value: 'ADA', label: 'ADA - Cardano' },
  ];

  export const US_STATES = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', 'label': 'Wyoming' },
  ];

  export const LENGTH_UNITS = [
    { value: 'meters', label: 'Meters' },
    { value: 'kilometers', label: 'Kilometers' },
    { value: 'centimeters', label: 'Centimeters' },
    { value: 'millimeters', label: 'Millimeters' },
    { value: 'miles', label: 'Miles' },
    { value: 'yards', label: 'Yards' },
    { value: 'feet', label: 'Feet' },
    { value: 'inches', label: 'Inches' },
    { value: 'nautical_miles', label: 'Nautical Miles' },
  ];
  
  export const LENGTH_CONVERSION_FACTORS: Record<string, number> = {
    meters: 1,
    kilometers: 1000,
    centimeters: 0.01,
    millimeters: 0.001,
    miles: 1609.34,
    yards: 0.9144,
    feet: 0.3048,
    inches: 0.0254,
    nautical_miles: 1852,
  };

  export const TEMPERATURE_UNITS = [
    { value: 'celsius', label: 'Celsius' },
    { value: 'fahrenheit', label: 'Fahrenheit' },
    { value: 'kelvin', label: 'Kelvin' },
  ];
