import {
  Coins, Percent, Calculator, PiggyBank, BarChartBig, Archive, MousePointerClick, LogOut, DollarSign, Tv, Scale, WalletCards, Film, ClipboardList, FlaskConical, Printer, LineChart, Sigma, HeartPulse, Receipt, Zap, Ruler, Divide, Thermometer, Landmark, Home, TrendingUp, Shuffle, Footprints, Baby, GraduationCap, HardHat, Network, KeyRound, Image, Crop, Type, QrCode, FileText, ScanSearch, Bitcoin, Palette, Clock, Timer, Globe, Triangle, Users, Play, Bell, Gauge, Puzzle, Scissors, FileType, FileUp, Text, Clapperboard, RotateCcw, FileCog, Youtube, Trash2, PenSquare, Shield, Wand2, Building, Target
} from 'lucide-react';
import CurrencyConverter from '@/components/calculators/CurrencyConverter';
import CryptoConverter from '@/components/calculators/CryptoConverter';
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
import ColourConverter from '@/components/calculators/ColourConverter';
import DateCalculator from '@/components/calculators/DateCalculator';
import DigitalClock from '@/components/calculators/DigitalClock';
import Stopwatch from '@/components/calculators/Stopwatch';
import Countdown from '@/components/calculators/Countdown';
import IntervalTimer from '@/components/calculators/IntervalTimer';
import AlarmClock from '@/components/calculators/AlarmClock';
import Metronome from '@/components/calculators/Metronome';
import ChessClock from '@/components/calculators/ChessClock';
import BackgroundRemover from '@/components/calculators/BackgroundRemover';
import ImageToPdf from '@/components/calculators/ImageToPdf';
import ImageToJpg from '@/components/calculators/ImageToJpg';
import ImageUpscaler from '@/components/calculators/ImageUpscaler';
import ImageToText from '@/components/calculators/ImageToText';
import ImageToVideo from '@/components/calculators/ImageToVideo';
import RemoveText from '@/components/calculators/RemoveText';
import ObjectRemover from '@/components/calculators/ObjectRemover';
import MergePdf from '@/components/calculators/MergePdf';
import SplitPdf from '@/components/calculators/SplitPdf';
import WordToPdf from '@/components/calculators/WordToPdf';
import PowerpointToPdf from '@/components/calculators/PowerpointToPdf';
import ExcelToPdf from '@/components/calculators/ExcelToPdf';
import HtmlToPdf from '@/components/calculators/HtmlToPdf';
import PdfToJpg from '@/components/calculators/PdfToJpg';
import PdfToWord from '@/components/calculators/PdfToWord';
import PdfToPowerpoint from '@/components/calculators/PdfToPowerpoint';
import PdfToExcel from '@/components/calculators/PdfToExcel';
import RepairPdf from '@/components/calculators/RepairPdf';
import RotatePdf from '@/components/calculators/RotatePdf';
import YoutubeThumbnailExtractor from '@/components/calculators/YoutubeThumbnailExtractor';
import YoutubeTagsExtractor from '@/components/calculators/YoutubeTagsExtractor';

export const calculators = [
    { name: 'Currency', icon: Coins, component: CurrencyConverter, value: 'currency', category: 'financial' },
    { name: 'Crypto', icon: Bitcoin, component: CryptoConverter, value: 'crypto', category: 'financial' },
    { name: 'Loan', icon: Landmark, component: LoanCalculator, value: 'loan', category: 'financial' },
    { name: 'Retirement', icon: PiggyBank, component: RetirementCalculator, value: 'retirement', category: 'financial' },
    { name: 'Contrib. Margin', icon: BarChartBig, component: ContributionMarginCalculator, value: 'contribution-margin', category: 'financial' },
    { name: 'COGS', icon: Archive, component: CogsCalculator, value: 'cogs', category: 'financial' },
    { name: 'Lerner Index', icon: Scale, component: LernerIndexCalculator, value: 'lerner-index', category: 'financial' },
    { name: 'Liquid Net Worth', icon: WalletCards, component: LiquidNetWorthCalculator, value: 'liquid-net-worth', category: 'financial' },
    { name: 'Salary', icon: Receipt, component: SalaryCalculator, value: 'salary', category: 'financial' },
    { name: 'Inflation', icon: TrendingUp, component: InflationCalculator, value: 'inflation', category: 'financial' },
    { name: 'Sales Tax', icon: Percent, component: SalesTaxCalculator, value: 'sales-tax', category: 'financial' },
    { name: 'PayPal Fee', icon: Home, component: PaypalFeeCalculator, value: 'paypal-fee', category: 'financial' },
    { name: 'CPC/CPM', icon: MousePointerClick, component: CpcCpmCalculator, value: 'cpc-cpm', category: 'marketing' },
    { name: 'CTR', icon: MousePointerClick, component: CtrCalculator, value: 'ctr', category: 'marketing' },
    { name: 'Exit Rate', icon: LogOut, component: ExitRateCalculator, value: 'exit-rate', category: 'marketing' },
    { name: 'AdSense', icon: DollarSign, component: AdsenseCalculator, value: 'adsense', category: 'marketing' },
    { name: 'GRP', icon: Tv, component: GrpCalculator, value: 'grp', category: 'marketing' },
    { name: 'AVM', icon: Film, component: AvmCalculator, value: 'avm', category: 'marketing' },
    { name: 'YT Thumbnail Extractor', icon: Youtube, component: YoutubeThumbnailExtractor, value: 'yt-thumbnail-extractor', category: 'marketing' },
    { name: 'YT Tags Extractor', icon: Youtube, component: YoutubeTagsExtractor, value: 'yt-tags-extractor', category: 'marketing' },
    { name: 'Standard', icon: Calculator, component: SimpleCalculator, value: 'simple', category: 'math-general' },
    { name: 'Percentage', icon: Percent, component: PercentageCalculator, value: 'percentage', category: 'math-general' },
    { name: 'Printing', icon: Printer, component: PrintingCalculator, value: 'printing', category: 'math-general' },
    { name: 'EVM', icon: ClipboardList, component: EvmCalculator, value: 'evm', category: 'math-general' },
    { name: 'Length', icon: Ruler, component: LengthCalculator, value: 'length', category: 'math-general' },
    { name: 'Temperature', icon: Thermometer, component: TemperatureCalculator, value: 'temperature', category: 'math-general' },
    { name: 'Fraction', icon: Divide, component: FractionCalculator, value: 'fraction', category: 'math-general' },
    { name: 'Random Number', icon: Shuffle, component: RandomNumberGenerator, value: 'random-number', category: 'math-general' },
    { name: 'BMI', icon: HeartPulse, component: BmiCalculator, value: 'bmi', category: 'health' },
    { name: 'Body Fat', icon: HeartPulse, component: BodyFatCalculator, value: 'body-fat', category: 'health' },
    { name: 'Calorie', icon: Zap, component: CalorieCalculator, value: 'calorie', category: 'health' },
    { name: 'Ideal Weight', icon: HeartPulse, component: IdealWeightCalculator, value: 'ideal-weight', category: 'health' },
    { name: 'Pace', icon: Footprints, component: PaceCalculator, value: 'pace', category: 'health' },
    { name: 'Pregnancy', icon: Baby, component: PregnancyCalculator, value: 'pregnancy', category: 'health' },
    { name: 'Scientific', icon: FlaskConical, component: ScientificCalculator, value: 'scientific', category: 'science-education' },
    { name: 'Graphing', icon: LineChart, component: GraphingCalculator, value: 'graphing', category: 'science-education' },
    { name: 'Quadratic', icon: Sigma, component: QuadraticCalculator, value: 'quadratic', category: 'science-education' },
    { name: 'Triangle', icon: Triangle, component: TriangleCalculator, value: 'triangle', category: 'science-education' },
    { name: 'Statistics', icon: Sigma, component: StatisticsCalculator, value: 'statistics', category: 'science-education' },
    { name: 'GPA', icon: GraduationCap, component: GpaCalculator, value: 'gpa', category: 'science-education' },
    { name: 'Concrete', icon: HardHat, component: ConcreteCalculator, value: 'concrete', category: 'construction-it' },
    { name: 'Subnet', icon: Network, component: SubnetCalculator, value: 'subnet', category: 'construction-it' },
    { name: 'Image Upscaler', icon: FileUp, component: ImageUpscaler, value: 'image-upscaler', category: 'image' },
    { name: 'Image Resizer', icon: Crop, component: ImageResizer, value: 'image-resizer', category: 'image' },
    { name: 'Image Compressor', icon: Image, component: ImageCompressor, value: 'image-compressor', category: 'image' },
    { name: 'Background Remover', icon: Scissors, component: BackgroundRemover, value: 'background-remover', category: 'image' },
    { name: 'Change Background', icon: Palette, component: BackgroundRemover, value: 'change-background', category: 'image' },
    { name: 'Magic Eraser', icon: Wand2, component: ObjectRemover, value: 'magic-eraser', category: 'image' },
    { name: 'Remove People', icon: Users, component: ObjectRemover, value: 'remove-people', category: 'image' },
    { name: 'Remove Objects', icon: Trash2, component: ObjectRemover, value: 'remove-objects', category: 'image' },
    { name: 'Remove Text from Image', icon: Text, component: RemoveText, value: 'remove-text-from-image', category: 'image' },
    { name: 'Image to JPG', icon: Image, component: ImageToJpg, value: 'image-to-jpg', category: 'image' },
    { name: 'Image to Text', icon: Text, component: ImageToText, value: 'image-to-text', category: 'image' },
    { name: 'Image to Video', icon: Clapperboard, component: ImageToVideo, value: 'image-to-video', category: 'image' },
    { name: 'Signature BG Remover', icon: PenSquare, component: BackgroundRemover, value: 'signature-bg-remover', category: 'image' },
    { name: 'Logo BG Remover', icon: Shield, component: BackgroundRemover, value: 'logo-bg-remover', category: 'image' },
    { name: 'Password', icon: KeyRound, component: PasswordGenerator, value: 'password-generator', category: 'tools' },
    { name: 'Fancy Fonts', icon: Type, component: FancyFontGenerator, value: 'fancy-font-generator', category: 'tools' },
    { name: 'QR Code', icon: QrCode, component: QrCodeGenerator, value: 'qr-code-generator', category: 'tools' },
    { name: 'Word Counter', icon: FileText, component: WordCounter, value: 'word-counter', category: 'tools' },
    { name: 'Duplicate Checker', icon: ScanSearch, component: DuplicateSentenceChecker, value: 'duplicate-sentence-checker', category: 'tools' },
    { name: 'Colour Converter', icon: Palette, component: ColourConverter, value: 'colour-converter', category: 'tools' },
    { name: 'Date Calculator', icon: Clock, component: DateCalculator, value: 'date-calculator', category: 'tools' },
    { name: 'Digital Clock', icon: Clock, component: DigitalClock, value: 'digital-clock', category: 'clock-watch' },
    { name: 'Stopwatch', icon: Timer, component: Stopwatch, value: 'stopwatch', category: 'clock-watch' },
    { name: 'Countdown', icon: Timer, component: Countdown, value: 'countdown', category: 'clock-watch' },
    { name: 'Interval Timer', icon: Play, component: IntervalTimer, value: 'interval-timer', category: 'clock-watch' },
    { name: 'Alarm Clock', icon: Bell, component: AlarmClock, value: 'alarm-clock', category: 'clock-watch' },
    { name: 'Metronome', icon: Gauge, component: Metronome, value: 'metronome', category: 'clock-watch' },
    { name: 'Chess Clock', icon: Users, component: ChessClock, value: 'chess-clock', category: 'clock-watch' },
    { name: 'Image to PDF', icon: FileType, component: ImageToPdf, value: 'image-to-pdf', category: 'pdf' },
    { name: 'JPG to PDF', icon: FileType, component: ImageToPdf, value: 'jpg-to-pdf', category: 'pdf' },
    { name: 'Merge PDF', icon: Puzzle, component: MergePdf, value: 'merge-pdf', category: 'pdf' },
    { name: 'Split PDF', icon: Puzzle, component: SplitPdf, value: 'split-pdf', category: 'pdf' },
    { name: 'Word to PDF', icon: FileType, component: WordToPdf, value: 'word-to-pdf', category: 'pdf' },
    { name: 'PowerPoint to PDF', icon: FileType, component: PowerpointToPdf, value: 'powerpoint-to-pdf', category: 'pdf' },
    { name: 'Excel to PDF', icon: FileType, component: ExcelToPdf, value: 'excel-to-pdf', category: 'pdf' },
    { name: 'HTML to PDF', icon: FileType, component: HtmlToPdf, value: 'html-to-pdf', category: 'pdf' },
    { name: 'PDF to JPG', icon: Image, component: PdfToJpg, value: 'pdf-to-jpg', category: 'pdf' },
    { name: 'PDF to Word', icon: FileType, component: PdfToWord, value: 'pdf-to-word', category: 'pdf' },
    { name: 'PDF to PowerPoint', icon: FileType, component: PdfToPowerpoint, value: 'pdf-to-powerpoint', category: 'pdf' },
    { name: 'PDF to Excel', icon: FileType, component: PdfToExcel, value: 'pdf-to-excel', category: 'pdf' },
    { name: 'Repair PDF', icon: FileCog, component: RepairPdf, value: 'repair-pdf', category: 'pdf' },
    { name: 'Rotate PDF', icon: RotateCcw, component: RotatePdf, value: 'rotate-pdf', category: 'pdf' },
    { name: 'Add page numbers', icon: FileType, component: RotatePdf, value: 'add-page-numbers', category: 'pdf' },
    { name: 'Add watermark', icon: FileType, component: RotatePdf, value: 'add-watermark', category: 'pdf' },
    { name: 'Crop PDF', icon: Crop, component: RotatePdf, value: 'crop-pdf', category: 'pdf' },
    { name: 'Edit PDF', icon: FileCog, component: RotatePdf, value: 'edit-pdf', category: 'pdf' },
    { name: 'Unlock PDF', icon: KeyRound, component: RotatePdf, value: 'unlock-pdf', category: 'pdf' },
    { name: 'Protect PDF', icon: KeyRound, component: RotatePdf, value: 'protect-pdf', category: 'pdf' },
    { name: 'Sign PDF', icon: FileType, component: RotatePdf, value: 'sign-pdf', category: 'pdf' },
    { name: 'Redact PDF', icon: Scissors, component: RotatePdf, value: 'redact-pdf', category: 'pdf' },
    { name: 'Compare PDF', icon: FileType, component: RotatePdf, value: 'compare-pdf', category: 'pdf' },
];

export const categories = [
    { name: 'Financial', slug: 'financial', icon: Landmark, calculators: calculators.filter(c => c.category === 'financial') },
    { name: 'Marketing & Web', slug: 'marketing', icon: Target, calculators: calculators.filter(c => c.category === 'marketing') },
    { name: 'Math & General', slug: 'math-general', icon: Sigma, calculators: calculators.filter(c => c.category === 'math-general') },
    { name: 'Health & Fitness', slug: 'health', icon: HeartPulse, calculators: calculators.filter(c => c.category === 'health') },
    { name: 'Science & Education', slug: 'science-education', icon: FlaskConical, calculators: calculators.filter(c => c.category === 'science-education') },
    { name: 'Construction & IT', slug: 'construction-it', icon: Building, calculators: calculators.filter(c => c.category === 'construction-it') },
    { name: 'Image', slug: 'image', icon: Image, calculators: calculators.filter(c => c.category === 'image') },
    { name: 'Tools', slug: 'tools', icon: KeyRound, calculators: calculators.filter(c => c.category === 'tools') },
    { name: 'Clock & Watch', slug: 'clock-watch', icon: Clock, calculators: calculators.filter(c => c.category === 'clock-watch') },
    { name: 'PDF', slug: 'pdf', icon: FileText, calculators: calculators.filter(c => c.category === 'pdf') },
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
    { value: 'WY', label: 'Wyoming' },
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
